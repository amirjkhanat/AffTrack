import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "completed":
      case "qualified":
        return "bg-green-500/10 text-green-500";
      case "inactive":
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "duplicate":
      case "bounced":
        return "bg-orange-500/10 text-orange-500";
      default:
        return "";
    }
  };

  return (
    <Badge variant="outline" className={getStatusColor(status)}>
      {status}
    </Badge>
  );
}