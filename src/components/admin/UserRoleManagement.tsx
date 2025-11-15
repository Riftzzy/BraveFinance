import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, UserCog } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserWithRoles {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  roles: string[];
}

export function UserRoleManagement() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    
    // Fetch all profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name');

    if (profileError) {
      toast.error("Failed to fetch users");
      setLoading(false);
      return;
    }

    // Fetch all roles
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');

    if (rolesError) {
      toast.error("Failed to fetch roles");
      setLoading(false);
      return;
    }

    // Combine profiles with their roles
    const usersWithRoles: UserWithRoles[] = profiles.map((profile) => ({
      id: profile.id,
      email: profile.email || "",
      first_name: profile.first_name,
      last_name: profile.last_name,
      roles: roles
        .filter((r) => r.user_id === profile.id)
        .map((r) => r.role),
    }));

    setUsers(usersWithRoles);
    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    // First, delete all existing roles for this user
    const { error: deleteError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      toast.error("Failed to update role");
      return;
    }

    // Then insert the new role
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert([{ 
        user_id: userId, 
        role: newRole as 'admin' | 'finance_manager' | 'accountant' | 'view_only'
      }]);

    if (insertError) {
      toast.error("Failed to update role");
      return;
    }

    toast.success("Role updated successfully");
    fetchUsers();
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <CardTitle>User Role Management</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading users...</p>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCog className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    {user.roles.map((role) => (
                      <Badge key={role} variant="secondary">
                        {role.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                  <Select
                    value={user.roles[0] || 'view_only'}
                    onValueChange={(value) => handleRoleChange(user.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="finance_manager">Finance Manager</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                      <SelectItem value="view_only">View Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
