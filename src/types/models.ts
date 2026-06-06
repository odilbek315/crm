export type Role = 'Administrator' | 'Director' | 'Manager' | 'Sales Manager' | 'Warehouse Manager' | 'HR Manager' | 'Accountant' | 'Employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  departmentId?: string;
  status?: 'Active' | 'Offline';
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: LeadStatus;
  value: number;
  score: number;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  source?: string;
}

export interface Customer {
  id: string;
  name: string;
  industry: string;
  email: string;
  phone: string;
  totalRevenue: number;
  status: 'Active' | 'Inactive' | 'Churned';
  lastContact: string;
  createdAt: string;
  group?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  warehouseId: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  brand?: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'Income' | 'Expense';
  category: string;
  description: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  joinDate: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  salary?: number;
  performanceScore?: number;
}

export interface Document {
  id: string;
  title: string;
  type: 'Contract' | 'Invoice' | 'Report' | 'Other';
  size: string;
  uploadedBy: string;
  uploadDate: string;
  status: 'Draft' | 'Pending Approval' | 'Approved';
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}

export interface Deal {
  id: string;
  title: string;
  customerId: string;
  value: number;
  expectedRevenue: number;
  probability: number;
  stage: 'Prospecting' | 'Meeting Scheduled' | 'Needs Analysis' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';
  createdAt: string;
  expectedCloseDate: string;
  assignedTo: string;
}

export interface Activity {
  id: string;
  entityId: string;
  entityType: 'Customer' | 'Lead' | 'Deal' | 'User' | 'System';
  action: string;
  description: string;
  timestamp: string;
  userId: string;
}

export interface Note {
  id: string;
  entityId: string;
  entityType: 'Customer' | 'Lead' | 'Deal';
  content: string;
  authorId: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: string;
  timestamp: string;
}

export interface Approval {
  id: string;
  title: string;
  type: 'Expense' | 'Invoice' | 'Document' | 'Purchase';
  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected';
  requesterId: string;
  amount?: number;
  createdAt: string;
}

export interface WorkflowRule {
  id: string;
  name: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  isActive: boolean;
}
