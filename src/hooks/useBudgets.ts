import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type Budget = Tables<"budgets">;

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBudgets();

    const channel = supabase
      .channel("budgets-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "budgets",
        },
        () => {
          fetchBudgets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .order("fiscal_year", { ascending: false });

      if (error) throw error;
      setBudgets(data || []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      toast({
        title: "Error",
        description: "Failed to load budgets",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { budgets, isLoading, refetch: fetchBudgets };
}
