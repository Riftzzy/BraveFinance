import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileJson } from "lucide-react";
import { exportToCSV, exportToJSON } from "@/utils/exportData";
import { useToast } from "@/hooks/use-toast";

interface ExportButtonProps {
  data: any[];
  filename: string;
  disabled?: boolean;
}

export function ExportButton({ data, filename, disabled }: ExportButtonProps) {
  const { toast } = useToast();

  const handleExport = (format: "csv" | "json") => {
    try {
      if (!data || data.length === 0) {
        toast({
          title: "No data",
          description: "There is no data to export",
          variant: "destructive",
        });
        return;
      }

      if (format === "csv") {
        exportToCSV(data, filename);
      } else {
        exportToJSON(data, filename);
      }

      toast({
        title: "Success",
        description: `Data exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to export data",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")}>
          <FileJson className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
