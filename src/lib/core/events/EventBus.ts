export type EventType = 
  | 'LeadCreated' 
  | 'DealWon' 
  | 'TaskCompleted' 
  | 'InvoiceCreated' 
  | 'CustomerUpdated'
  | 'UserLogin'
  | 'SystemError';

export interface EventPayload {
  tenantId?: string;
  entityId?: string;
  userId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

type EventHandler = (payload: EventPayload) => void | Promise<void>;

/**
 * Centralized Event Bus for SaaS Architecture
 * Handles pub/sub within the local simulation
 */
class EventBusService {
  private subscribers: Map<EventType, EventHandler[]> = new Map();

  subscribe(eventType: EventType, handler: EventHandler): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)!.push(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.subscribers.get(eventType);
      if (handlers) {
        this.subscribers.set(eventType, handlers.filter(h => h !== handler));
      }
    };
  }

  async publish(eventType: EventType, payload: Partial<EventPayload>): Promise<void> {
    const fullPayload: EventPayload = {
      timestamp: new Date().toISOString(),
      ...payload
    };

    console.log(`[EventBus] ${eventType} published:`, fullPayload);

    const handlers = this.subscribers.get(eventType) || [];
    
    // Execute all handlers concurrently
    await Promise.allSettled(handlers.map(handler => handler(fullPayload)));
  }
}

export const EventBus = new EventBusService();
