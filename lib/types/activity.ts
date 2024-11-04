import { ActivityType, ActivityAction } from "@prisma/client";

export interface Activity {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
  };
  type: ActivityType;
  action: ActivityAction;
  targetType: string;
  targetId: string;
  details?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
} 