import { initializeApp, getApps } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAs_V5iNUOTj16CXSM-Iuz5i40vk868RFM",
  authDomain: "adult-forum-24c02.firebaseapp.com",
  databaseURL: "https://adult-forum-24c02-default-rtdb.firebaseio.com",
  projectId: "adult-forum-24c02",
  storageBucket: "adult-forum-24c02.firebasestorage.app",
  messagingSenderId: "786002927442",
  appId: "1:786002927442:web:783b1ebfab8d9bf745648b",
  measurementId: "G-8RY9YDPE2B"
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const database = getDatabase(app)
const storage = getStorage(app, "gs://adult-forum-24c02.firebasestorage.app")
const auth = getAuth(app)

// Initialize analytics only on client side
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null

export { app, database, storage, analytics, auth } 