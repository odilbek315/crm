import { EventBus } from '../events/EventBus';

export type NotificationChannel = 'EMAIL' | 'SMS' | 'TELEGRAM' | 'IN_APP';

export interface NotificationTask {
  id: string;
  tenantId: string;
  userId: string;
  channels: NotificationChannel[];
  subject: string;
  body: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  createdAt: string;
}

/**
 * Notification Engine
 * Handles routing notifications to different simulated queues
 */
class NotificationEngineService {
  private emailQueue: NotificationTask[] = [];
  private smsQueue: NotificationTask[] = [];
  private telegramQueue: NotificationTask[] = [];

  constructor() {
    this.initializeEventListeners();
  }

  private initializeEventListeners() {
    EventBus.subscribe('DealWon', async (payload) => {
      if (payload.userId && payload.tenantId) {
        this.enqueue(payload.tenantId, payload.userId, ['EMAIL', 'IN_APP'], 'Deal Won!', `A new deal has been won for entity ${payload.entityId}`);
      }
    });

    EventBus.subscribe('LeadCreated', async (payload) => {
      if (payload.userId && payload.tenantId) {
         this.enqueue(payload.tenantId, payload.userId, ['IN_APP', 'TELEGRAM'], 'New Lead Assigned', `Lead ${payload.entityId} has been assigned to you.`);
      }
    });
  }

  enqueue(tenantId: string, userId: string, channels: NotificationChannel[], subject: string, body: string) {
    const task: NotificationTask = {
      id: crypto.randomUUID(),
      tenantId,
      userId,
      channels,
      subject,
      body,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    if (channels.includes('EMAIL')) this.emailQueue.push(task);
    if (channels.includes('SMS')) this.smsQueue.push(task);
    if (channels.includes('TELEGRAM')) this.telegramQueue.push(task);

    console.log(`[NotificationEngine] Enqueued to ${channels.join(', ')}: ${subject}`);
    
    // Simulate processing
    this.processQueues();
  }

  private processQueues() {
    // Simulate async queue processing
    setTimeout(() => {
      this.emailQueue = this.emailQueue.filter(t => t.status === 'PENDING').map(t => ({ ...t, status: 'SENT' }));
      this.smsQueue = this.smsQueue.filter(t => t.status === 'PENDING').map(t => ({ ...t, status: 'SENT' }));
      this.telegramQueue = this.telegramQueue.filter(t => t.status === 'PENDING').map(t => ({ ...t, status: 'SENT' }));
      if (this.emailQueue.length > 0) console.log('[NotificationEngine] Queues processed');
    }, 1000);
  }
}

export const NotificationEngine = new NotificationEngineService();
