import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
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
        <AppLayout>
          <Routes>
            {/* Primary Navigation */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/more" element={<More />} />
            
            {/* Ledger Routes */}
            <Route path="/ledger" element={<Ledger />} />
            <Route path="/ledger/journal" element={<JournalEntries />} />
            
            {/* Payables Routes */}
            <Route path="/payables" element={<Payables />} />
            <Route path="/payables/vendors" element={<Vendors />} />
            
            {/* Receivables Routes */}
            <Route path="/receivables" element={<Receivables />} />
            <Route path="/receivables/invoices" element={<Invoices />} />
            
            {/* Other Routes */}
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
