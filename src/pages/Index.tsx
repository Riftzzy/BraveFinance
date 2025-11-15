import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center mx-auto">
          <span className="text-4xl font-bold text-primary-foreground">BF</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold">BraveFinance</h1>
        <p className="text-xl text-muted-foreground">
          Comprehensive Financial Management System for Bareera Intl
        </p>
        <Button 
          size="lg" 
          onClick={() => navigate("/auth")}
          className="touch-target"
        >
          Get Started <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
