import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './lib/core/auth/AuthContext';
import { TenantProvider } from './lib/core/tenant/TenantContext';
import { ProtectedRoute } from './lib/core/security/Guards';
import { AuthLayout } from './pages/auth/AuthLayout';

const queryClient = new QueryClient();

// Lazy load layout and pages for Performance (Code Splitting)
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout').then(res => ({ default: res.DashboardLayout })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(res => ({ default: res.DashboardPage })));
const LeadsPage = lazy(() => import('./pages/LeadsPage').then(res => ({ default: res.LeadsPage })));
const LeadDetailPage = lazy(() => import('./pages/LeadDetailPage').then(res => ({ default: res.LeadDetailPage })));
const CustomersPage = lazy(() => import('./pages/CustomersPage').then(res => ({ default: res.CustomersPage })));
const CustomerDetailPage = lazy(() => import('./pages/CustomerDetailPage').then(res => ({ default: res.CustomerDetailPage })));
const WarehousePage = lazy(() => import('./pages/WarehousePage').then(res => ({ default: res.WarehousePage })));
const FinancePage = lazy(() => import('./pages/FinancePage').then(res => ({ default: res.FinancePage })));
const TasksPage = lazy(() => import('./pages/TasksPage').then(res => ({ default: res.TasksPage })));
const HRPage = lazy(() => import('./pages/HRPage').then(res => ({ default: res.HRPage })));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage').then(res => ({ default: res.DocumentsPage })));
const ReportsPage = lazy(() => import('./pages/ReportsPage').then(res => ({ default: res.ReportsPage })));
const SalesPage = lazy(() => import('./pages/SalesPage').then(res => ({ default: res.SalesPage })));
const DealDetailPage = lazy(() => import('./pages/DealDetailPage').then(res => ({ default: res.DealDetailPage })));
const WorkflowsPage = lazy(() => import('./pages/WorkflowsPage').then(res => ({ default: res.WorkflowsPage })));
const AuditLogPage = lazy(() => import('./pages/AuditLogPage').then(res => ({ default: res.AuditLogPage })));
const ApprovalsPage = lazy(() => import('./pages/ApprovalsPage').then(res => ({ default: res.ApprovalsPage })));
const ActivityPage = lazy(() => import('./pages/ActivityPage').then(res => ({ default: res.ActivityPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(res => ({ default: res.SettingsPage })));

// Intelligence Layer Pages
const IntelligencePage = lazy(() => import('./pages/IntelligencePage').then(res => ({ default: res.IntelligencePage })));
const WarRoomPage = lazy(() => import('./pages/WarRoomPage').then(res => ({ default: res.WarRoomPage })));
const SystemHealthPage = lazy(() => import('./pages/SystemHealthPage').then(res => ({ default: res.SystemHealthPage })));
const KnowledgePage = lazy(() => import('./pages/KnowledgePage').then(res => ({ default: res.KnowledgePage })));

// Ecosystem Pages
const MarketplacePage = lazy(() => import('./pages/MarketplacePage').then(res => ({ default: res.MarketplacePage })));
const DeveloperCenterPage = lazy(() => import('./pages/DeveloperCenterPage').then(res => ({ default: res.DeveloperCenterPage })));
const EcosystemBuilderPage = lazy(() => import('./pages/EcosystemBuilderPage').then(res => ({ default: res.EcosystemBuilderPage })));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then(res => ({ default: res.AnalyticsPage })));

// Production Readiness Pages
const ObservabilityPage = lazy(() => import('./pages/ObservabilityPage').then(res => ({ default: res.ObservabilityPage })));
const SecurityCenterPage = lazy(() => import('./pages/SecurityCenterPage').then(res => ({ default: res.SecurityCenterPage })));

// Autonomous OS Pages
const BusinessGraphPage = lazy(() => import('./pages/BusinessGraphPage').then(res => ({ default: res.BusinessGraphPage })));
const DecisionEnginePage = lazy(() => import('./pages/DecisionEnginePage').then(res => ({ default: res.DecisionEnginePage })));
const ExecutiveCopilotPage = lazy(() => import('./pages/ExecutiveCopilotPage').then(res => ({ default: res.ExecutiveCopilotPage })));
const CustomerSuccessPage = lazy(() => import('./pages/CustomerSuccessPage').then(res => ({ default: res.CustomerSuccessPage })));

// Self-Evolving Platform Pages
const ProcessMiningPage = lazy(() => import('./pages/ProcessMiningPage').then(res => ({ default: res.ProcessMiningPage })));
const DigitalTwinPage = lazy(() => import('./pages/DigitalTwinPage').then(res => ({ default: res.DigitalTwinPage })));
const OrgHealthPage = lazy(() => import('./pages/OrgHealthPage').then(res => ({ default: res.OrgHealthPage })));
const AdoptionAnalyticsPage = lazy(() => import('./pages/AdoptionAnalyticsPage').then(res => ({ default: res.AdoptionAnalyticsPage })));

// Auth pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));

// Fallback loader
const GlobalLoader = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-background">
     <div className="size-8 rounded-full border-t-2 border-emerald-500 animate-spin"></div>
  </div>
);

import { ToastProvider } from './components/ui/Toast';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TenantProvider>
            <ToastProvider>
              <Suspense fallback={<GlobalLoader />}>
                <Routes>
                  {/* Public Auth Routes */}
                  <Route path="/auth" element={<AuthLayout />}>
                    <Route index element={<Navigate to="/auth/login" replace />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="forgot-password" element={<ForgotPasswordPage />} />
                  </Route>

                  {/* Protected App Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<DashboardLayout />}>
                      <Route index element={<DashboardPage />} />
                      <Route path="intelligence" element={<IntelligencePage />} />
                      <Route path="war-room" element={<WarRoomPage />} />
                      <Route path="system-health" element={<SystemHealthPage />} />
                      <Route path="knowledge" element={<KnowledgePage />} />
                      <Route path="marketplace" element={<MarketplacePage />} />
                      <Route path="developer" element={<DeveloperCenterPage />} />
                      <Route path="builder" element={<EcosystemBuilderPage />} />
                      <Route path="analytics" element={<AnalyticsPage />} />
                      <Route path="observability" element={<ObservabilityPage />} />
                      <Route path="security" element={<SecurityCenterPage />} />
                      <Route path="graph" element={<BusinessGraphPage />} />
                      <Route path="decisions" element={<DecisionEnginePage />} />
                      <Route path="copilot" element={<ExecutiveCopilotPage />} />
                      <Route path="success" element={<CustomerSuccessPage />} />
                      <Route path="process-mining" element={<ProcessMiningPage />} />
                      <Route path="digital-twin" element={<DigitalTwinPage />} />
                      <Route path="org-health" element={<OrgHealthPage />} />
                      <Route path="adoption" element={<AdoptionAnalyticsPage />} />
                      <Route path="leads" element={<LeadsPage />} />
                      <Route path="leads/:id" element={<LeadDetailPage />} />
                      <Route path="customers" element={<CustomersPage />} />
                      <Route path="customers/:id" element={<CustomerDetailPage />} />
                      <Route path="sales" element={<SalesPage />} />
                      <Route path="deals/:id" element={<DealDetailPage />} />
                      <Route path="tasks" element={<TasksPage />} />
                      <Route path="hr" element={<HRPage />} />
                      <Route path="warehouse" element={<WarehousePage />} />
                      <Route path="finance" element={<FinancePage />} />
                      <Route path="documents" element={<DocumentsPage />} />
                      <Route path="reports" element={<ReportsPage />} />
                      <Route path="settings" element={<SettingsPage />} />
                      <Route path="workflows" element={<WorkflowsPage />} />
                      <Route path="audit" element={<AuditLogPage />} />
                      <Route path="approvals" element={<ApprovalsPage />} />
                      <Route path="activity" element={<ActivityPage />} />
                    </Route>
                  </Route>
                </Routes>
              </Suspense>
            </ToastProvider>
          </TenantProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
