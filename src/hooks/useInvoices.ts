import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Invoice = Tables<"invoices">;
type InvoiceInsert = TablesInsert<"invoices">;
type InvoiceUpdate = TablesUpdate<"invoices">;

export function useInvoices(type?: "payable" | "receivable") {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: invoices, isLoading, error } = useQuery({
    queryKey: ["invoices", type],
    queryFn: async () => {
      let query = supabase
        .from("invoices")
        .select(`
          *,
          vendor:vendors (*),
          customer:customers (*),
          invoice_lines (*)
        `)
        .order("invoice_date", { ascending: false });
      
      if (type === "payable") {
        query = query.eq("invoice_type", "payable");
      } else if (type === "receivable") {
        query = query.eq("invoice_type", "receivable");
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as any[];
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("invoices-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "invoices",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["invoices"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const createInvoice = useMutation({
    mutationFn: async (invoice: InvoiceInsert) => {
      const { data, error } = await supabase
        .from("invoices")
        .insert(invoice)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateInvoice = useMutation({
    mutationFn: async ({ id, ...updates }: InvoiceUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("invoices")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    invoices,
    isLoading,
    error,
    createInvoice: createInvoice.mutate,
    updateInvoice: updateInvoice.mutate,
  };
}
