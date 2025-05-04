"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from "sonner"
import Link from 'next/link'
import bcrypt from 'bcryptjs'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

// List of words for verification phrase
const wordList = [
  'apple', 'banana', 'cherry', 'dragon', 'eagle', 'forest', 'garden', 'honey',
  'island', 'jungle', 'knight', 'lemon', 'mountain', 'night', 'ocean', 'panda',
  'queen', 'river', 'sunset', 'tiger', 'unicorn', 'valley', 'water', 'xylophone',
  'yellow', 'zebra', 'Lantern', 'Mirage', 'Ember', 'Cascade', 'Horizon', 'Obsidian',
   'Velvet', 'Quantum', 'Illusion', 'Serene', 'Mysterious', 'Stellar', 'Vortex',
    'Labyrinth', 'Echo', 'Nomad', 'Tranquil', 'Prism', 'Radiant', 'Odyssey', 'Celestial'
]

const generateVerificationPhrase = () => {
  const shuffled = [...wordList].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 4).join('-')
}

const schema = z.object({
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  dob: z.string(),
  agree: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and confirm you are 18+'
  }),
  wantContributor: z.boolean().optional(),
  contributorBio: z.string().min(10, { message: "Please provide a detailed bio" }).optional(),
  contributorTelegramId: z.string().min(3, { message: "Please provide your Telegram ID" }).optional(),
  platformLinks: z.array(z.object({
    platform: z.string().min(1, { message: "Please select a platform" }),
    url: z.string().min(1, { message: "Please enter a valid URL" })
  })).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((data) => {
  if (data.wantContributor) {
    return Boolean(data.contributorBio) && 
           Boolean(data.contributorTelegramId) && 
           Array.isArray(data.platformLinks) && 
           data.platformLinks.length > 0;
  }
  return true;
}, {
  message: "Please fill all contributor fields",
  path: ['wantContributor'],
});

type FormData = z.infer<typeof schema>

export default function RegistrationForm() {
  const [isContributor, setIsContributor] = useState(false)
  const [platformLinks, setPlatformLinks] = useState<{ platform: string; url: string }[]>([])
  const [verificationPhrase, setVerificationPhrase] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<{ available: boolean; message: string } | null>(null)
  const [emailStatus, setEmailStatus] = useState<{ available: boolean; message: string } | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      agree: false,
      wantContributor: false,
      platformLinks: []
    }
  })

  // Watch username and email fields for changes
  const username = watch('username')
  const email = watch('email')

  // Debounce function to prevent too many API calls
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  // Check availability of username and email
  const checkAvailability = async (username: string, email: string) => {
    if (!username && !email) return

    setIsChecking(true)
    try {
      const response = await fetch('/api/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email }),
      })

      const result = await response.json()

      if (result.success) {
        if (username) {
          setUsernameStatus(result.username)
        }
        if (email) {
          setEmailStatus(result.email)
        }
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Failed to check availability:', error)
    } finally {
      setIsChecking(false)
    }
  }

  // Debounced version of checkAvailability
  const debouncedCheckAvailability = debounce(checkAvailability, 500)

  // Effect to check availability when username or email changes
  useEffect(() => {
    if (username || email) {
      debouncedCheckAvailability(username, email)
    }
  }, [username, email])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(verificationPhrase)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // Generate new verification phrase when contributor status changes
  useEffect(() => {
    if (isContributor) {
      setVerificationPhrase(generateVerificationPhrase())
      setValue('wantContributor', true)
    } else {
      setValue('wantContributor', false)
    }
  }, [isContributor, setValue])

  const addPlatformLink = () => {
    const newLinks = [...platformLinks, { platform: '', url: '' }]
    setPlatformLinks(newLinks)
    setValue('platformLinks', newLinks)
  }

  const removePlatformLink = (index: number) => {
    const newLinks = platformLinks.filter((_, i) => i !== index)
    setPlatformLinks(newLinks)
    setValue('platformLinks', newLinks)
  }

  const updatePlatformLink = (index: number, field: 'platform' | 'url', value: string) => {
    const newLinks = [...platformLinks]
    newLinks[index] = { ...newLinks[index], [field]: value }
    setPlatformLinks(newLinks)
    setValue('platformLinks', newLinks)
  }

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)

      // Check age before submitting
      const dobDate = new Date(data.dob)
      const today = new Date()
      let age = today.getFullYear() - dobDate.getFullYear()
      const monthDiff = today.getMonth() - dobDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
        age--
      }

      if (age < 18) {
        toast.error("You must be at least 18 years old to register.")
        setIsSubmitting(false)
        return
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          dob: data.dob,
          wantContributor: data.wantContributor,
          contributorBio: data.contributorBio,
          contributorTelegramId: data.contributorTelegramId,
          platformLinks: data.platformLinks,
          verificationPhrase: data.wantContributor ? verificationPhrase : null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed')
      }

      // Show success message
      toast.success(
        <div className="flex flex-col gap-2">
          <p className="font-medium">{result.message}</p>
          <Link href={result.loginLink} className="text-blue-500 hover:underline">
            Click here to login
          </Link>
        </div>,
        {
          duration: 5000,
        }
      )

      // Wait for 5 seconds before redirecting
      setTimeout(() => {
        router.push(result.loginLink)
      }, 5000)

    } catch (error: any) {
      console.error('Registration failed:', error)
      toast.error(error.message || "There was an error creating your account. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Join our community to access exclusive content and features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Input 
                placeholder="Username" 
                {...register('username')} 
                className={cn(
                  errors.username ? "border-red-500" : "",
                  usernameStatus?.available === false ? "border-red-500" : "",
                  usernameStatus?.available === true ? "border-green-500" : ""
                )}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{String(errors.username.message)}</p>
              )}
              {usernameStatus && !errors.username && (
                <p className={cn(
                  "text-sm",
                  usernameStatus.available ? "text-green-500" : "text-red-500"
                )}>
                  {usernameStatus.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Input 
                placeholder="Email" 
                type="email" 
                {...register('email')}
                className={cn(
                  errors.email ? "border-red-500" : "",
                  emailStatus?.available === false ? "border-red-500" : "",
                  emailStatus?.available === true ? "border-green-500" : ""
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{String(errors.email.message)}</p>
              )}
              {emailStatus && !errors.email && (
                <p className={cn(
                  "text-sm",
                  emailStatus.available ? "text-green-500" : "text-red-500"
                )}>
                  {emailStatus.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Input 
                placeholder="Password" 
                type="password" 
                {...register('password')}
                className={errors.password ? "border-red-500" : ""}
              />
              <Input 
                placeholder="Confirm Password" 
                type="password" 
                {...register('confirmPassword')}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{String(errors.confirmPassword.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date of Birth</label>
              <Input 
                type="date" 
                {...register('dob')}
                className={cn(
                  errors.dob ? "border-red-500" : "",
                  "hover:border-primary focus:border-primary"
                )}
              />
              {errors.dob && (
                <p className="text-red-500 text-sm">{String(errors.dob.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="agree" 
                  {...register('agree')}
                  onCheckedChange={(checked) => {
                    setValue('agree', checked === true)
                  }}
                />
                <label
                  htmlFor="agree"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I confirm I am 18+ and agree to the{' '}
                  <Link href="/terms" className="text-blue-500 hover:underline">
                    Terms
                  </Link>{' '}
                  &{' '}
                  <Link href="/privacy" className="text-blue-500 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agree && (
                <p className="text-red-500 text-sm">{String(errors.agree.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wantContributor"
                  checked={isContributor}
                  onCheckedChange={(val: boolean) => setIsContributor(val)}
                />
                <label
                  htmlFor="wantContributor"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I want to be a contributor
                </label>
              </div>
            </div>

            {isContributor && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Textarea 
                    placeholder="Tell us about yourself and your experience" 
                    {...register('contributorBio')}
                    className="min-h-[100px]"
                  />
                  {errors.contributorBio && (
                    <p className="text-red-500 text-sm">{String(errors.contributorBio.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Input 
                    placeholder="Your Telegram ID (e.g., @username)" 
                    {...register('contributorTelegramId')}
                  />
                  {errors.contributorTelegramId && (
                    <p className="text-red-500 text-sm">{String(errors.contributorTelegramId.message)}</p>
                  )}
                </div>

                {/* Verification Phrase Display */}
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important: Save Your Verification Phrase</h3>
                  <p className="text-yellow-700 mb-2">
                    This phrase will be used to verify your identity. Please save it securely:
                  </p>
                  <div className="bg-white p-3 rounded border border-yellow-300 flex items-center justify-between gap-2">
                    <p className="text-lg font-mono flex-1 text-center">{verificationPhrase}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="shrink-0"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <p className="text-sm text-yellow-600 mt-2">
                    Note: You will need this phrase for future verification with our moderation team.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Platform Links</h3>
                    <Button type="button" onClick={addPlatformLink}>
                      Add Platform
                    </Button>
                  </div>
                  
                  {platformLinks.map((link, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <Select
                        value={link.platform}
                        onValueChange={(value) => updatePlatformLink(index, 'platform', value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="telegram">Telegram Channel</SelectItem>
                          <SelectItem value="terabox">Terabox</SelectItem>
                          <SelectItem value="mega">MEGA</SelectItem>
                          <SelectItem value="gdrive">Google Drive</SelectItem>
                          <SelectItem value="other">Other Platform</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Input
                        placeholder="Enter platform URL"
                        value={link.url}
                        onChange={(e) => updatePlatformLink(index, 'url', e.target.value)}
                        className="flex-1"
                      />
                      
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removePlatformLink(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  
                  {errors.platformLinks && (
                    <p className="text-red-500 text-sm">{String(errors.platformLinks.message)}</p>
                  )}
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Registering...</span>
                </div>
              ) : (
                "Register"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-500 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 