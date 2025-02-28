import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { FeaturedEvents } from "@/components/featured-events"
import { TrendingClubs } from "@/components/trending-clubs"
import { RecentAnnouncements } from "@/components/recent-announcements"
import { QuickEventFinder } from "@/components/quick-event-finder"

export default function Home() {
  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Stay Updated. Get Involved.
                <span className="text-primary block">Elevate Your College Experience</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Your one-stop platform for discovering events, joining clubs, and staying connected with all the
                opportunities your college has to offer.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <QuickEventFinder />
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/events">Explore Events</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/clubs">Browse Clubs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-12">
              <FeaturedEvents />
              <TrendingClubs />
            </div>
            <div className="space-y-8">
              <RecentAnnouncements />
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                <nav className="space-y-2">
                  <Link
                    href="/opportunities"
                    className="flex items-center justify-between rounded-md p-3 text-sm hover:bg-accent"
                  >
                    <span>Internship Opportunities</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/resources"
                    className="flex items-center justify-between rounded-md p-3 text-sm hover:bg-accent"
                  >
                    <span>Student Resources</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/blog"
                    className="flex items-center justify-between rounded-md p-3 text-sm hover:bg-accent"
                  >
                    <span>Blog & Updates</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

