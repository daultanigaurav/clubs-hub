'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save } from 'lucide-react'
import { apiClient } from '@/lib/api'

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    interests: [] as string[],
    newInterest: ''
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
      return
    }

    // Initialize form with user data
    setFormData({
      name: user.name || '',
      bio: '',
      interests: [],
      newInterest: ''
    })
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const addInterest = () => {
    if (formData.newInterest.trim() && !formData.interests.includes(formData.newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, formData.newInterest.trim()],
        newInterest: ''
      })
    }
  }

  const removeInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setMessage('')

    try {
      await apiClient.updateUserProfile({
        name: formData.name,
        bio: formData.bio,
        interests: formData.interests
      })
      
      setMessage('Profile updated successfully!')
    } catch (error: any) {
      setError(error.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Please sign in to access settings</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Interests</Label>
                <div className="flex space-x-2">
                  <Input
                    value={formData.newInterest}
                    onChange={(e) => setFormData({ ...formData, newInterest: e.target.value })}
                    placeholder="Add an interest"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                  />
                  <Button type="button" onClick={addInterest} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.interests.map((interest, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                    >
                      <span>{interest}</span>
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="hover:text-primary/70"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

