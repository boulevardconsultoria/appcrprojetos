import { DEMO_USERS } from './data'
import type { UserData } from '@/types'

interface DemoUser {
  uid: string
  email: string
  emailVerified: boolean
  displayName: string | null
  photoURL: string | null
}

let currentDemoUser: DemoUser | null = null
const listeners: Array<(user: DemoUser | null) => void> = []

export function onDemoAuthStateChanged(callback: (user: DemoUser | null) => void) {
  listeners.push(callback)
  callback(currentDemoUser)
  return () => {
    const idx = listeners.indexOf(callback)
    if (idx >= 0) listeners.splice(idx, 1)
  }
}

function notifyListeners() {
  listeners.forEach((cb) => cb(currentDemoUser))
}

export function getDemoUserData(uid: string): UserData | null {
  const user = DEMO_USERS.find((u) => u.uid === uid)
  if (!user) return null
  const { password: _, ...userData } = user
  return userData as UserData
}

export function getAllDemoUsers(): UserData[] {
  return DEMO_USERS.map(({ password: _, ...u }) => u as UserData)
}

export async function demoLoginWithEmail(
  email: string,
  password: string
): Promise<DemoUser> {
  const user = DEMO_USERS.find(
    (u) => u.email === email && u.password === password
  )
  if (!user) {
    throw new Error('E-mail ou senha inválidos')
  }
  currentDemoUser = {
    uid: user.uid,
    email: user.email,
    emailVerified: true,
    displayName: user.name,
    photoURL: user.photoURL || null,
  }
  notifyListeners()
  return currentDemoUser
}

export async function demoLoginWithGoogle(): Promise<DemoUser> {
  const user = DEMO_USERS[0]
  currentDemoUser = {
    uid: user.uid,
    email: user.email,
    emailVerified: true,
    displayName: user.name,
    photoURL: user.photoURL || null,
  }
  notifyListeners()
  return currentDemoUser
}

export async function demoRegisterWithEmail(
  name: string,
  email: string,
  password: string
) {
  currentDemoUser = {
    uid: `demo-user-${Date.now()}`,
    email,
    emailVerified: false,
    displayName: name,
    photoURL: null,
  }
  DEMO_USERS.push({
    uid: currentDemoUser.uid,
    name,
    email,
    photoURL: '',
    role: 'user',
    premium: false,
    plan: null,
    premiumUntil: null,
    createdAt: new Date(),
    password,
  })
  notifyListeners()
  return currentDemoUser
}

export async function demoLogout() {
  currentDemoUser = null
  notifyListeners()
}

export async function demoResetPassword(_email: string) {
  return
}

export function getCurrentDemoUser() {
  return currentDemoUser
}
