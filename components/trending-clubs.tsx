import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function TrendingClubs() {
  // This would typically fetch from an API
  const clubs = [
    {
      id: 1,
      name: "Tech Club",
      members: 150,
      category: "Technology",
      description: "Exploring the latest in technology and innovation",
    },
    {
      id: 2,
      name: "Cultural Club",
      members: 120,
      category: "Arts",
      description: "Celebrating diversity through arts and culture",
    },
    {
      id: 3,
      name: "Sports Club",
      members: 200,
      category: "Sports",
      description: "Promoting fitness and sportsmanship",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Trending Clubs</h2>
        <Button variant="outline" asChild>
          <Link href="/clubs">View All</Link>
        </Button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {clubs.map((club) => (
          <Card key={club.id}>
            <CardHeader>
              <CardTitle>{club.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{club.members} members</span>
              </div>
              <p className="text-sm text-muted-foreground">{club.description}</p>
              <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold">
                {club.category}
              </span>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" asChild>
                <Link href={`/clubs/${club.id}`}>View Club</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

