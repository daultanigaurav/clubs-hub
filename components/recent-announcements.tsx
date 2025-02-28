import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from "lucide-react"

export function RecentAnnouncements() {
  // This would typically fetch from an API
  const announcements = [
    {
      id: 1,
      title: "Tech Fest Registration Open",
      date: "2 hours ago",
      type: "Event",
    },
    {
      id: 2,
      title: "New Club Applications",
      date: "1 day ago",
      type: "Administrative",
    },
    {
      id: 3,
      title: "Upcoming Workshop Series",
      date: "2 days ago",
      type: "Academic",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Recent Announcements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="flex items-start justify-between space-x-4 rounded-lg p-3 hover:bg-accent transition-colors"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">{announcement.title}</p>
                <p className="text-xs text-muted-foreground">{announcement.date}</p>
              </div>
              <span className="text-xs text-muted-foreground">{announcement.type}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

