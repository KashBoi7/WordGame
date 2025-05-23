<template>
  <!-- Start Game Button and Name Input -->
<div v-if="!gameStarted" class="start-screen">
  <div v-if="!nameProvided" class="name-entry">
    <label for="username" class="name-label">Enter Your Name:</label>
    <input
      v-model="username"
      id="username"
      type="text"
      placeholder="e.g. Alex"
      class="name-input"
    />
    <button
      class="start-btn"
      @click="startGame"
      :disabled="!username"
    >
      Start Game
    </button>
  </div>

  <p v-else>Your game is about to begin, {{ username }}!</p>
</div>

  <!-- Game UI -->
  <div v-else>
    <div class="timer">
      <p v-if="timeLeft > 0">⏳ {{ timeLeft }}s</p>
      <p v-else>⏱️ Time's up!</p>
    </div>
  <div class="points top-score">
    <h3>Total Points: {{ totalPoints }}</h3>
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
        ref="wordInput"
        v-model="word"
        type="text"
        placeholder="Enter a word..."
        class="word-input"
        @input="filterInput"
        :disabled="timeLeft <= 0 "
        :class="{ 'input-disabled': timeLeft <= 0 || isAnimating }"
        autofocus
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
/* eslint-disable */
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import axios from 'axios'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCx8hJDYzHBvlakxZQxj0Pk5VOzvG69Ww8",
  authDomain: "wordgame-cf892.firebaseapp.com",
  databaseURL: "https://wordgame-cf892-default-rtdb.firebaseio.com",
  projectId: "wordgame-cf892",
  storageBucket: "wordgame-cf892.appspot.com",
  messagingSenderId: "897393117287",
  appId: "1:897393117287:web:02c7158971650a5cee2cc2",
  measurementId: "G-GYKQW85K14"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
import { nextTick } from 'vue'

const wordInput = ref(null)
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
const username = ref('')  // User's name input field
const nameProvided = ref(false)  // Flag to check if name is provided

const letterPoints = {
  A: 1, E: 1, I: 1, O: 1, U: 1, L: 1, N: 1, S: 1, T: 1, R: 1,
  D: 2, G: 2,
  B: 3, C: 3, M: 3, P: 3,
  F: 4, H: 4, V: 4, W: 4, Y: 4,
  K: 5,
  J: 8, X: 8,
  Q: 10, Z: 10
}

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

const submitScoreToFirestore = async () => {
  try {
    await addDoc(collection(db, 'gameScores'), {
      score: totalPoints.value,
      timestamp: new Date().toISOString(),
      username: username.value // Use the provided username
    })
    console.log('✅ Score submitted to Firestore')
  } catch (error) {
    console.error('❌ Error submitting score:', error)
  }
}

const startGame = () => {
  if (!username.value.trim()) {
    alert("Please enter your name to start the game!")
    return
  }

  nameProvided.value = true
  gameStarted.value = true
  generateGrid()
  timerInterval = setInterval(async () => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timerInterval)
      await submitScoreToFirestore()
      alert("Time is up! End of turn!")
    }
  }, 1000)
}

onBeforeUnmount(() => {
  clearInterval(timerInterval)
})

watch(word, (newWord, oldWord) => {
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

const isValidWord = async (word) => {
  if (word.length < 3) {
    return false
  }
  try {
    const response = await axios.get(`https://api.datamuse.com/words?sp=${word}&max=1`)
    return response.data.length > 0
  } catch (error) {
    console.error("Error checking word validity:", error)
    return false
  }
}

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

const getWordPoints = (word) => {
  return word.split('').reduce((points, letter) => {
    const upperLetter = letter.toUpperCase()
    return points + (letterPoints[upperLetter] || 0)
  }, 0)
}

const submitWord = async () => {
  const trimmed = word.value.trim().toLowerCase()
  if (!trimmed) return

  const valid = await isValidWord(trimmed)
  if (!valid) {
    alert("The word is not valid.")
    word.value = ''
    nextTick(() => {
      wordInput.value?.focus()
    })
    return
  }

  if (submittedWords.value.includes(trimmed)) {
    alert("You have already submitted this word!")
    word.value = ''
    nextTick(() => {
      wordInput.value?.focus()
    })
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

  // ✅ Refocus input after all that
  nextTick(() => {
    wordInput.value?.focus()
  })
}


const generateRandomLetter = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return alphabet[Math.floor(Math.random() * alphabet.length)]
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700&display=swap');

:deep(body) {
  background: linear-gradient(to bottom right, #3D6E7B, #46234D);
  margin: 0;
  font-family: 'Lexend', sans-serif;
  color: white;
}

.name-entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.04);
  padding: 30px 20px;
  border-radius: 16px;
  backdrop-filter: blur(8px);
  max-width: 360px;
  margin: 0 auto;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
}

.name-label {
  font-size: 1.2rem;
  color: #ffe4b3;
  margin-bottom: 6px;
}

.start-screen {
  text-align: center;
  padding: 60px 20px;
}

.name-input {
  padding: 12px 18px;
  font-size: 1.2rem;
  border: none;
  border-radius: 10px;
  outline: none;
  width: 260px;
  background-color: #2e2e2e;
  color: white;
  border: 2px solid #E0911F;
  margin-bottom: 20px;
}
.points.top-score {
  margin-top: 20px;
  margin-bottom: 10px;
  text-align: center;
}

.points.top-score h3 {
  font-size: 1.6rem;
  color: #E0911F;
  text-shadow: 0 0 6px #e0911f99;
}


.start-btn {
  padding: 16px 36px;
  font-size: 1.3rem;
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

/* Timer */
.timer {
  font-size: 1.5rem;
  text-align: center;
  padding: 10px;
  color: #ffe6b7;
  font-weight: 600;
}

/* Grid */
.grid-container {
  display: grid;
  grid-template-columns: repeat(5, 70px);
  grid-template-rows: repeat(5, 70px);
  gap: 10px;
  justify-content: center;
  margin: 20px auto;
}

.grid-cell {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(6px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: bold;
  color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: background-color 0.2s ease;
}

.grid-cell.highlighted {
  border: 2px solid #E0911F;
  background: rgba(255, 255, 255, 0.15);
}

.grid-cell.submitted {
  opacity: 0.4;
}

.input-container {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.word-input {
  padding: 12px 18px;
  font-size: 1.1rem;
  border-radius: 10px;
  background: #2e2e2e;
  color: white;
  border: 2px solid #444;
  outline: none;
  width: 220px;
}

.word-input.input-disabled {
  background-color: #444;
  cursor: not-allowed;
}

.submit-btn {
  padding: 12px 20px;
  font-size: 1.1rem;
  font-weight: bold;
  background-color: #E0911F;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.submit-btn:hover {
  background-color: #ffb238;
}

/* Words + Points */
.submitted-words {
  margin-top: 40px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  backdrop-filter: blur(6px);
  color: #eee;
  text-align: center;
}

.submitted-words ul {
  list-style: none;
  padding: 0;
}

.submitted-words li {
  font-size: 1.1rem;
  margin: 4px 0;
}

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
