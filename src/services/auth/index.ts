import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/services/firebase/config'
import type { UserData } from '@/types'
import {
  demoLoginWithEmail as demoLogin,
  demoLoginWithGoogle as demoGoogle,
  demoLogout,
  demoRegisterWithEmail as demoRegister,
  demoResetPassword,
  getDemoUserData,
} from '@/demo/auth'

const isDemo = import.meta.env.VITE_DEMO_MODE === 'true'

export async function registerWithEmail(
  name: string,
  email: string,
  password: string
) {
  if (isDemo) return demoRegister(name, email, password)
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName: name })
  await sendEmailVerification(credential.user)
  await setDoc(doc(db, 'users', credential.user.uid), {
    uid: credential.user.uid,
    name,
    email,
    photoURL: '',
    role: 'user',
    premium: false,
    plan: null,
    premiumUntil: null,
    createdAt: serverTimestamp(),
  })
  return credential.user
}

export async function loginWithEmail(email: string, password: string) {
  if (isDemo) return demoLogin(email, password)
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function loginWithGoogle() {
  if (isDemo) return demoGoogle()
  const provider = new GoogleAuthProvider()
  const credential = await signInWithPopup(auth, provider)
  const user = credential.user
  const userDoc = await getDoc(doc(db, 'users', user.uid))
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: user.displayName || 'Usuário',
      email: user.email,
      photoURL: user.photoURL || '',
      role: 'user',
      premium: false,
      plan: null,
      premiumUntil: null,
      createdAt: serverTimestamp(),
    })
  }
  return user
}

export async function logoutUser() {
  if (isDemo) return demoLogout()
  await signOut(auth)
}

export async function resetPassword(email: string) {
  if (isDemo) return demoResetPassword(email)
  await sendPasswordResetEmail(auth, email)
}

export async function getUserData(uid: string): Promise<UserData | null> {
  if (isDemo) return getDemoUserData(uid)
  const docRef = doc(db, 'users', uid)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data() as UserData
  }
  return null
}

export async function updateUserName(name: string) {
  if (isDemo) return
  const user = auth.currentUser
  if (user) {
    await updateProfile(user, { displayName: name })
    await setDoc(doc(db, 'users', user.uid), { name }, { merge: true })
  }
}
