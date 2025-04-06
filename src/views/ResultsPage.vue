<template>
  <div class="results">
    <h1>🏁 Game Over!</h1>

    <div v-if="player1Points !== null && player2Points !== null" class="score-box">
      <p>👤 <strong>Player 1:</strong> {{ player1Points }} pts</p>
      <p>👥 <strong>Player 2:</strong> {{ player2Points }} pts</p>

      <div class="result">
        <p v-if="player1Points > player2Points">🏆 <strong>Player 1 Wins!</strong></p>
        <p v-else-if="player2Points > player1Points">🏆 <strong>Player 2 Wins!</strong></p>
        <p v-else>🥇 <strong>It's a Tie!</strong></p>
      </div>
    </div>

    <p v-else>Loading scores...</p>

    <button @click="playAgain" class="play-again-btn">Play Again</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { useRouter } from 'vue-router'
onMounted(async () => {
  await fetchScores()

  // Only delete if scores are successfully fetched
  if (player1Points.value !== null && player2Points.value !== null) {
    await deleteScores()
  }
})

// Firestore + Router
const db = getFirestore()
const router = useRouter()

// Score refs
const player1Points = ref(null)
const player2Points = ref(null)

const fetchScores = async () => {
  try {
    const scoresRef = collection(db, 'dualPlayer')
    const snapshot = await getDocs(scoresRef)

    if (snapshot.empty) {
      router.push({ name: 'MultiPlayer' })
      return
    }

    const scores = snapshot.docs.map(doc => doc.data())

    if (scores.length >= 2) {
      player1Points.value = scores[0].score
      player2Points.value = scores[1].score
    } else {
      router.push({ name: 'MultiPlayer' })
    }
  } catch (error) {
    console.error('Error fetching scores:', error)
  }
}

const deleteScores = async () => {
  try {
    const scoresRef = collection(db, 'dualPlayer')
    const snapshot = await getDocs(scoresRef)
    snapshot.docs.forEach(async (docSnap) => {
      await deleteDoc(doc(db, 'dualPlayer', docSnap.id))
    })
  } catch (error) {
    console.error('Error deleting scores:', error)
  }
}

onMounted(async () => {
  await fetchScores()
  if (player1Points.value !== null && player2Points.value !== null) {
    await deleteScores()
  }
})

const playAgain = () => {
  router.push({ name: 'MultiPlayer' })
}
</script>

<style scoped>
.results {
  text-align: center;
  padding: 60px 20px;
  color: white;
  font-family: 'Lexend', sans-serif;
  background: linear-gradient(to bottom right, #3D6E7B, #46234D);
  min-height: 100vh;
}

.results h1 {
  font-size: 3rem;
  margin-bottom: 30px;
  color: #ffffff;
  text-shadow: 0 0 10px #00000040;
}

.score-box {
  background: rgba(255, 255, 255, 0.05);
  padding: 30px;
  border-radius: 16px;
  margin: 30px auto;
  max-width: 500px;
  backdrop-filter: blur(6px);
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
  font-size: 1.4rem;
  line-height: 1.8;
}

.score-box p {
  margin: 10px 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.result p {
  font-size: 2rem;
  color: #F9C74F;
  font-weight: 700;
  margin-top: 24px;
  text-shadow: 0 0 6px #00000020;
}

.play-again-btn {
  padding: 16px 36px;
  font-size: 1.3rem;
  font-weight: bold;
  background-color: #E0911F;
  color: white;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  box-shadow: 0 0 20px #e0911f99;
  margin-top: 40px;
  transition: all 0.3s ease;
}

.play-again-btn:hover {
  background-color: #ffb238;
  transform: scale(1.05);
}

</style>
