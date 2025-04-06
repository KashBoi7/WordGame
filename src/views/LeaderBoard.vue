<template>
  <div class="leaderboard">
    <h1 class="title">🏆 Leaderboard</h1>
    <ul class="leaderboard-list">
      <li v-for="(entry, index) in scores" :key="entry.id" class="leaderboard-item">
        <span class="rank">#{{ index + 1 }}</span>
        <span class="player-name">{{ entry.username }}</span> <!-- Show player's name -->
        <span class="score">{{ entry.score }} pts</span>
        <span class="time">{{ formatTimestamp(entry.timestamp) }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

// Your Firebase config — same as the game file
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

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const scores = ref([])

const fetchScores = async () => {
  const q = query(
    collection(db, 'gameScores'),
    orderBy('score', 'desc'),
    limit(10) // Show top 10 scores
  )

  const querySnapshot = await getDocs(q)
  scores.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

const formatTimestamp = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleString()
}

onMounted(() => {
  fetchScores()
})
</script>

<style scoped>
.leaderboard {
  max-width: 800px;
  margin: auto;
  padding: 60px 20px;
  font-family: 'Lexend', sans-serif;
  color: #fff;
  text-align: center;
}

.title {
  font-size: 2.8rem;
  color: #E0911F;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(255, 204, 102, 0.5);
}

.leaderboard-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 18px 25px;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.leaderboard-item:hover {
  transform: translateY(-2px);
}

.rank {
  font-size: 1.3rem;
  font-weight: bold;
  color: #E0911F;
  width: 60px;
  text-align: left;
}

.player-name {
  flex: 1;
  text-align: left;
  font-size: 1.1rem;
  font-weight: 500;
  color: #ffffffcc;
  padding-left: 10px;
}

.score {
  font-size: 1.3rem;
  font-weight: bold;
  color: #3D6E7B;
  padding-right: 10px;
  white-space: nowrap;
}

.time {
  font-size: 0.9rem;
  color: #cccccc;
  white-space: nowrap;
}
</style>
