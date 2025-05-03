import { StaffList } from "@/components/ui/staff-list"

export default function StaffPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Our Team</h1>
      <p className="text-muted-foreground mb-8">
        Meet the dedicated team that keeps our community running smoothly.
      </p>
      <StaffList />
    </div>
  )
} 