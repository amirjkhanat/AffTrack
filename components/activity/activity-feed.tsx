"use client";

import { useState, useEffect } from "react";
import { ActivityType, ActivityAction } from "@prisma/client";
import { Activity } from "@/lib/types/activity";
import { ActivityItem } from "./activity-item";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ActivityFeedProps {
  searchTerm: string;
  filters?: {
    types: ActivityType[];
    actions: ActivityAction[];
  };
}

export function ActivityFeed({ searchTerm, filters }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const fetchActivities = async (pageNum: number, append: boolean = false) => {
    try {
      console.log('Fetching activities with:', { searchTerm, filters, page: pageNum });
      
      const response = await fetch('/api/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          search: searchTerm,
          types: filters?.types,
          actions: filters?.actions,
          page: pageNum,
          limit: 10,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received activities data type:', typeof data);
      console.log('Received activities:', data);

      // Validate the data structure
      if (!data) {
        throw new Error('No data received from server');
      }

      if (typeof data !== 'object') {
        throw new Error(`Invalid data type received: ${typeof data}`);
      }

      const items = Array.isArray(data) ? data : data.items;
      if (!items) {
        throw new Error('No items found in response');
      }

      if (!Array.isArray(items)) {
        throw new Error('Items is not an array');
      }

      // If we get here, we know items is a valid array
      if (append) {
        setActivities(prev => [...prev, ...items]);
      } else {
        setActivities(items);
      }
      setHasMore(Array.isArray(data) ? items.length === 10 : !!data.hasMore);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    setPage(1);
    setLoading(true);
    fetchActivities(1, false).finally(() => setLoading(false));
  }, [searchTerm, filters]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchActivities(nextPage, true);
    setPage(nextPage);
    setLoadingMore(false);
  };

  if (loading) {
    return <div>Loading activities...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (activities.length === 0) {
    return <div className="text-muted-foreground">No activities found</div>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}