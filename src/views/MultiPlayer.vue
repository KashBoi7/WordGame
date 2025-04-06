<template>
  <!-- Start Game Button -->
  <div v-if="!gameStarted" class="start-screen">
    <button class="start-btn" @click="startGame">
      Start {{ currentPlayer }}'s Turn
    </button>
  </div>

<!-- Game UI -->
<div v-else>
  <!-- ✅ Total Points Display at Top -->
  <div class="points top-score">
    <h3>{{ currentPlayer }}'s Score: {{ totalPoints }}</h3>
  </div>

  <div class="timer">
    <p v-if="timeLeft > 0">⏳ {{ timeLeft }}s</p>
    <p v-else>⏱️ Time's up!</p>
  </div>

    <div class="grid-container">
      <div
        v-for="(letter, index) in letters"
        :key="index"
        class="grid-cell"
        :class="{
          highlighted: highlightedIndex.includes(index),
          submitted: submittedIndices.includes(index),
          'fade-animation': fadeIndices.includes(index)
        }"
      >
        {{ letter }}
      </div>
    </div>

    <form @submit.prevent="submitWord" class="input-container">
      <input
        v-model="word"
        type="text"
        placeholder="Enter a word..."
        class="word-input"
        @input="filterInput"
        :disabled="timeLeft <= 0"
        :class="{ 'input-disabled': timeLeft <= 0 || isAnimating }"
      />
      <button
        type="submit"
        class="submit-btn"
        :disabled="!isValid || timeLeft <= 0 || isDuplicateWord || isAnimating"
      >
        Submit
      </button>
    </form>

    <div class="submitted-words">
      <h3>Submitted Words:</h3>
      <ul>
        <li v-for="(w, idx) in submittedWords" :key="idx">
          {{ w }} - {{ getWordPoints(w) }} points
        </li>
      </ul>
    </div>

    <div class="points">
      <h3>Total Points: {{ totalPoints }}</h3>
    </div>
  </div>
</template>

<script setup>
// Import Vue functions
import { ref, onBeforeUnmount, watch } from 'vue'
// Import axios for API requests
import axios from 'axios'
// Firebase functions
import { initializeApp } from 'firebase/app'

import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const router = useRouter()
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
// State variables
const timeLeft = ref(60)
let timerInterval = null
const gameStarted = ref(false)
const letters = ref([])
const word = ref('')
const submittedWords = ref([])
const highlightedIndex = ref([])
const matchHistory = ref([])
const submittedIndices = ref([])
const isValid = ref(false)
const totalPoints = ref(0)
const isDuplicateWord = ref(false)
const isAnimating = ref(false)
const fadeIndices = ref([])
const currentPlayer = ref('Player 1')

// Letter points

const letterPoints = {
  A: 1,
  E: 1,
  I: 1,
  O: 1,
  U: 1,
  L: 1,
  N: 1,
  S: 1,
  T: 1,
  R: 1,
  D: 2,
  G: 2,
  B: 3,
  C: 3,
  M: 3,
  P: 3,
  F: 4,
  H: 4,
  V: 4,
  W: 4,
  Y: 4,
  K: 5,
  J: 8,
  X: 8,
  Q: 10,
  Z: 10
}

// Generate grid of letters
const generateGrid = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const vowels = 'AEIOU'
  const grid = Array(25).fill(null)
  let vowelsPlaced = 0

  while (vowelsPlaced < 2) {
    const randomIndex = Math.floor(Math.random() * 25)
    if (!grid[randomIndex]) {
      grid[randomIndex] = vowels[Math.floor(Math.random() * vowels.length)]
      vowelsPlaced++
    }
  }

  for (let i = 0; i < 25; i++) {
    if (!grid[i]) {
      grid[i] = alphabet[Math.floor(Math.random() * alphabet.length)]
    }
  }

  letters.value = grid
}

// Reset the game state
const resetGame = () => {
  timeLeft.value = 60
  gameStarted.value = false
  letters.value = []
  word.value = ''
  submittedWords.value = []
  highlightedIndex.value = []
  matchHistory.value = []
  submittedIndices.value = []
  isValid.value = false
  totalPoints.value = 0
  isDuplicateWord.value = false
  isAnimating.value = false
  fadeIndices.value = []

  if (timerInterval) {
    clearInterval(timerInterval)
  }
}

// Start the game and initialize timer
const startGame = () => {
  gameStarted.value = true
  generateGrid()

  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timerInterval)
      alert("Time's up! End of turn!")
      setTimeout(() => {
        switchPlayer()
        resetGame()
      }, 2000)
    }
  }, 1000)
}

// Save score to Firebase
const saveScoreToFirebase = async () => {
  try {
    const playerName = currentPlayer.value
    const score = totalPoints.value
    // const scoresRef = collection(db, 'dualPlayer') // Collection name should match Firebase
    await addDoc(collection(db, 'dualPlayer'), {
      player: playerName,
      score: score,
      timestamp: new Date()
    })
    console.log(`Score for ${playerName} saved to Firebase.`)
  } catch (error) {
    console.error('Error saving score to Firebase:', error)
  }
}

// Switch to the next player
const switchPlayer = () => {
  saveScoreToFirebase().then(() => {
    if (currentPlayer.value === 'Player 1') {
      currentPlayer.value = 'Player 2'
    } else {
      currentPlayer.value = 'Player 1'
      // After Player 2's turn, redirect to results page
      setTimeout(() => {
        router.push({ name: 'Results' })
      }, 900)
    }
    totalPoints.value = 0
  })
}

// Watch for word changes
watch(word, (newWord, oldWord) => {
  // Handle character input changes for highlighting cells
  if (newWord.length > oldWord.length) {
    const newChar = newWord.at(-1).toLowerCase()
    const matchIndex = letters.value.findIndex(
      (l, i) => l.toLowerCase() === newChar && !highlightedIndex.value.includes(i)
    )
    if (matchIndex !== -1) {
      highlightedIndex.value.push(matchIndex)
      matchHistory.value.push(matchIndex)
    }
  }

  if (newWord.length < oldWord.length) {
    const lastIndex = matchHistory.value.pop()
    highlightedIndex.value = highlightedIndex.value.filter(i => i !== lastIndex)
  }

  validateWord(newWord)
  checkForDuplicateWord(newWord)
})

// Handle input filtering
const filterInput = () => {
  const allowedLetters = letters.value.map(l => l.toLowerCase())
  let filtered = ''
  const letterCounts = {}

  for (const char of word.value.toLowerCase()) {
    if (allowedLetters.includes(char)) {
      const totalAvailable = allowedLetters.filter(l => l === char).length
      const used = letterCounts[char] || 0
      if (used < totalAvailable) {
        filtered += char
        letterCounts[char] = used + 1
      }
    }
  }

  word.value = filtered
}

// Check if word is valid
const isValidWord = async (word) => {
  if (word.length < 3) {
    return false
  }
  try {
    const response = await axios.get(`https://api.datamuse.com/words?sp=${word}&max=1`)
    return response.data.length > 0
  } catch (error) {
    console.error('Error checking word validity:', error)
    return false
  }
}

// Validate word and check for duplicates
const validateWord = async (newWord) => {
  if (newWord.trim().length === 0) {
    isValid.value = false
  } else {
    isValid.value = await isValidWord(newWord.trim().toLowerCase())
  }
}

const checkForDuplicateWord = (newWord) => {
  isDuplicateWord.value = submittedWords.value.includes(newWord.trim().toLowerCase())
}

// Get points for a word
const getWordPoints = (word) => {
  return word.split('').reduce((points, letter) => {
    const upperLetter = letter.toUpperCase()
    return points + (letterPoints[upperLetter] || 0)
  }, 0)
}

// Submit word
const submitWord = async () => {
  const trimmed = word.value.trim().toLowerCase()
  if (!trimmed) return

  const valid = await isValidWord(trimmed)
  if (!valid) {
    alert('The word is not valid.')
    word.value = ''
    return
  }

  if (submittedWords.value.includes(trimmed)) {
    alert('You have already submitted this word!')
    word.value = ''
    return
  }

  isAnimating.value = true
  fadeIndices.value = [...highlightedIndex.value]

  setTimeout(() => {
    fadeIndices.value.forEach(index => {
      letters.value[index] = generateRandomLetter()
    })
    fadeIndices.value = []
    isAnimating.value = false
  }, 600)

  const wordPoints = getWordPoints(trimmed)
  totalPoints.value += wordPoints

  submittedWords.value.push(trimmed)
  submittedIndices.value = [...highlightedIndex.value]
  word.value = ''
  highlightedIndex.value = []
  matchHistory.value = []

  setTimeout(() => {
    submittedIndices.value = []
  }, 1000)
}

// Generate random letter
const generateRandomLetter = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return alphabet[Math.floor(Math.random() * alphabet.length)]
}

// Clean up before component is unmounted
onBeforeUnmount(() => {
  clearInterval(timerInterval)
})
</script>

<style scoped>
/* App background */
:deep(body) {
  background: linear-gradient(to bottom right, #3D6E7B, #46234D);
  font-family: 'Lexend', sans-serif;
  margin: 0;
  color: white;
}

.start-screen {
  text-align: center;
  padding: 60px 20px;
}

.start-btn {
  padding: 16px 36px;
  font-size: 1.4rem;
  font-weight: bold;
  background-color: #E0911F;
  color: white;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  box-shadow: 0 0 20px #e0911f99;
  transition: all 0.3s ease;
}
.start-btn:hover {
  background-color: #ffb238;
  transform: scale(1.05);
}

/* Timer + player label */
.timer, .player-label {
  text-align: center;
  font-size: 1.3rem;
  font-weight: 600;
  color: #ffe6b7;
  margin-top: 10px;
}

/* Grid */
.grid-container {
  display: grid;
  grid-template-columns: repeat(5, 70px);
  grid-template-rows: repeat(5, 70px);
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin: 30px auto;
}

.grid-cell {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(6px);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: bold;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
  transition: 0.3s;
  color: #fff;
  border: 2px solid transparent;
}

.grid-cell.highlighted {
  border: 2px solid #E0911F;
  background: rgba(255, 255, 255, 0.15);
}

.grid-cell.submitted {
  opacity: 0.4;
}

.fade-animation {
  animation: fadeInOut 0.6s ease;
}

@keyframes fadeInOut {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}

/* Input & Submit */
.input-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
  max-width: 500px;
  margin-inline: auto;
}
.points.top-score {
  text-align: center;
  margin-top: 25px;
}

.points.top-score h3 {
  font-size: 1.6rem;
  color: #E0911F;
  text-shadow: 0 0 6px #e0911f99;
}

.word-input {
  flex: 1;
  padding: 12px 16px;
  font-size: 1rem;
  border-radius: 10px;
  background: #2e2e2e;
  color: white;
  border: none;
  outline: none;
}

.input-disabled {
  background-color: #555;
}

.submit-btn {
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: bold;
  background-color: #E0911F;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.submit-btn:hover {
  background-color: #ffb238;
}

/* Submitted words */
.submitted-words {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  margin: 30px auto 10px;
  border-radius: 12px;
  max-width: 500px;
  backdrop-filter: blur(8px);
  text-align: center;
  color: #eee;
}

.submitted-words ul {
  list-style: none;
  padding: 0;
}

.submitted-words li {
  margin-bottom: 5px;
}

/* Score section */
.points {
  text-align: center;
  margin-top: 20px;
}

.points h3 {
  font-size: 1.5rem;
  color: #E0911F;
  text-shadow: 0 0 6px #e0911f99;
}
</style>
