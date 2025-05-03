import { TodayActivity } from "@/components/ui/today-activity"

export default function ActivityPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Today's Activity</h1>
      <TodayActivity />
    </div>
  )
} 