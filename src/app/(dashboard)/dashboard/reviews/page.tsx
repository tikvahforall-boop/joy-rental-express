"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Star, MessageSquareText } from "lucide-react";
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/ui/star-rating";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

type Review = {
  id: string;
  overallRating: number;
  comment: string | null;
  createdAt: string;
  type: string;
  author: {
    id: string;
    name: string;
    firstName: string;
    avatarUrl: string | null;
  };
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
  } | null;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

function ReviewCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 flex-shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyReviews({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center py-16">
      <Star className="mb-3 h-12 w-12 text-gray-300" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar
            src={review.author.avatarUrl}
            name={review.author.name}
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-gray-900">
                {review.author.name}
              </p>
              <span className="text-xs text-gray-400">
                {formatDate(review.createdAt)}
              </span>
            </div>
            {review.vehicle && (
              <p className="mt-0.5 text-xs text-gray-500">
                {review.vehicle.year} {review.vehicle.make}{" "}
                {review.vehicle.model}
              </p>
            )}
            <div className="mt-1.5">
              <StarRating rating={review.overallRating} size="sm" showValue />
            </div>
            {review.comment && (
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                {review.comment}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReviewsPage() {
  const { data: session } = useSession();
  const currentUserId = (session?.user as { id?: string })?.id;
  const [activeTab, setActiveTab] = useState("received");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(
    async (tab: string, page: number) => {
      if (!currentUserId) return;
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", "10");
        params.set("userId", currentUserId);

        const res = await fetch(`/api/reviews?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          const payload = data.data || data;
          const allReviews: Review[] = payload.reviews || [];

          const filtered =
            tab === "received"
              ? allReviews.filter((r) => r.author.id !== currentUserId)
              : allReviews.filter((r) => r.author.id === currentUserId);

          setReviews(filtered);
          setPagination(
            payload.pagination || {
              page,
              limit: 10,
              total: filtered.length,
              totalPages: 1,
            }
          );
        }
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    },
    [currentUserId]
  );

  useEffect(() => {
    fetchReviews(activeTab, 1);
  }, [activeTab, fetchReviews]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="mt-1 text-sm text-gray-500">
          See what others are saying and the reviews you have left.
        </p>
      </div>

      <Tabs
        defaultTab="received"
        value={activeTab}
        onChange={handleTabChange}
      >
        <TabList>
          <Tab value="received">Reviews Received</Tab>
          <Tab value="given">Reviews Given</Tab>
        </TabList>

        <TabPanel value="received">
          {loading ? (
            <div className="space-y-3">
              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
            </div>
          ) : reviews.length === 0 ? (
            <EmptyReviews message="No reviews received yet. Complete trips to get reviewed." />
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </TabPanel>

        <TabPanel value="given">
          {loading ? (
            <div className="space-y-3">
              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
            </div>
          ) : reviews.length === 0 ? (
            <EmptyReviews message="You have not written any reviews yet." />
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </TabPanel>
      </Tabs>

      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => fetchReviews(activeTab, pagination.page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => fetchReviews(activeTab, pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
