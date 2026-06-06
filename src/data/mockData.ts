import { Customer, Employee, Lead, Product, Task, Transaction, User, Document, Invoice, Deal, Activity, Note, AuditLog, Approval, WorkflowRule } from '../types/models';
import { subDays, format } from 'date-fns';

const now = new Date();

export const mockUsers: User[] = [
  { id: 'u1', name: 'Alex Thompson', email: 'alex@market-erp.com', role: 'Administrator', avatarUrl: 'https://i.pravatar.cc/150?u=u1', status: 'Active' },
  { id: 'u2', name: 'Sarah Chen', email: 'sarah@market-erp.com', role: 'Sales Manager', avatarUrl: 'https://i.pravatar.cc/150?u=u2', status: 'Active' },
  { id: 'u3', name: 'James Wilson', email: 'james@market-erp.com', role: 'Warehouse Manager', avatarUrl: 'https://i.pravatar.cc/150?u=u3', status: 'Offline' },
  { id: 'u4', name: 'Maria Garcia', email: 'maria@market-erp.com', role: 'HR Manager', avatarUrl: 'https://i.pravatar.cc/150?u=u4', status: 'Active' },
  { id: 'u5', name: 'David Kim', email: 'david@market-erp.com', role: 'Accountant', avatarUrl: 'https://i.pravatar.cc/150?u=u5', status: 'Offline' },
];

export const mockLeads: Lead[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `l${i}`,
  companyName: `Company ${String.fromCharCode(65 + (i % 26))} Solutions`,
  contactName: `Contact ${i}`,
  email: `contact${i}@example.com`,
  phone: `+1 555-01${i.toString().padStart(2, '0')}`,
  status: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'][i % 7] as Lead['status'],
  value: Math.floor(Math.random() * 80000) + 5000,
  score: Math.floor(Math.random() * 100),
  source: ['Website', 'Referral', 'Cold Call', 'Conference'][i % 4],
  createdAt: format(subDays(now, Math.floor(Math.random() * 60)), 'yyyy-MM-dd'),
  updatedAt: format(subDays(now, Math.floor(Math.random() * 10)), 'yyyy-MM-dd'),
  assignedTo: mockUsers[Math.floor(Math.random() * mockUsers.length)].name,
}));

export const mockCustomers: Customer[] = Array.from({ length: 40 }).map((_, i) => ({
  id: `c${i}`,
  name: `Global Corp ${i}`,
  industry: ['Technology', 'Healthcare', 'Manufacturing', 'Retail', 'Finance'][i % 5],
  email: `billing@globalcorp${i}.com`,
  phone: `+1 555-02${i.toString().padStart(2, '0')}`,
  totalRevenue: Math.floor(Math.random() * 500000) + 10000,
  status: Math.random() > 0.8 ? 'Inactive' : 'Active',
  group: ['VIP', 'Standard', 'Enterprise'][i % 3],
  lastContact: format(subDays(now, Math.floor(Math.random() * 60)), 'yyyy-MM-dd'),
  createdAt: format(subDays(now, Math.floor(Math.random() * 365 + 30)), 'yyyy-MM-dd'),
}));

export const mockProducts: Product[] = Array.from({ length: 40 }).map((_, i) => ({
  id: `p${i}`,
  name: `Pro Device Model ${i}`,
  sku: `SKU-PRD-${1000 + i}`,
  category: ['Electronics', 'Software', 'Hardware', 'Services'][i % 4],
  brand: ['TechCorp', 'InnoSys', 'FutureWorks'][i % 3],
  price: Math.floor(Math.random() * 1000) + 50,
  cost: Math.floor(Math.random() * 500) + 20,
  stock: Math.floor(Math.random() * 1000),
  warehouseId: `w${i % 3}`,
  status: Math.random() > 0.9 ? 'Out of Stock' : (Math.random() > 0.7 ? 'Low Stock' : 'In Stock'),
}));

export const mockTransactions: Transaction[] = Array.from({ length: 60 }).map((_, i) => ({
  id: `tx${i}`,
  date: format(subDays(now, i), 'yyyy-MM-dd'),
  amount: Math.floor(Math.random() * 15000) + 100,
  type: Math.random() > 0.3 ? 'Income' : 'Expense',
  category: ['Software Sales', 'Hardware Sales', 'Consulting', 'Salaries', 'Rent', 'Marketing'][i % 6],
  description: `Transaction details for ID tx${i}`,
  status: Math.random() > 0.9 ? 'Failed' : (Math.random() > 0.8 ? 'Pending' : 'Completed'),
}));

export const mockTasks: Task[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `t${i}`,
  title: `Important Task ${i}`,
  description: `Complete deliverables for project ${i}`,
  assignedTo: mockUsers[Math.floor(Math.random() * mockUsers.length)].name,
  dueDate: format(subDays(now, Math.floor(Math.random() * 30) - 15), 'yyyy-MM-dd'),
  status: ['Todo', 'In Progress', 'Review', 'Done'][i % 4] as Task['status'],
  priority: ['Low', 'Medium', 'High'][i % 3] as Task['priority'],
}));

export const mockEmployees: Employee[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `e${i}`,
  name: `Employee Name ${i}`,
  position: ['Developer', 'Designer', 'Sales Rep', 'Support', 'Manager'][i % 5],
  department: ['Engineering', 'Design', 'Sales', 'Customer Success', 'Management'][i % 5],
  email: `emp${i}@market-erp.com`,
  joinDate: format(subDays(now, Math.floor(Math.random() * 1000)), 'yyyy-MM-dd'),
  status: Math.random() > 0.1 ? 'Active' : 'On Leave',
  salary: 50000 + (Math.random() * 70000),
  performanceScore: Math.floor(Math.random() * 20) + 80,
}));

export const mockDocuments: Document[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `doc${i}`,
  title: `Document_Agreement_${i}.pdf`,
  type: ['Contract', 'Invoice', 'Report', 'Other'][i % 4] as Document['type'],
  size: `${Math.floor(Math.random() * 10) + 1} MB`,
  uploadedBy: mockUsers[Math.floor(Math.random() * mockUsers.length)].name,
  uploadDate: format(subDays(now, Math.floor(Math.random() * 100)), 'yyyy-MM-dd'),
  status: ['Draft', 'Pending Approval', 'Approved'][i % 3] as Document['status'],
}));

export const mockInvoices: Invoice[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `inv${1000 + i}`,
  customerId: `c${i % 40}`,
  customerName: `Global Corp ${i % 40}`,
  amount: Math.floor(Math.random() * 25000) + 500,
  date: format(subDays(now, Math.floor(Math.random() * 60)), 'yyyy-MM-dd'),
  dueDate: format(subDays(now, Math.floor(Math.random() * 30) - 15), 'yyyy-MM-dd'),
  status: ['Paid', 'Unpaid', 'Overdue'][i % 3] as Invoice['status'],
}));

export const mockNotifications = [
  { id: 'n1', title: 'New lead assigned', description: 'Global Corp Solutions has been assigned to you.', timestamp: '10 min ago', read: false, type: 'Lead' },
  { id: 'n2', title: 'Invoice Paid', description: 'Invoice #inv1240 was paid by Customer 14.', timestamp: '1 hour ago', read: false, type: 'Finance' },
  { id: 'n3', title: 'Meeting Reminder', description: 'Review Q3 proposals with the Sales Team.', timestamp: '2 hours ago', read: true, type: 'Task' },
  { id: 'n4', title: 'System Update', description: 'Market ERP v2.4 has been successfully deployed.', timestamp: '1 day ago', read: true, type: 'System' },
];

export const dashboardStats = {
  totalRevenue: 2458900,
  activeCustomers: 124,
  newLeads: 45,
  openTasks: 18,
  revenueGrowth: 14.5,
  customerGrowth: 5.2,
  leadsGrowth: -2.4,
  tasksGrowth: 12.0
};

export const mockDeals: Deal[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `deal${i + 1}`,
  title: `Enterprise Cloud Migration ${i + 1}`,
  customerId: `c${(i % 10) + 1}`,
  value: 50000 + (i * 10000),
  expectedRevenue: 35000 + (i * 5000),
  probability: Math.floor(Math.random() * 80) + 20,
  stage: ['Prospecting', 'Meeting Scheduled', 'Needs Analysis', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'][i % 7] as Deal['stage'],
  createdAt: `2026-0${1 + (i % 5)}-1${i % 9}`,
  expectedCloseDate: `2026-0${3 + (i % 4)}-2${i % 9}`,
  assignedTo: `emp${(i % 5) + 1}`,
}));

export const mockActivities: Activity[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `act${i + 1}`,
  entityId: i % 2 === 0 ? `c${(i % 10) + 1}` : `l${(i % 10) + 1}`,
  entityType: i % 2 === 0 ? 'Customer' : 'Lead',
  action: ['Email Sent', 'Call Logged', 'Meeting Held', 'Note Added', 'Stage Changed'][i % 5],
  description: 'Discussed project requirements and next steps.',
  timestamp: `2026-06-0${(i % 2) + 1}T10:00:00Z`,
  userId: `emp${(i % 5) + 1}`,
}));

export const mockNotes: Note[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `note${i + 1}`,
  entityId: `c${(i % 10) + 1}`,
  entityType: 'Customer',
  content: 'Client requested an extension on the current proposal validity. Need to check with management.',
  authorId: `emp${(i % 5) + 1}`,
  createdAt: `2026-05-2${i % 9}T14:30:00Z`,
}));

export const mockAuditLogs: AuditLog[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `audit${i + 1}`,
  userId: `emp${(i % 5) + 1}`,
  action: ['Created', 'Updated', 'Deleted', 'Exported'][i % 4],
  entityType: ['Customer', 'Lead', 'Deal', 'Document', 'Invoice'][i % 5],
  entityId: `e${i + 1}`,
  changes: 'Updated status field',
  timestamp: `2026-06-0${(i % 2) + 1}T09:15:00Z`,
}));

export const mockApprovals: Approval[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `app${i + 1}`,
  title: `Q${(i % 4) + 1} Marketing Budget`,
  type: ['Expense', 'Invoice', 'Document', 'Purchase'][i % 4] as Approval['type'],
  status: ['Draft', 'Pending', 'Approved', 'Rejected'][i % 4] as Approval['status'],
  requesterId: `emp${(i % 5) + 1}`,
  amount: 4500 + i * 200,
  createdAt: `2026-06-0${(i % 2) + 1}T11:00:00Z`,
}));

export const mockWorkflows: WorkflowRule[] = [
  { id: 'wf1', name: 'New Lead Auto-Assign', trigger: 'Lead Created', conditions: ['Score > 50'], actions: ['Assign to Sales Mgr', 'Send Welcome Email'], isActive: true },
  { id: 'wf2', name: 'High Value Deal Alert', trigger: 'Deal Status = Proposal Sent', conditions: ['Value > 100000'], actions: ['Notify Director'], isActive: true },
  { id: 'wf3', name: 'Overdue Invoice Reminder', trigger: 'Invoice Overdue', conditions: [], actions: ['Send Reminder Email', 'Create Chase Task'], isActive: false },
];
