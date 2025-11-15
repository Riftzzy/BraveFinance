import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Book, 
  CreditCard, 
  Users, 
  Briefcase, 
  Settings, 
  User,
  LogOut,
  ChevronRight
} from "lucide-react";

const menuItems = [
  { icon: Book, label: "General Ledger", path: "/ledger" },
  { icon: CreditCard, label: "Accounts Payable", path: "/payables" },
  { icon: Users, label: "Accounts Receivable", path: "/receivables" },
  { icon: Briefcase, label: "Payroll", path: "/payroll" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: User, label: "Profile", path: "/profile" },
];

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function More() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <PageContainer>
      <PageHeader
        title="More"
        subtitle="Additional features and settings"
      />

      <div className="space-y-6">
        {/* Menu Items */}
        <Card>
          <CardContent className="p-0">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className="w-full justify-between h-14 px-4 rounded-none border-b border-border last:border-0 touch-target"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="p-0">
            <Button
              variant="ghost"
              onClick={signOut}
              className="w-full justify-between h-14 px-4 rounded-none text-destructive hover:text-destructive hover:bg-destructive/10 touch-target"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <LogOut className="h-5 w-5 text-destructive" />
                </div>
                <span className="font-medium">Logout</span>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
