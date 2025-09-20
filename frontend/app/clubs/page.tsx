'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Users, Calendar, MapPin } from 'lucide-react'
import { apiClient } from '@/lib/api'

interface Club {
  _id: string
  name: string
  description: string
  category: string
  logo?: string
  president: {
    name: string
    email: string
  }
  members: any[]
  socialLinks?: {
    website?: string
    instagram?: string
    facebook?: string
  }
  createdAt: string
}

export default function ClubsPage() {
  const { user } = useAuth()
  const [clubs, setClubs] = useState<Club[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [joinedClubs, setJoinedClubs] = useState<string[]>([])

  useEffect(() => {
    fetchClubs()
    if (user) {
      fetchJoinedClubs()
    }
  }, [user])

  const fetchClubs = async () => {
    try {
      const data = await apiClient.getClubs({
        search: searchTerm || undefined,
        category: categoryFilter || undefined,
        limit: 20
      })
      setClubs(data.clubs || [])
    } catch (error) {
      console.error('Failed to fetch clubs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchJoinedClubs = async () => {
    try {
      const data = await apiClient.getUserClubs()
      setJoinedClubs(data.map((club: any) => club._id))
    } catch (error) {
      console.error('Failed to fetch joined clubs:', error)
    }
  }

  const handleJoinClub = async (clubId: string) => {
    if (!user) {
      alert('Please sign in to join clubs')
      return
    }

    try {
      await apiClient.joinClub(clubId)
      setJoinedClubs([...joinedClubs, clubId])
    } catch (error: any) {
      alert(error.message || 'Failed to join club')
    }
  }

  const handleLeaveClub = async (clubId: string) => {
    try {
      await apiClient.leaveClub(clubId)
      setJoinedClubs(joinedClubs.filter(id => id !== clubId))
    } catch (error: any) {
      alert(error.message || 'Failed to leave club')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    fetchClubs()
  }

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'academic', label: 'Academic' },
    { value: 'sports', label: 'Sports' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'technical', label: 'Technical' },
    { value: 'social', label: 'Social' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'other', label: 'Other' }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading clubs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Clubs</h1>
          <p className="text-muted-foreground">Discover and join clubs that match your interests</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search clubs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
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

        {/* Clubs Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club) => (
            <Card key={club._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{club.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {club.description.length > 100 
                        ? `${club.description.substring(0, 100)}...` 
                        : club.description
                      }
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {club.category.charAt(0).toUpperCase() + club.category.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  {club.members.length} members
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Founded {new Date(club.createdAt).toLocaleDateString()}
                </div>

                {club.socialLinks && (
                  <div className="flex space-x-2">
                    {club.socialLinks.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={club.socialLinks.website} target="_blank" rel="noopener noreferrer">
                          Website
                        </a>
                      </Button>
                    )}
                    {club.socialLinks.instagram && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={club.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                          Instagram
                        </a>
                      </Button>
                    )}
                  </div>
                )}

                <div className="flex space-x-2">
                  {joinedClubs.includes(club._id) ? (
                    <Button 
                      variant="outline" 
                      onClick={() => handleLeaveClub(club._id)}
                      className="flex-1"
                    >
                      Leave Club
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleJoinClub(club._id)}
                      className="flex-1"
                    >
                      Join Club
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {clubs.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No clubs found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

