import { prisma } from '../prisma';

export interface WorkflowRule {
  id: string;
  name: string;
  triggerEvent: string;
  criteria: {
    field: string;
    value: string;
  };
  actionType: 'CREATE_TASK' | 'GENERATE_DOCUMENT' | 'SEND_NOTIFICATION';
  isActive: boolean;
  description: string;
}

export class WorkflowEngine {
  private static instance: WorkflowEngine;
  private rules: WorkflowRule[] = [];

  private constructor() {
    this.initializeRules();
  }

  public static getInstance(): WorkflowEngine {
    if (!WorkflowEngine.instance) {
      WorkflowEngine.instance = new WorkflowEngine();
    }
    return WorkflowEngine.instance;
  }

  private initializeRules() {
    this.rules = [
      {
        id: 'wf-task-01',
        name: 'Auto-create Meeting Task',
        triggerEvent: 'DEAL_STAGE_CHANGED',
        criteria: {
          field: 'stage',
          value: 'Meeting Scheduled'
        },
        actionType: 'CREATE_TASK',
        isActive: true,
        description: 'Auto-creates a high-priority follow-up Task when a deal stage becomes "Meeting Scheduled".'
      },
      {
        id: 'wf-doc-02',
        name: 'Auto-generate Draft Invoice/Contract',
        triggerEvent: 'DEAL_STAGE_CHANGED',
        criteria: {
          field: 'stage',
          value: 'Won'
        },
        actionType: 'GENERATE_DOCUMENT',
        isActive: true,
        description: 'Auto-generates a draft PDF Invoice/Contract stub when a deal is "Won".'
      },
      {
        id: 'wf-finance-03',
        name: 'Financial Invoice Paid Success',
        triggerEvent: 'FINANCIAL_INVOICE_PAID',
        criteria: {
          field: 'status',
          value: 'Paid'
        },
        actionType: 'SEND_NOTIFICATION',
        isActive: true,
        description: 'Automatically logs an internal success notification and audit log when an Invoice status updates to "Paid".'
      }
    ];
  }

  // Retrieve all workflow rules in memory
  public getRules(): WorkflowRule[] {
    return this.rules;
  }

  // Toggle rule state by ID
  public toggleRule(id: string): WorkflowRule | null {
    const rule = this.rules.find(r => r.id === id);
    if (rule) {
      rule.isActive = !rule.isActive;
      return rule;
    }
    return null;
  }

  // Evaluate trigger rules on events
  public async trigger(
    event: string, 
    context: { deal?: any; invoice?: any; organizationId: string; userId: string }
  ): Promise<void> {
    const { deal, invoice, organizationId, userId } = context;
    const entityName = deal ? `deal "${deal.title}"` : (invoice ? `invoice "${invoice.id.substring(0, 8)}"` : 'unknown');
    console.log(`[WorkflowEngine] Evaluating event "${event}" for ${entityName} (Org: ${organizationId})...`);

    const activeRules = this.rules.filter(r => r.triggerEvent === event && r.isActive);

    for (const rule of activeRules) {
      // Evaluate criteria
      const entity = event === 'FINANCIAL_INVOICE_PAID' ? invoice : deal;
      if (!entity) continue;
      const fieldValue = entity[rule.criteria.field];
      if (String(fieldValue).toLowerCase() === String(rule.criteria.value).toLowerCase()) {
        console.log(`[WorkflowEngine] Rule "${rule.name}" matches criteria. Executing action: ${rule.actionType}...`);
        
        try {
          if (rule.actionType === 'CREATE_TASK') {
            await this.executeCreateTask(rule, deal, organizationId, userId);
          } else if (rule.actionType === 'GENERATE_DOCUMENT') {
            await this.executeGenerateDocument(rule, deal, organizationId, userId);
          } else if (rule.actionType === 'SEND_NOTIFICATION') {
            await this.executeSendNotification(rule, invoice, organizationId, userId);
          }
        } catch (error) {
          console.error(`[WorkflowEngine] Failed to execute rule "${rule.name}":`, error);
        }
      }
    }
  }

  // Action: Create a task
  private async executeCreateTask(
    rule: WorkflowRule, 
    deal: any, 
    organizationId: string, 
    userId: string
  ) {
    const taskTitle = `Follow-up: ${deal.title}`;
    const taskDescription = `Automated task created because the deal "${deal.title}" transitioned to "Meeting Scheduled".`;
    
    // 3 days from now
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);

    // Create the task in database
    const task = await prisma.task.create({
      data: {
        title: taskTitle,
        description: taskDescription,
        status: 'TODO',
        priority: 'HIGH',
        dueDate,
        organizationId
      }
    });

    console.log(`[WorkflowEngine] [Notification Stub] Created Task "${task.title}" (ID: ${task.id})`);
    
    // Log execution in AuditLog
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'WORKFLOW_EXECUTION',
        entityType: 'Workflow',
        entityId: rule.id,
        changes: JSON.stringify({
          ruleName: rule.name,
          actionTaken: 'CREATE_TASK',
          createdEntityId: task.id,
          createdEntityTitle: task.title,
          details: taskDescription
        }),
        organizationId
      }
    });
  }

  // Action: Generate a document
  private async executeGenerateDocument(
    rule: WorkflowRule, 
    deal: any, 
    organizationId: string, 
    userId: string
  ) {
    const docTitle = `Contract - ${deal.title}`;
    const docType = 'PDF';
    const docStatus = 'Draft';
    const docSize = 2048; // 2 KB stub

    // Create the document stub in database
    const doc = await prisma.document.create({
      data: {
        title: docTitle,
        type: docType,
        status: docStatus,
        size: docSize,
        organizationId
      }
    });

    console.log(`[WorkflowEngine] [Notification Stub] Generated Document "${doc.title}" (ID: ${doc.id})`);

    // Log execution in AuditLog
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'WORKFLOW_EXECUTION',
        entityType: 'Workflow',
        entityId: rule.id,
        changes: JSON.stringify({
          ruleName: rule.name,
          actionTaken: 'GENERATE_DOCUMENT',
          createdEntityId: doc.id,
          createdEntityTitle: doc.title,
          details: `Draft contract PDF stub created for Won deal: "${deal.title}".`
        }),
        organizationId
      }
    });
  }

  // Action: Send notification / log internal notification
  private async executeSendNotification(
    rule: WorkflowRule,
    invoice: any,
    organizationId: string,
    userId: string
  ) {
    const details = `Invoice #${invoice.id.substring(0, 8)} of $${invoice.amount} has been successfully paid.`;
    console.log(`[WorkflowEngine] [Success Notification] ${details}`);

    // Log execution in AuditLog
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'WORKFLOW_EXECUTION',
        entityType: 'Workflow',
        entityId: rule.id,
        changes: JSON.stringify({
          ruleName: rule.name,
          actionTaken: 'SEND_NOTIFICATION',
          createdEntityId: invoice.id,
          createdEntityTitle: `Invoice #${invoice.id.substring(0, 8)}`,
          details
        }),
        organizationId
      }
    });
  }
}

export const workflowEngine = WorkflowEngine.getInstance();
