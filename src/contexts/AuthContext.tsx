import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '@/services/firebase/config'
import { getUserData } from '@/services/auth'
import { onDemoAuthStateChanged, getDemoUserData, getCurrentDemoUser } from '@/demo/auth'
import type { UserData } from '@/types'

const isDemo = import.meta.env.VITE_DEMO_MODE === 'true'

interface DemoUser {
  uid: string
  email: string
  emailVerified: boolean
  displayName: string | null
  photoURL: string | null
}

interface AuthContextType {
  user: (User | DemoUser) | null
  userData: UserData | null
  loading: boolean
  isPremium: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isPremium: false,
  isAdmin: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<(User | DemoUser) | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemo) {
      const initial = getCurrentDemoUser()
      if (initial) {
        setUser(initial)
        const data = getDemoUserData(initial.uid)
        setUserData(data || null)
      }
      setLoading(false)

      const unsub = onDemoAuthStateChanged((demoUser) => {
        setUser(demoUser)
        if (demoUser) {
          const data = getDemoUserData(demoUser.uid)
          setUserData(data || null)
        } else {
          setUserData(null)
        }
      })
      return unsub
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setUser(firebaseUser)
        if (firebaseUser) {
          const data = await getUserData(firebaseUser.uid)
          setUserData(data)
        } else {
          setUserData(null)
        }
      } catch (err) {
        console.error('Auth error:', err)
      } finally {
        setLoading(false)
      }
    })
    return unsubscribe
  }, [])

  const isPremium = userData?.premium === true && userData?.premiumUntil
    ? new Date(userData.premiumUntil) > new Date()
    : false

  const isAdmin = userData?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, userData, loading, isPremium, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
