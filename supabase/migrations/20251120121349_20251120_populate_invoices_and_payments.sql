/*
  # Populate Invoices and Payments Tables with Sample AP/AR Data
  
  1. Data Added:
    - Sample vendors for accounts payable
    - Sample customers for accounts receivable
    - Sample invoices (both payable and receivable)
    - Sample payments for tracking
  
  2. Business Logic:
    - Creates realistic vendor and customer data
    - Populates invoices with various statuses (draft, sent, paid, overdue)
    - Includes sample payments to demonstrate payment tracking
    - Represents common business scenarios: invoices due, overdue, partially paid
*/

-- Insert sample vendors for Accounts Payable
INSERT INTO public.vendors (vendor_code, vendor_name, email, phone, address, city, country, payment_terms, is_active) VALUES
('VND001', 'ABC Supplies Inc.', 'contact@abcsupplies.com', '+1-555-0101', '123 Business Ave', 'New York', 'USA', 30, true),
('VND002', 'Global Tech Solutions', 'sales@globaltech.com', '+1-555-0102', '456 Tech Drive', 'San Francisco', 'USA', 45, true),
('VND003', 'Premium Office Furniture', 'orders@premiumfurniture.com', '+1-555-0103', '789 Furniture Blvd', 'Chicago', 'USA', 60, true),
('VND004', 'CloudHost Services', 'billing@cloudhostservices.com', '+1-555-0104', '321 Digital Plaza', 'Austin', 'USA', 15, true),
('VND005', 'Logistics Partners Ltd', 'shipping@logisticspartners.com', '+1-555-0105', '654 Transport Way', 'Atlanta', 'USA', 30, true)
ON CONFLICT (vendor_code) DO NOTHING;

-- Insert sample customers for Accounts Receivable
INSERT INTO public.customers (customer_code, customer_name, email, phone, address, city, country, payment_terms, credit_limit, is_active) VALUES
('CUST001', 'Acme Corporation', 'accounting@acmecorp.com', '+1-555-1001', '111 Corporate Blvd', 'Boston', 'USA', 30, 100000, true),
('CUST002', 'TechStart Ventures', 'finance@techstart.com', '+1-555-1002', '222 Innovation Hub', 'Seattle', 'USA', 45, 75000, true),
('CUST003', 'Retail Solutions Group', 'accounts@retailsolutions.com', '+1-555-1003', '333 Commerce Street', 'Denver', 'USA', 30, 50000, true),
('CUST004', 'Global Manufacturing Co', 'billing@globalmfg.com', '+1-555-1004', '444 Factory Road', 'Detroit', 'USA', 60, 150000, true),
('CUST005', 'Digital Marketing Agency', 'finance@digitalmarketing.com', '+1-555-1005', '555 Creative Lane', 'Miami', 'USA', 15, 30000, true)
ON CONFLICT (customer_code) DO NOTHING;

-- Insert sample payable invoices
INSERT INTO public.invoices (invoice_number, invoice_type, invoice_date, due_date, vendor_id, subtotal, tax_rate, tax_amount, total_amount, paid_amount, status) 
SELECT 
  invoice_num,
  'payable' as invoice_type,
  invoice_date,
  due_date,
  vendor_id,
  subtotal,
  tax_rate,
  tax_amount,
  total_amount,
  paid_amt,
  status::invoice_status
FROM (
  VALUES
    ('PAY-2024-001', DATE '2024-10-15', DATE '2024-11-15', (SELECT id FROM vendors WHERE vendor_code = 'VND001'), 5000.00, 0.10, 500.00, 5500.00, 5500.00, 'paid'),
    ('PAY-2024-002', DATE '2024-10-20', DATE '2024-12-05', (SELECT id FROM vendors WHERE vendor_code = 'VND002'), 8500.00, 0.10, 850.00, 9350.00, 0.00, 'sent'),
    ('PAY-2024-003', DATE '2024-11-01', DATE '2024-11-30', (SELECT id FROM vendors WHERE vendor_code = 'VND003'), 12000.00, 0.10, 1200.00, 13200.00, 0.00, 'overdue'),
    ('PAY-2024-004', DATE '2024-11-05', DATE '2024-11-20', (SELECT id FROM vendors WHERE vendor_code = 'VND004'), 2500.00, 0.08, 200.00, 2700.00, 2700.00, 'paid'),
    ('PAY-2024-005', DATE '2024-11-10', DATE '2024-12-10', (SELECT id FROM vendors WHERE vendor_code = 'VND005'), 7200.00, 0.10, 720.00, 7920.00, 0.00, 'sent')
) AS t(invoice_num, invoice_date, due_date, vendor_id, subtotal, tax_rate, tax_amount, total_amount, paid_amt, status)
ON CONFLICT (invoice_number) DO NOTHING;

-- Insert sample receivable invoices
INSERT INTO public.invoices (invoice_number, invoice_type, invoice_date, due_date, customer_id, subtotal, tax_rate, tax_amount, total_amount, paid_amount, status)
SELECT
  invoice_num,
  'receivable' as invoice_type,
  invoice_date,
  due_date,
  customer_id,
  subtotal,
  tax_rate,
  tax_amount,
  total_amount,
  paid_amt,
  status::invoice_status
FROM (
  VALUES
    ('REC-2024-001', DATE '2024-10-01', DATE '2024-10-31', (SELECT id FROM customers WHERE customer_code = 'CUST001'), 15000.00, 0.10, 1500.00, 16500.00, 16500.00, 'paid'),
    ('REC-2024-002', DATE '2024-10-15', DATE '2024-11-14', (SELECT id FROM customers WHERE customer_code = 'CUST002'), 8200.00, 0.10, 820.00, 9020.00, 9020.00, 'paid'),
    ('REC-2024-003', DATE '2024-11-01', DATE '2024-11-30', (SELECT id FROM customers WHERE customer_code = 'CUST003'), 6500.00, 0.10, 650.00, 7150.00, 0.00, 'overdue'),
    ('REC-2024-004', DATE '2024-11-05', DATE '2024-12-05', (SELECT id FROM customers WHERE customer_code = 'CUST004'), 22000.00, 0.10, 2200.00, 24200.00, 0.00, 'sent'),
    ('REC-2024-005', DATE '2024-11-10', DATE '2024-11-25', (SELECT id FROM customers WHERE customer_code = 'CUST005'), 4800.00, 0.10, 480.00, 5280.00, 0.00, 'sent')
) AS t(invoice_num, invoice_date, due_date, customer_id, subtotal, tax_rate, tax_amount, total_amount, paid_amt, status)
ON CONFLICT (invoice_number) DO NOTHING;

-- Insert sample payments
INSERT INTO public.payments (payment_number, payment_type, payment_date, amount, payment_method, vendor_id, customer_id, invoice_id, status) VALUES
('PMT-2024-001', 'check', DATE '2024-11-15', 5500.00, 'check', (SELECT id FROM vendors WHERE vendor_code = 'VND001'), NULL, (SELECT id FROM invoices WHERE invoice_number = 'PAY-2024-001'), 'completed'::payment_status),
('PMT-2024-002', 'bank_transfer', DATE '2024-11-08', 16500.00, 'bank_transfer', NULL, (SELECT id FROM customers WHERE customer_code = 'CUST001'), (SELECT id FROM invoices WHERE invoice_number = 'REC-2024-001'), 'completed'::payment_status),
('PMT-2024-003', 'bank_transfer', DATE '2024-11-12', 9020.00, 'bank_transfer', NULL, (SELECT id FROM customers WHERE customer_code = 'CUST002'), (SELECT id FROM invoices WHERE invoice_number = 'REC-2024-002'), 'completed'::payment_status),
('PMT-2024-004', 'credit_card', DATE '2024-11-18', 2700.00, 'credit_card', (SELECT id FROM vendors WHERE vendor_code = 'VND004'), NULL, (SELECT id FROM invoices WHERE invoice_number = 'PAY-2024-004'), 'completed'::payment_status)
ON CONFLICT (payment_number) DO NOTHING;