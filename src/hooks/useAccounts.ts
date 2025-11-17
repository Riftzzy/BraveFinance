import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Account = Tables<"accounts">;
type AccountInsert = TablesInsert<"accounts">;
type AccountUpdate = TablesUpdate<"accounts">;

export function useAccounts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: accounts, isLoading, error } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .order("account_number");
      
      if (error) throw error;
      return data as Account[];
    },
  });

  const createAccount = useMutation({
    mutationFn: async (account: AccountInsert) => {
      const { data, error } = await supabase
        .from("accounts")
        .insert(account)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast({
        title: "Success",
        description: "Account created successfully",
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

  const updateAccount = useMutation({
    mutationFn: async ({ id, ...updates }: AccountUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("accounts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast({
        title: "Success",
        description: "Account updated successfully",
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

  const deleteAccount = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("accounts")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast({
        title: "Success",
        description: "Account deleted successfully",
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
    accounts,
    isLoading,
    error,
    createAccount: createAccount.mutate,
    updateAccount: updateAccount.mutate,
    deleteAccount: deleteAccount.mutate,
  };
}
