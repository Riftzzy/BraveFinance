import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Budget from "./pages/Budget";
import More from "./pages/More";
import Ledger from "./pages/Ledger";
import JournalEntries from "./pages/JournalEntries";
import Payables from "./pages/Payables";
import Vendors from "./pages/Vendors";
import Receivables from "./pages/Receivables";
import Invoices from "./pages/Invoices";
import Payroll from "./pages/Payroll";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/transactions" element={
              <ProtectedRoute>
                <AppLayout>
                  <Transactions />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <AppLayout>
                  <Reports />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/budget" element={
              <ProtectedRoute>
                <AppLayout>
                  <Budget />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/more" element={
              <ProtectedRoute>
                <AppLayout>
                  <More />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/ledger" element={
              <ProtectedRoute>
                <AppLayout>
                  <Ledger />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/ledger/journal" element={
              <ProtectedRoute>
                <AppLayout>
                  <JournalEntries />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/payables" element={
              <ProtectedRoute>
                <AppLayout>
                  <Payables />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/payables/vendors" element={
              <ProtectedRoute>
                <AppLayout>
                  <Vendors />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/receivables" element={
              <ProtectedRoute>
                <AppLayout>
                  <Receivables />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/receivables/invoices" element={
              <ProtectedRoute>
                <AppLayout>
                  <Invoices />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/payroll" element={
              <ProtectedRoute>
                <AppLayout>
                  <Payroll />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute requiredRole="admin">
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
