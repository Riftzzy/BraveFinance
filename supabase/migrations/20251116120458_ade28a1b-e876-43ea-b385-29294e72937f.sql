-- Create enums for status fields (only if they don't exist)
DO $$ BEGIN
  CREATE TYPE public.account_type AS ENUM ('asset', 'liability', 'equity', 'revenue', 'expense');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.transaction_status AS ENUM ('draft', 'posted', 'voided');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.budget_status AS ENUM ('draft', 'active', 'closed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Chart of Accounts table
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_number VARCHAR(50) NOT NULL UNIQUE,
  account_name TEXT NOT NULL,
  account_type account_type NOT NULL,
  parent_account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  current_balance NUMERIC(15, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Vendors table
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name TEXT NOT NULL,
  vendor_code VARCHAR(50) UNIQUE,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  tax_id TEXT,
  payment_terms INTEGER DEFAULT 30,
  credit_limit NUMERIC(15, 2),
  current_balance NUMERIC(15, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_code VARCHAR(50) UNIQUE,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  tax_id TEXT,
  payment_terms INTEGER DEFAULT 30,
  credit_limit NUMERIC(15, 2),
  current_balance NUMERIC(15, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Transactions (Journal Entries) table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_number VARCHAR(50) NOT NULL UNIQUE,
  transaction_date DATE NOT NULL,
  reference_number VARCHAR(100),
  description TEXT,
  status transaction_status DEFAULT 'draft',
  total_debit NUMERIC(15, 2) DEFAULT 0,
  total_credit NUMERIC(15, 2) DEFAULT 0,
  notes TEXT,
  posted_at TIMESTAMP WITH TIME ZONE,
  posted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Transaction Lines (Journal Entry Lines) table
CREATE TABLE IF NOT EXISTS public.transaction_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.accounts(id),
  description TEXT,
  debit_amount NUMERIC(15, 2) DEFAULT 0,
  credit_amount NUMERIC(15, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  invoice_type VARCHAR(20) NOT NULL CHECK (invoice_type IN ('receivable', 'payable')),
  customer_id UUID REFERENCES public.customers(id),
  vendor_id UUID REFERENCES public.vendors(id),
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal NUMERIC(15, 2) DEFAULT 0,
  tax_amount NUMERIC(15, 2) DEFAULT 0,
  tax_rate NUMERIC(5, 2) DEFAULT 0,
  total_amount NUMERIC(15, 2) DEFAULT 0,
  paid_amount NUMERIC(15, 2) DEFAULT 0,
  status invoice_status DEFAULT 'draft',
  notes TEXT,
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT check_customer_or_vendor CHECK (
    (invoice_type = 'receivable' AND customer_id IS NOT NULL AND vendor_id IS NULL) OR
    (invoice_type = 'payable' AND vendor_id IS NOT NULL AND customer_id IS NULL)
  )
);

-- Invoice Line Items table
CREATE TABLE IF NOT EXISTS public.invoice_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10, 2) DEFAULT 1,
  unit_price NUMERIC(15, 2) DEFAULT 0,
  amount NUMERIC(15, 2) DEFAULT 0,
  account_id UUID REFERENCES public.accounts(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number VARCHAR(50) NOT NULL UNIQUE,
  payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('received', 'made')),
  invoice_id UUID REFERENCES public.invoices(id),
  customer_id UUID REFERENCES public.customers(id),
  vendor_id UUID REFERENCES public.vendors(id),
  payment_date DATE NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  payment_method VARCHAR(50),
  reference_number VARCHAR(100),
  status payment_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Budgets table
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_name TEXT NOT NULL,
  fiscal_year INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status budget_status DEFAULT 'draft',
  description TEXT,
  total_amount NUMERIC(15, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Budget Lines table
CREATE TABLE IF NOT EXISTS public.budget_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.accounts(id),
  department TEXT,
  budgeted_amount NUMERIC(15, 2) DEFAULT 0,
  actual_amount NUMERIC(15, 2) DEFAULT 0,
  variance NUMERIC(15, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add triggers for updated_at timestamps (only if they don't exist)
DO $$ BEGIN
  CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON public.accounts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON public.budgets
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_budget_lines_updated_at BEFORE UPDATE ON public.budget_lines
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Financial calculation functions
CREATE OR REPLACE FUNCTION public.calculate_account_balance(account_id_param UUID)
RETURNS NUMERIC(15, 2)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  balance NUMERIC(15, 2);
BEGIN
  SELECT 
    COALESCE(SUM(debit_amount - credit_amount), 0)
  INTO balance
  FROM transaction_lines tl
  JOIN transactions t ON tl.transaction_id = t.id
  WHERE tl.account_id = account_id_param
    AND t.status = 'posted';
  
  RETURN balance;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_invoice_balance(invoice_id_param UUID)
RETURNS NUMERIC(15, 2)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  balance NUMERIC(15, 2);
BEGIN
  SELECT 
    total_amount - COALESCE(paid_amount, 0)
  INTO balance
  FROM invoices
  WHERE id = invoice_id_param;
  
  RETURN COALESCE(balance, 0);
END;
$$;

-- Enable Row Level Security
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_lines ENABLE ROW LEVEL SECURITY;

-- RLS Policies for accounts
DO $$ BEGIN
  CREATE POLICY "All authenticated users can view accounts" ON public.accounts
    FOR SELECT USING (auth.uid() IS NOT NULL);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Finance managers and admins can insert accounts" ON public.accounts
    FOR INSERT WITH CHECK (
      public.has_role(auth.uid(), 'admin'::app_role) OR 
      public.has_role(auth.uid(), 'finance_manager'::app_role)
    );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Finance managers and admins can update accounts" ON public.accounts
    FOR UPDATE USING (
      public.has_role(auth.uid(), 'admin'::app_role) OR 
      public.has_role(auth.uid(), 'finance_manager'::app_role)
    );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Only admins can delete accounts" ON public.accounts
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- RLS Policies for vendors
DO $$ BEGIN
  CREATE POLICY "All authenticated users can view vendors" ON public.vendors
    FOR SELECT USING (auth.uid() IS NOT NULL);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Accountants and above can manage vendors" ON public.vendors
    FOR ALL USING (
      public.has_role(auth.uid(), 'admin'::app_role) OR 
      public.has_role(auth.uid(), 'finance_manager'::app_role) OR
      public.has_role(auth.uid(), 'accountant'::app_role)
    );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- RLS Policies for customers
DO $$ BEGIN
  CREATE POLICY "All authenticated users can view customers" ON public.customers
    FOR SELECT USING (auth.uid() IS NOT NULL);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Accountants and above can manage customers" ON public.customers
    FOR ALL USING (
      public.has_role(auth.uid(), 'admin'::app_role) OR 
      public.has_role(auth.uid(), 'finance_manager'::app_role) OR
      public.has_role(auth.uid(), 'accountant'::app_role)
    );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- RLS Policies for transactions
DO $$ BEGIN
  CREATE POLICY "All authenticated users can view transactions" ON public.transactions
    FOR SELECT USING (auth.uid() IS NOT NULL);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Accountants and above can create transactions" ON public.transactions
    FOR INSERT WITH CHECK (
      public.has_role(auth.uid(), 'admin'::app_role) OR 
      public.has_role(auth.uid(), 'finance_manager'::app_role) OR
      public.has_role(auth.uid(), 'accountant'::app_role)
    );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Accountants and above can update draft transactions" ON public.transactions
    FOR UPDATE USING (
      status = 'draft' AND (
        public.has_role(auth.uid(), 'admin'::app_role) OR 
        public.has_role(auth.uid(), 'finance_manager'::app_role) OR
        public.has_role(auth.uid(), 'accountant'::app_role)
      )
    );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Only admins can delete transactions" ON public.transactions
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- RLS Policies for transaction_lines
DO $$ BEGIN
  CREATE POLICY "All authenticated users can view transaction lines" ON public.transaction_lines
    FOR SELECT USING (auth.uid() IS NOT NULL);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Accountants and above can manage transaction lines" ON public.transaction_lines
    FOR ALL USING (
      public.has_role(auth.uid(), 'admin'::app_role) OR 
      public.has_role(auth.uid(), 'finance_manager'::app_role) OR
      public.has_role(auth.uid(), 'accountant'::app_role)
    );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- RLS Policies for invoices
DO $$ BEGIN
  CREATE POLICY "All authenticated users can view invoices" ON public.invoices
    FOR SELECT USING (auth.uid() IS NOT NULL);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Accountants and above can manage invoices" ON public.invoices
    FOR ALL USING (
      public.has_role(auth.uid(), 'admin'::app_role) OR 
      public.has_role(auth.uid(), 'finance_manager'::app_role) OR
      public.has_role(auth.uid(), 'accountant'::app_role)
    );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- RLS Policies for invoice_lines
DO $$ BEGIN
  CREATE POLICY "All authenticated users can view invoice lines" ON public.invoice_lines
    FOR SELECT USING (auth.uid() IS NOT NULL);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Accountants and above can manage invoice lines" ON public.invoice_lines
    FOR ALL USING (
      public.has_role(auth.uid(), 'admin'::app_role) OR 
      public.has_role(auth.uid(), 'finance_manager'::app_role) OR
      public.has_role(auth.uid(), 'accountant'::app_role)
    );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- RLS Policies for payments
DO $$ BEGIN
  CREATE POLICY "All authenticated users can view payments" ON public.payments
    FOR SELECT USING (auth.uid() IS NOT NULL);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Accountants and above can manage payments" ON public.payments
    FOR ALL USING (
      public.has_role(auth.uid(), 'admin'::app_role) OR 
      public.has_role(auth.uid(), 'finance_manager'::app_role) OR
      public.has_role(auth.uid(), 'accountant'::app_role)
    );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- RLS Policies for budgets
DO $$ BEGIN
  CREATE POLICY "All authenticated users can view budgets" ON public.budgets
    FOR SELECT USING (auth.uid() IS NOT NULL);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Finance managers and admins can manage budgets" ON public.budgets
    FOR ALL USING (
      public.has_role(auth.uid(), 'admin'::app_role) OR 
      public.has_role(auth.uid(), 'finance_manager'::app_role)
    );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- RLS Policies for budget_lines
DO $$ BEGIN
  CREATE POLICY "All authenticated users can view budget lines" ON public.budget_lines
    FOR SELECT USING (auth.uid() IS NOT NULL);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Finance managers and admins can manage budget lines" ON public.budget_lines
    FOR ALL USING (
      public.has_role(auth.uid(), 'admin'::app_role) OR 
      public.has_role(auth.uid(), 'finance_manager'::app_role)
    );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_accounts_type ON public.accounts(account_type);
CREATE INDEX IF NOT EXISTS idx_accounts_active ON public.accounts(is_active);
CREATE INDEX IF NOT EXISTS idx_vendors_active ON public.vendors(is_active);
CREATE INDEX IF NOT EXISTS idx_customers_active ON public.customers(is_active);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transaction_lines_transaction ON public.transaction_lines(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_lines_account ON public.transaction_lines(account_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON public.invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_vendor ON public.invoices(vendor_id);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoice_lines_invoice ON public.invoice_lines(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON public.payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_budget_lines_budget ON public.budget_lines(budget_id);