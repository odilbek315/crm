import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with ERP and CRM data...');

  // Delete existing records to avoid unique constraints violations on re-run
  await prisma.invoiceItem.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.deal.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.employee.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.approval.deleteMany({});
  await prisma.organization.deleteMany({});

  // 1. Create Organization
  const org = await prisma.organization.create({
    data: {
      name: 'B2B CRM',
    },
  });
  console.log(`Created organization: ${org.name} (${org.id})`);

  // 2. Create Administrator
  const passwordHash = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Alex Thompson',
      email: 'alex@b2b-crm.uz',
      passwordHash,
      role: 'Administrator',
      organizationId: org.id,
    },
  });
  console.log(`Created admin user: ${admin.name} (${admin.email})`);

  // 3. Seed Customers
  const customersData = [
    { name: 'Acme Corporation', email: 'billing@acme.com', phone: '+1 555-0101', company: 'Acme Corp', status: 'Active', value: 120000 },
    { name: 'Initech LLC', email: 'finance@initech.com', phone: '+1 555-0102', company: 'Initech', status: 'Active', value: 45000 },
    { name: 'Wayne Enterprises', email: 'bruce@wayne.corp', phone: '+1 555-0107', company: 'Wayne Ent.', status: 'Active', value: 12000000 },
    { name: 'Stark Industries', email: 'pepper@stark.com', phone: '+1 555-0106', company: 'Stark Ind.', status: 'Active', value: 9500000 },
    { name: 'Tyrell Corporation', email: 'replicant@tyrell.io', phone: '+1 555-0108', company: 'Tyrell Corp', status: 'Inactive', value: 320000 }
  ];

  const customers = [];
  for (const cust of customersData) {
    const customer = await prisma.customer.create({
      data: {
        ...cust,
        organizationId: org.id,
      },
    });
    customers.push(customer);
    console.log(`Created customer: ${customer.name}`);
  }

  const acme = customers.find(c => c.name.startsWith('Acme'));
  const initech = customers.find(c => c.name.startsWith('Initech'));
  const wayne = customers.find(c => c.name.startsWith('Wayne'));
  const stark = customers.find(c => c.name.startsWith('Stark'));

  // 4. Seed Deals
  const dealsData = [
    { title: 'Acme Cloud Migration', value: 85000, stage: 'Prospecting', customerId: acme?.id, organizationId: org.id },
    { title: 'Initech ERP Rollout', value: 45000, stage: 'Meeting Scheduled', customerId: initech?.id, organizationId: org.id },
    { title: 'Wayne Corp Security Audit', value: 250000, stage: 'Proposal Sent', customerId: wayne?.id, organizationId: org.id },
    { title: 'Stark Industries Arc Reactor Suite', value: 9500000, stage: 'Negotiation', customerId: stark?.id, organizationId: org.id }
  ];

  for (const deal of dealsData) {
    await prisma.deal.create({ data: deal });
    console.log(`Created deal: ${deal.title}`);
  }

  // 5. Seed Products
  const productsData = [
    { name: 'Pro Device Model A', sku: 'SKU-PRD-1001', category: 'Hardware', price: 500, cost: 250, stock: 50, organizationId: org.id },
    { name: 'Pro Device Model B', sku: 'SKU-PRD-1002', category: 'Hardware', price: 800, cost: 400, stock: 30, organizationId: org.id },
    { name: 'Enterprise ERP Software License', sku: 'SKU-PRD-1003', category: 'Software', price: 5000, cost: 1000, stock: 100, organizationId: org.id },
    { name: 'Cloud Storage 1TB (Annual)', sku: 'SKU-PRD-1004', category: 'Services', price: 120, cost: 20, stock: 500, organizationId: org.id }
  ];

  const products = [];
  for (const p of productsData) {
    const product = await prisma.product.create({ data: p });
    products.push(product);
    console.log(`Created product: ${product.name}`);
  }

  const prodA = products.find(p => p.sku === 'SKU-PRD-1001');
  const prodB = products.find(p => p.sku === 'SKU-PRD-1002');
  const prodSoft = products.find(p => p.sku === 'SKU-PRD-1003');

  // 6. Seed Invoices and Nested InvoiceItems
  const invoice1 = await prisma.invoice.create({
    data: {
      amount: 5500,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days out
      status: 'Paid',
      customerId: acme?.id,
      organizationId: org.id,
      items: {
        create: [
          { quantity: 1, price: 5000, productId: prodSoft.id },
          { quantity: 1, price: 500, productId: prodA.id }
        ]
      }
    }
  });
  console.log(`Created Paid Invoice for Acme (ID: ${invoice1.id}, Amount: $5500)`);

  const invoice2 = await prisma.invoice.create({
    data: {
      amount: 800,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days out
      status: 'Unpaid',
      customerId: initech?.id,
      organizationId: org.id,
      items: {
        create: [
          { quantity: 1, price: 800, productId: prodB.id }
        ]
      }
    }
  });
  console.log(`Created Unpaid Invoice for Initech (ID: ${invoice2.id}, Amount: $800)`);

  const invoice3 = await prisma.invoice.create({
    data: {
      amount: 10000,
      dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago (overdue)
      status: 'Overdue',
      customerId: stark?.id,
      organizationId: org.id,
      items: {
        create: [
          { quantity: 2, price: 5000, productId: prodSoft.id }
        ]
      }
    }
  });
  console.log(`Created Overdue Invoice for Stark Ind. (ID: ${invoice3.id}, Amount: $10000)`);

  // 7. Seed Leads
  const leadsData = [
    { name: 'John Doe', email: 'john@acmesolutions.com', company: 'Acme Solutions', source: 'Website', status: 'New', score: 85, organizationId: org.id },
    { name: 'Sarah Connor', email: 'connor@cyberdyne.com', company: 'Cyberdyne Systems', source: 'Referral', status: 'Contacted', score: 90, organizationId: org.id },
    { name: 'Peter Parker', email: 'peter@dailybugle.com', company: 'Daily Bugle', source: 'Cold Call', status: 'Qualified', score: 75, organizationId: org.id },
    { name: 'Clark Kent', email: 'kent@dailyplanet.com', company: 'Daily Planet', source: 'Conference', status: 'Proposal', score: 95, organizationId: org.id }
  ];
  for (const lead of leadsData) {
    await prisma.lead.create({ data: lead });
  }
  console.log('Seeded Leads');

  // 8. Seed Tasks
  const tasksData = [
    { title: 'Review quarterly performance metrics', description: 'Review the Q3 marketing and sales pipeline metrics.', status: 'TODO', priority: 'HIGH', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), organizationId: org.id },
    { title: 'Follow up on Wayne Corp Security Audit', description: 'Send proposal updates to Bruce Wayne.', status: 'IN_PROGRESS', priority: 'MEDIUM', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), organizationId: org.id },
    { title: 'Deploy marketing campaign', description: 'Launch the summer ad campaigns.', status: 'DONE', priority: 'LOW', dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), organizationId: org.id }
  ];
  for (const task of tasksData) {
    await prisma.task.create({ data: task });
  }
  console.log('Seeded Tasks');

  // 9. Seed Employees
  const employeesData = [
    { name: 'Sarah Chen', email: 'sarah@b2b-crm.uz', department: 'Sales', role: 'Sales Manager', status: 'Active', organizationId: org.id },
    { name: 'James Wilson', email: 'james@b2b-crm.uz', department: 'Warehouse', role: 'Warehouse Manager', status: 'Active', organizationId: org.id },
    { name: 'Maria Garcia', email: 'maria@b2b-crm.uz', department: 'HR', role: 'HR Manager', status: 'Active', organizationId: org.id },
    { name: 'David Kim', email: 'david@b2b-crm.uz', department: 'Finance', role: 'Accountant', status: 'Active', organizationId: org.id }
  ];
  for (const emp of employeesData) {
    await prisma.employee.create({ data: emp });
  }
  console.log('Seeded Employees');

  // 10. Seed Documents
  const docsData = [
    { title: 'Document_Agreement_Q3.pdf', type: 'Contract', size: 1024 * 1024 * 3, url: '/files/agreement_q3.pdf', status: 'Approved', organizationId: org.id },
    { title: 'Invoice_1001.pdf', type: 'Invoice', size: 1024 * 512, url: '/files/invoice_1001.pdf', status: 'Approved', organizationId: org.id },
    { title: 'Marketing_Strategy_2026.pdf', type: 'Report', size: 1024 * 1024 * 5, url: '/files/marketing_2026.pdf', status: 'Draft', organizationId: org.id }
  ];
  for (const doc of docsData) {
    await prisma.document.create({ data: doc });
  }
  console.log('Seeded Documents');

  // 11. Seed Approvals
  const approvalsData = [
    { title: 'Q3 Marketing Budget Request', type: 'Expense', status: 'Pending', requesterId: admin.id, amount: 45000, organizationId: org.id },
    { title: 'Office Equipment Purchase', type: 'Purchase', status: 'Approved', requesterId: admin.id, amount: 3200, organizationId: org.id },
    { title: 'Server Upgrade Invoice', type: 'Invoice', status: 'Rejected', requesterId: admin.id, amount: 12500, organizationId: org.id }
  ];
  for (const app of approvalsData) {
    await prisma.approval.create({ data: app });
  }
  console.log('Seeded Approvals');

  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
