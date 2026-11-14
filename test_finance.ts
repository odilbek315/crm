import { PrismaClient } from '@prisma/client';
import { workflowEngine } from './src/server/services/workflowEngine';

const prisma = new PrismaClient();

async function runTests() {
  console.log('\x1b[36m%s\x1b[0m', '=== Starting Phase 4 Integration Tests ===');

  try {
    // 1. Fetch Organization and User to context
    const org = await prisma.organization.findFirst({
      where: { name: 'B2B CRM', deletedAt: null }
    });
    if (!org) throw new Error('Test org "B2B CRM" not found. Please run seed.js first.');

    const user = await prisma.user.findFirst({
      where: { organizationId: org.id, deletedAt: null }
    });
    if (!user) throw new Error('Test administrator user not found.');

    const customer = await prisma.customer.findFirst({
      where: { organizationId: org.id, deletedAt: null }
    });
    if (!customer) throw new Error('Test customer not found.');

    console.log('Context loaded: Org ID =', org.id, '| User ID =', user.id);

    // ==========================================
    // TEST 1: Verify Financial Aggregates
    // ==========================================
    console.log('\n\x1b[33m%s\x1b[0m', 'Test 1: Verifying Financial Aggregates...');

    const revenueAggregate = await prisma.invoice.aggregate({
      where: { organizationId: org.id, status: 'Paid', deletedAt: null },
      _sum: { amount: true }
    });
    const totalRevenue = revenueAggregate._sum.amount || 0;
    console.log(`- Total Paid Revenue in DB: $${totalRevenue}`);

    const receivablesAggregate = await prisma.invoice.aggregate({
      where: {
        organizationId: org.id,
        status: { in: ['Unpaid', 'Overdue'] },
        deletedAt: null
      },
      _sum: { amount: true }
    });
    const outstandingReceivables = receivablesAggregate._sum.amount || 0;
    console.log(`- Outstanding Receivables in DB: $${outstandingReceivables}`);

    // Verify inventory valuation
    const dbProducts = await prisma.product.findMany({
      where: { organizationId: org.id, deletedAt: null }
    });
    const inventoryValuation = dbProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
    console.log(`- Inventory Valuation: $${inventoryValuation}`);

    if (totalRevenue !== 5500) {
      throw new Error(`Expected total revenue to be $5500, got $${totalRevenue}`);
    }
    if (outstandingReceivables !== 10800) {
      throw new Error(`Expected outstanding receivables to be $10800, got $${outstandingReceivables}`);
    }
    console.log('\x1b[32m%s\x1b[0m', '✔ Test 1 Passed: Aggregates match expected seeded values.');

    // ==========================================
    // TEST 2: Transaction-Safe Invoicing & Stock Deduction
    // ==========================================
    console.log('\n\x1b[33m%s\x1b[0m', 'Test 2: Creating Invoice with Stock Deduction...');

    const prodA = dbProducts.find(p => p.sku === 'SKU-PRD-1001');
    const prodB = dbProducts.find(p => p.sku === 'SKU-PRD-1002');
    if (!prodA || !prodB) throw new Error('Seeded products not found.');

    const initialStockA = prodA.stock;
    const initialStockB = prodB.stock;
    console.log(`- Initial Stock - Product A: ${initialStockA}, Product B: ${initialStockB}`);

    const invoiceItems = [
      { productId: prodA.id, quantity: 5 },
      { productId: prodB.id, quantity: 2 }
    ];

    // Simulate backend invoice creation transaction
    const newInvoice = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const itemsToCreate = [];

      for (const item of invoiceItems) {
        const product = await tx.product.findFirst({
          where: { id: item.productId, organizationId: org.id, deletedAt: null }
        });

        if (!product) throw new Error('Product not found');
        if (product.stock < item.quantity) throw new Error('Insufficient stock');

        // Deduct stock
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: product.stock - item.quantity,
            status: (product.stock - item.quantity) === 0 ? 'Out of Stock' : 'In Stock'
          }
        });

        subtotal += product.price * item.quantity;
        itemsToCreate.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price
        });
      }

      const tax = subtotal * 0.1;
      const totalAmount = subtotal + tax;

      // Create Invoice
      const inv = await tx.invoice.create({
        data: {
          customerId: customer.id,
          organizationId: org.id,
          amount: totalAmount,
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days out
          status: 'Unpaid',
          items: {
            create: itemsToCreate
          }
        },
        include: {
          items: true
        }
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'INVOICE_ISSUED',
          entityType: 'Invoice',
          entityId: inv.id,
          changes: JSON.stringify({ subtotal, tax, totalAmount }),
          organizationId: org.id
        }
      });

      return inv;
    });

    console.log(`- Invoice Created: ID = ${newInvoice.id}, Amount = $${newInvoice.amount}`);
    
    // Verify stock is deducted
    const updatedProdA = await prisma.product.findUnique({ where: { id: prodA.id } });
    const updatedProdB = await prisma.product.findUnique({ where: { id: prodB.id } });

    console.log(`- Updated Stock - Product A: ${updatedProdA?.stock}, Product B: ${updatedProdB?.stock}`);
    
    if (updatedProdA?.stock !== initialStockA - 5) {
      throw new Error(`Expected Product A stock to be ${initialStockA - 5}, got ${updatedProdA?.stock}`);
    }
    if (updatedProdB?.stock !== initialStockB - 2) {
      throw new Error(`Expected Product B stock to be ${initialStockB - 2}, got ${updatedProdB?.stock}`);
    }

    // Verify AuditLog is written
    const auditLog = await prisma.auditLog.findFirst({
      where: { entityType: 'Invoice', entityId: newInvoice.id, action: 'INVOICE_ISSUED' }
    });
    if (!auditLog) throw new Error('Audit log entry for INVOICE_ISSUED was not created.');
    console.log('- Verified Audit Log INVOICE_ISSUED entry.');

    console.log('\x1b[32m%s\x1b[0m', '✔ Test 2 Passed: Invoice created and inventory deducted successfully.');

    // ==========================================
    // TEST 3: Trigger Workflow on Paid Invoice
    // ==========================================
    console.log('\n\x1b[33m%s\x1b[0m', 'Test 3: Triggers workflow on status update...');

    // 1. Update Invoice status to Paid
    const updatedInvoice = await prisma.invoice.update({
      where: { id: newInvoice.id },
      data: { status: 'Paid' },
      include: { customer: true, items: true }
    });

    // 2. Trigger Workflow Engine
    await workflowEngine.trigger('FINANCIAL_INVOICE_PAID', {
      invoice: updatedInvoice,
      organizationId: org.id,
      userId: user.id
    });

    // 3. Verify workflow execution log was written to the AuditLog table
    // The engine writes an AuditLog entry with action = 'WORKFLOW_EXECUTION' and entityId = rule.id ('wf-finance-03')
    const workflowLog = await prisma.auditLog.findFirst({
      where: {
        organizationId: org.id,
        action: 'WORKFLOW_EXECUTION',
        entityId: 'wf-finance-03'
      },
      orderBy: { timestamp: 'desc' }
    });

    if (!workflowLog) {
      throw new Error('Workflow execution log not found in AuditLog.');
    }

    const logChanges = JSON.parse(workflowLog.changes || '{}');
    console.log(`- Workflow Log: Action = ${logChanges.actionTaken}, Created Entity ID = ${logChanges.createdEntityId}`);
    console.log(`- Log Details: ${logChanges.details}`);

    if (logChanges.actionTaken !== 'SEND_NOTIFICATION') {
      throw new Error(`Expected actionTaken to be SEND_NOTIFICATION, got ${logChanges.actionTaken}`);
    }

    console.log('\x1b[32m%s\x1b[0m', '✔ Test 3 Passed: Invoice payment successfully triggered workflow.');

    // Clean up test invoice so database remains clean
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: newInvoice.id } });
    await prisma.invoice.delete({ where: { id: newInvoice.id } });
    await prisma.auditLog.deleteMany({
      where: {
        OR: [
          { entityType: 'Invoice', entityId: newInvoice.id },
          { action: 'WORKFLOW_EXECUTION', entityId: 'wf-finance-03' }
        ]
      }
    });
    // Reset product stocks
    await prisma.product.update({ where: { id: prodA.id }, data: { stock: initialStockA } });
    await prisma.product.update({ where: { id: prodB.id }, data: { stock: initialStockB } });

    console.log('\n\x1b[32m%s\x1b[0m', '=== All Phase 4 Integration Tests Passed Successfully! ===');
  } catch (error) {
    console.error('\n\x1b[31m%s\x1b[0m', '❌ Test Run Failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
