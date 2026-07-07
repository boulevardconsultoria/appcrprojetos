import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCbCWu5IpE9pWP2knb9D6-jxRu0SP4OX2g',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'crprojetos3d-e2211.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'crprojetos3d-e2211',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'crprojetos3d-e2211.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '830861761940',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:830861761940:web:4bb5e5cd1b063f8cd0c381',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

if (import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099')
  connectFirestoreEmulator(db, 'localhost', 8081)
  connectStorageEmulator(storage, 'localhost', 9199)
}

export default app
