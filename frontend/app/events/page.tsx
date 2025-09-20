'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Calendar, MapPin, Users, Clock } from 'lucide-react'
import { apiClient } from '@/lib/api'

interface Event {
  _id: string
  title: string
  description: string
  eventType: string
  startDate: string
  endDate: string
  location: string
  venue: string
  club: {
    _id: string
    name: string
    logo?: string
  }
  organizer: {
    name: string
    email: string
  }
  maxParticipants: number
  registeredParticipants: any[]
  isRegistrationRequired: boolean
  registrationFee: number
  status: string
  createdAt: string
}

export default function EventsPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([])

  useEffect(() => {
    fetchEvents()
    if (user) {
      fetchRegisteredEvents()
    }
  }, [user])

  const fetchEvents = async () => {
    try {
      const data = await apiClient.getEvents({
        search: searchTerm || undefined,
        eventType: typeFilter || undefined,
        upcoming: true,
        limit: 20
      })
      setEvents(data.events || [])
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRegisteredEvents = async () => {
    try {
      const data = await apiClient.getUserEvents()
      setRegisteredEvents(data.events?.map((event: any) => event._id) || [])
    } catch (error) {
      console.error('Failed to fetch registered events:', error)
    }
  }

  const handleRegisterEvent = async (eventId: string) => {
    if (!user) {
      alert('Please sign in to register for events')
      return
    }

    try {
      await apiClient.registerForEvent(eventId)
      setRegisteredEvents([...registeredEvents, eventId])
    } catch (error: any) {
      alert(error.message || 'Failed to register for event')
    }
  }

  const handleUnregisterEvent = async (eventId: string) => {
    try {
      await apiClient.unregisterFromEvent(eventId)
      setRegisteredEvents(registeredEvents.filter(id => id !== eventId))
    } catch (error: any) {
      alert(error.message || 'Failed to unregister from event')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    fetchEvents()
  }

  const eventTypes = [
    { value: '', label: 'All Types' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'competition', label: 'Competition' },
    { value: 'social', label: 'Social' },
    { value: 'sports', label: 'Sports' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'other', label: 'Other' }
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Events</h1>
          <p className="text-muted-foreground">Discover and register for upcoming events</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full md:w-auto">
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription className="mt-1">
                      by {event.club.name}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {event.description.length > 120 
                    ? `${event.description.substring(0, 120)}...` 
                    : event.description
                  }
                </p>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(event.startDate)}
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.venue}, {event.location}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {event.registeredParticipants.length}
                    {event.maxParticipants > 0 && ` / ${event.maxParticipants}`} participants
                  </div>

                  {event.registrationFee > 0 && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      ${event.registrationFee} registration fee
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  {registeredEvents.includes(event._id) ? (
                    <Button 
                      variant="outline" 
                      onClick={() => handleUnregisterEvent(event._id)}
                      className="flex-1"
                    >
                      Unregister
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleRegisterEvent(event._id)}
                      className="flex-1"
                      disabled={!event.isRegistrationRequired && event.maxParticipants > 0 && event.registeredParticipants.length >= event.maxParticipants}
                    >
                      {event.isRegistrationRequired ? 'Register' : 'View Details'}
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {events.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No events found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

