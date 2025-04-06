// src/firebase.js

import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

// ✅ Your Firebase configuration object
const firebaseConfig = {
  apiKey: 'AIzaSyCx8hJDYzHBvlakxZQxj0Pk5VOzvG69Ww8',
  authDomain: 'wordgame-cf892.firebaseapp.com',
  databaseURL: 'https://wordgame-cf892-default-rtdb.firebaseio.com',
  projectId: 'wordgame-cf892',
  storageBucket: 'wordgame-cf892.appspot.com',
  messagingSenderId: '897393117287',
  appId: '1:897393117287:web:02c7158971650a5cee2cc2',
  measurementId: 'G-GYKQW85K14'
}

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig)

// ✅ Initialize services
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()
const database = getDatabase(app)

// ✅ Export everything you need
export { app, auth, googleProvider, database }
