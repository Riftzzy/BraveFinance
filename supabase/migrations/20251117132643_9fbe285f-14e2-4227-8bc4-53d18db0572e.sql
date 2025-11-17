-- Phase 7: Advanced Features - Approval Workflows, Realtime, and Advanced Features

-- Create approval workflow status enum
DO $$ BEGIN
  CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create approvals table
CREATE TABLE IF NOT EXISTS public.approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL, -- 'transaction', 'invoice', 'payment', 'budget'
  entity_id UUID NOT NULL,
  requested_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  status approval_status DEFAULT 'pending',
  approval_level INTEGER DEFAULT 1,
  comments TEXT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create audit log table for tracking all changes
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'approve', 'reject'
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create scheduled transactions table for recurring transactions
CREATE TABLE IF NOT EXISTS public.scheduled_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_template JSONB NOT NULL,
  frequency VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'
  start_date DATE NOT NULL,
  end_date DATE,
  next_run_date DATE NOT NULL,
  last_run_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for approvals
CREATE POLICY "Users can view their own approval requests" ON public.approvals
  FOR SELECT USING (auth.uid() = requested_by OR auth.uid() = approved_by);

CREATE POLICY "Finance managers and admins can view all approvals" ON public.approvals
  FOR SELECT USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'finance_manager'));

CREATE POLICY "Accountants can create approval requests" ON public.approvals
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'accountant') OR has_role(auth.uid(), 'finance_manager'));

CREATE POLICY "Finance managers and admins can approve" ON public.approvals
  FOR UPDATE USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'finance_manager'));

-- RLS Policies for audit logs
CREATE POLICY "Users can view their own audit logs" ON public.audit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

-- RLS Policies for scheduled transactions
CREATE POLICY "All authenticated users can view scheduled transactions" ON public.scheduled_transactions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Finance managers and admins can manage scheduled transactions" ON public.scheduled_transactions
  FOR ALL USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'finance_manager'));

-- Add updated_at triggers
CREATE TRIGGER update_approvals_updated_at
  BEFORE UPDATE ON public.approvals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scheduled_transactions_updated_at
  BEFORE UPDATE ON public.scheduled_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to log audit trail
CREATE OR REPLACE FUNCTION public.log_audit_trail()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    entity_type,
    entity_id,
    action,
    old_data,
    new_data
  ) VALUES (
    auth.uid(),
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'create'
      WHEN TG_OP = 'UPDATE' THEN 'update'
      WHEN TG_OP = 'DELETE' THEN 'delete'
    END,
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Add audit triggers to key tables
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'audit_transactions') THEN
    CREATE TRIGGER audit_transactions
      AFTER INSERT OR UPDATE OR DELETE ON public.transactions
      FOR EACH ROW EXECUTE FUNCTION public.log_audit_trail();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'audit_invoices') THEN
    CREATE TRIGGER audit_invoices
      AFTER INSERT OR UPDATE OR DELETE ON public.invoices
      FOR EACH ROW EXECUTE FUNCTION public.log_audit_trail();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'audit_payments') THEN
    CREATE TRIGGER audit_payments
      AFTER INSERT OR UPDATE OR DELETE ON public.payments
      FOR EACH ROW EXECUTE FUNCTION public.log_audit_trail();
  END IF;
END $$;

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.approvals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_approvals_status ON public.approvals(status);
CREATE INDEX IF NOT EXISTS idx_approvals_entity ON public.approvals(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scheduled_transactions_next_run ON public.scheduled_transactions(next_run_date) WHERE is_active = true;