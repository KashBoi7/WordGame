<template>
  <div class="login">
    <div class="login-card">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit" class="primary-button">Login</button>
      </form>

      <hr />

      <button @click="signInWithGoogle" class="google-button">Sign in with Google</button>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { signInWithEmailAndPassword, signInWithPopup, auth, googleProvider } from 'firebase/auth'

const email = ref('')
const password = ref('')
const error = ref(null)

const login = async () => {
  error.value = null
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    console.log('Logged in:', userCredential.user)
  } catch (err) {
    error.value = err.message
  }
}

const signInWithGoogle = async () => {
  error.value = null
  try {
    const result = await signInWithPopup(auth, googleProvider)
    console.log('Google login successful:', result.user)
  } catch (err) {
    error.value = err.message
  }
}
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;
  padding: 20px;
}

.login-card {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

input {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.primary-button {
  background-color: #007bff;
  color: #fff;
}

.primary-button:hover {
  background-color: #0056b3;
}

.google-button {
  background-color: #db4437;
  color: #fff;
}

.google-button:hover {
  background-color: #c23321;
}

hr {
  margin: 20px 0;
  border: none;
  border-top: 1px solid #eee;
}

.error {
  color: red;
  font-size: 0.9em;
  margin-top: 10px;
}
</style>
