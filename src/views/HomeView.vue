
<script>
// @ is an alias to /src
export default {
  name: 'HomeView',
  components: {

  }
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <h1>🧠 Word Duel</h1>
      <p>The ultimate word showdown — solo or with a friend.</p>
      <router-link to="/info">
        <button class="start-btn">How to Play</button>
      </router-link>
    </section>

    <section class="modes">
      <div class="mode-card solo">
        <h2>🎮 Solo Mode</h2>
        <p>Enter your name and race the clock to form words on a 5x5 grid.</p>
        <router-link to="/game"><button>Play Solo</button></router-link>
      </div>

      <div class="mode-card multi">
        <h2>👥 Multiplayer</h2>
        <p>Two players go head to head in fierce consecutive matches.</p>
        <router-link to="/multiplayer"><button>Play Duel</button></router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
// No logic needed here
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700&display=swap');

.home {
  font-family: 'Lexend', sans-serif;
  background: linear-gradient(to bottom right, #3D6E7B, #46234D);
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding: 0;
}

.hero {
  text-align: center;
  margin-top: 80px;
  padding: 0 20px;
}

.hero h1 {
  font-size: 3.5rem;
  margin-bottom: 20px;
  background: linear-gradient(to right, #E0911F, #fff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 30px;
  color: #d9d9d9;
}

.start-btn {
  background-color: #E0911F;
  color: white;
  padding: 14px 30px;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  box-shadow: 0 0 20px #e0911f88;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.start-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px #e0911fcc;
}

.modes {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-top: 60px;
  padding: 0 20px;
}

.mode-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 30px;
  width: 300px;
  text-align: center;
  box-shadow: 0 0 20px rgba(0,0,0,0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.mode-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.15);
}

.mode-card h2 {
  color: #E0911F;
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.mode-card p {
  font-size: 1rem;
  color: #e0e0e0;
  margin-bottom: 20px;
}

.mode-card button {
  background-color: #323948;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.mode-card button:hover {
  background-color: #3d6e7b;
}
</style>
