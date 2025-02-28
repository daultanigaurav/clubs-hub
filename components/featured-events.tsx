import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function FeaturedEvents() {
  // This would typically fetch from an API
  const events = [
    {
      id: 1,
      title: "Tech Workshop 2024",
      date: "March 15, 2024",
      location: "Main Auditorium",
      club: "Tech Club",
      category: "Technology",
    },
    {
      id: 2,
      title: "Cultural Night",
      date: "March 20, 2024",
      location: "Open Air Theatre",
      club: "Cultural Club",
      category: "Cultural",
    },
    {
      id: 3,
      title: "Sports Tournament",
      date: "March 25, 2024",
      location: "Sports Complex",
      club: "Sports Club",
      category: "Sports",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Featured Events</h2>
        <Button variant="outline" asChild>
          <Link href="/events">View All</Link>
        </Button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{event.club}</span>
                <span className="text-xs text-muted-foreground">{event.category}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href={`/events/${event.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

