'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Calendar, Settings, LogOut } from 'lucide-react'
import { apiClient } from '@/lib/api'

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  bio?: string
  interests?: string[]
  profilePicture?: string
  joinedClubs?: any[]
  createdAt: string
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
      return
    }

    const fetchProfile = async () => {
      try {
        const data = await apiClient.getUserProfile()
        setProfile(data)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user, router])

  const handleLogout = () => {
    logout()
    router.push('/auth/logout')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load profile</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  {profile.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt={profile.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-primary" />
                  )}
                </div>
                <CardTitle>{profile.name}</CardTitle>
                <CardDescription>{profile.email}</CardDescription>
                <Badge variant="secondary" className="w-fit mx-auto">
                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.bio && (
                  <div>
                    <h4 className="font-medium mb-2">Bio</h4>
                    <p className="text-sm text-muted-foreground">{profile.bio}</p>
                  </div>
                )}
                
                {profile.interests && profile.interests.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, index) => (
                        <Badge key={index} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Joined Clubs */}
            <Card>
              <CardHeader>
                <CardTitle>Joined Clubs</CardTitle>
                <CardDescription>
                  Clubs you're currently a member of
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profile.joinedClubs && profile.joinedClubs.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {profile.joinedClubs.map((club) => (
                      <div key={club._id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{club.name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {club.category}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    You haven't joined any clubs yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your account details and activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Member Since</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

