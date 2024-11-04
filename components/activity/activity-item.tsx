"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Settings, Plus, Trash2, Edit, RefreshCw,
  Shield, Link2, Users, CircleDollarSign, 
  ArrowRightLeft, Power, LogIn, LogOut
} from "lucide-react";
import { Activity } from "@/lib/types/activity";
import { formatDistanceToNow } from "date-fns";

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const getActionIcon = () => {
    switch (activity.action) {
      case "CREATE":
        return <Plus className="h-4 w-4" />;
      case "UPDATE":
        return <Edit className="h-4 w-4" />;
      case "DELETE":
        return <Trash2 className="h-4 w-4" />;
      case "CONFIGURE":
        return <Settings className="h-4 w-4" />;
      case "ACTIVATE":
        return <Power className="h-4 w-4" />;
      case "DEACTIVATE":
        return <Power className="h-4 w-4" />;
      case "LOGIN":
        return <LogIn className="h-4 w-4" />;
      case "LOGOUT":
        return <LogOut className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getTargetIcon = () => {
    switch (activity.type) {
      case "USER":
        return <Users className="h-4 w-4 text-muted-foreground" />;
      case "OFFER":
        return <CircleDollarSign className="h-4 w-4 text-muted-foreground" />;
      case "TRANSFER_FEED":
      case "TRANSFER_PARTNER":
        return <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />;
      case "TRACKING_LINK":
        return <Link2 className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Settings className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActionColor = () => {
    switch (activity.action) {
      case "CREATE":
        return "bg-green-500/10 text-green-500";
      case "UPDATE":
        return "bg-blue-500/10 text-blue-500";
      case "DELETE":
        return "bg-red-500/10 text-red-500";
      case "CONFIGURE":
        return "bg-yellow-500/10 text-yellow-500";
      case "ACTIVATE":
        return "bg-purple-500/10 text-purple-500";
      case "DEACTIVATE":
        return "bg-gray-500/10 text-gray-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              {getTargetIcon()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{activity.user.name}</span>
                <Badge variant="outline" className={getActionColor()}>
                  {getActionIcon()}
                  <span className="ml-1 capitalize">
                    {activity.action.toLowerCase()}
                  </span>
                </Badge>
                <span className="text-muted-foreground">
                  {activity.targetType}:{activity.targetId}
                </span>
              </div>
              {activity.details && (
                <p className="text-sm text-muted-foreground">
                  {activity.details}
                </p>
              )}
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}