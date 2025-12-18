"use client";

import { ActivityDetail } from "@/components/activities/ActivityDetail";

export default function ActivityDetailPage({ params }: { params: { id: string } }) {
  return <ActivityDetail activityId={params.id} />;
}
