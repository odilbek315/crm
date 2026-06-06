export interface IntegrationDefinition {
  id: string;
  name: string;
  category: 'Messaging' | 'Payment' | 'ERP' | 'Workspace';
  status: 'active' | 'inactive' | 'configuring' | 'error';
  vendor: string;
  version: string;
}

export interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
}

/**
 * Enterprise Integration Hub
 * Manages configurations for external system connectors and bi-directional webhooks.
 */
class IntegrationHubService {
  private connectors: IntegrationDefinition[] = [
    { id: 'int-tg', name: 'Telegram Bot API', category: 'Messaging', status: 'active', vendor: 'Telegram', version: '2.0' },
    { id: 'int-wa', name: 'WhatsApp Business', category: 'Messaging', status: 'inactive', vendor: 'Meta', version: '1.5' },
    { id: 'int-stripe', name: 'Stripe Payments', category: 'Payment', status: 'active', vendor: 'Stripe', version: '2023-10' },
    { id: 'int-1c', name: '1C:Enterprise', category: 'ERP', status: 'inactive', vendor: '1C', version: '8.3' },
    { id: 'int-sap', name: 'SAP S/4HANA', category: 'ERP', status: 'configuring', vendor: 'SAP', version: 'cloud' },
    { id: 'int-gw', name: 'Google Workspace', category: 'Workspace', status: 'active', vendor: 'Google', version: 'v3' },
    { id: 'int-m365', name: 'Microsoft 365', category: 'Workspace', status: 'inactive', vendor: 'Microsoft', version: 'v1.0' },
  ];

  private webhooks: WebhookConfig[] = [];

  getConnectors(): IntegrationDefinition[] {
    return [...this.connectors];
  }

  registerWebhook(config: Omit<WebhookConfig, 'id'>): WebhookConfig {
    const hook = { id: crypto.randomUUID(), ...config };
    this.webhooks.push(hook);
    console.log(`[IntegrationHub] Webhook registered for events: ${config.events.join(', ')}`);
    return hook;
  }

  getWebhooks(): WebhookConfig[] {
    return [...this.webhooks];
  }
}

export const IntegrationHub = new IntegrationHubService();
