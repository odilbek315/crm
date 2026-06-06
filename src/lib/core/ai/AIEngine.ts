import { EventBus } from '../events/EventBus';

export type AgentRole = 'SalesManager' | 'BusinessAnalyst' | 'CEOAssistant' | 'HRAssistant' | 'WorkflowAssistant';

export type InsightType = 'Risk' | 'Opportunity' | 'Optimization' | 'Alert' | 'Summary';

export interface AIInsight {
  id: string;
  tenantId: string;
  agentRole: AgentRole;
  type: InsightType;
  title: string;
  description: string;
  confidence: number;
  entityReference?: { type: string; id: string };
  createdAt: string;
}

export interface AgentHealth {
  role: AgentRole;
  status: 'Online' | 'Processing' | 'Sleeping' | 'Error';
  healthScore: number;
  tasksCompleted: number;
  lastActive: string;
}

/**
 * Intelligent Engine (Simulated Local AI)
 * Subscribes to the EventBus and generates insights asynchronously.
 */
class AIEngineService {
  private insights: AIInsight[] = [];
  
  public getAgents(): AgentHealth[] {
    return [
      { role: 'CEOAssistant', status: 'Online', healthScore: 100, tasksCompleted: 4521, lastActive: new Date().toISOString() },
      { role: 'SalesManager', status: 'Online', healthScore: 98, tasksCompleted: 1245, lastActive: new Date().toISOString() },
      { role: 'BusinessAnalyst', status: 'Processing', healthScore: 95, tasksCompleted: 890, lastActive: new Date().toISOString() },
      { role: 'HRAssistant', status: 'Sleeping', healthScore: 99, tasksCompleted: 340, lastActive: new Date().toISOString() },
      { role: 'WorkflowAssistant', status: 'Online', healthScore: 97, tasksCompleted: 678, lastActive: new Date().toISOString() },
    ];
  }

  public getInsights(tenantId: string, role?: AgentRole): AIInsight[] {
    // Generate some mock insights structurally on the fly for demo if empty
    if (this.insights.length === 0) {
      this.populateMockInsights(tenantId);
    }
    return this.insights.filter(i => i.tenantId === tenantId && (!role || i.agentRole === role))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  private populateMockInsights(tenantId: string) {
    this.insights = [
      {
        id: crypto.randomUUID(), tenantId, agentRole: 'CEOAssistant', type: 'Summary',
        title: 'Company Health Score: 92/100',
        description: 'Revenue growth is stable at 14%. Customer churn is at historic lows. Minor pipeline risk detected in Q3 enterprise segment.',
        confidence: 0.95, createdAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(), tenantId, agentRole: 'SalesManager', type: 'Opportunity',
        title: 'High Priority Lead: Acme Corp',
        description: 'Lead engagement pattern matches historically high-value enterprise accounts. Recommend assigning Senior Executive.',
        confidence: 0.88, entityReference: { type: 'Lead', id: 'l1' }, createdAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(), tenantId, agentRole: 'BusinessAnalyst', type: 'Risk',
        title: 'Q3 Margin Squeeze Projected',
        description: 'Server infrastructure costs are outpacing recurring revenue growth in EU tenant clusters.',
        confidence: 0.72, createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: crypto.randomUUID(), tenantId, agentRole: 'WorkflowAssistant', type: 'Optimization',
        title: 'Approval Bottleneck Detected',
        description: 'Invoice approvals are averaging 4.2 days. Automating approvals under $500 could save 120 hours/month.',
        confidence: 0.91, createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: crypto.randomUUID(), tenantId, agentRole: 'HRAssistant', type: 'Alert',
        title: 'Burnout Risk: Engineering Team B',
        description: 'Average task completion hours exceed 50/wk for 3 consecutive weeks. Recommend capacity review.',
        confidence: 0.85, createdAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];
  }

  constructor() {
    // Listen to system events to trigger local AI reactions
    EventBus.subscribe('DealWon', (payload) => this.analyzeDeal(payload));
  }

  private async analyzeDeal(payload: any) {
    console.log('[AIEngine] Analyzing won deal for patterns...', payload);
    // Simulate async analysis
  }
}

export const AIEngine = new AIEngineService();
