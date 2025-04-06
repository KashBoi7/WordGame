<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/" class="nav-item" exact>Home</router-link>
      <router-link to="/info" class="nav-item">Info</router-link>
      <router-link to="/game" class="nav-item">Single Player</router-link>
      <router-link to="/multiplayer" class="nav-item">Multi-Player</router-link>
      <router-link to="/leaderboard" class="nav-item">Leaderboard</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
// no logic needed
document.title = 'Word Duel 🧠'
</script>

<!-- ✅ Global styles go here -->
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  background: linear-gradient(to bottom right, #3D6E7B, #46234D);
  margin: 0;
}

/* Global gradient background */
body, html, #app {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #3D6E7B, #46234D);
  background-attachment: fixed;
  font-family: 'Lexend', sans-serif;
  color: white;
}
</style>

<!-- ✅ Scoped styles ONLY for navbar -->
<style scoped>
.navbar {
  display: flex;
  justify-content: center;
  gap: 30px;
  background-color: #323948;
  padding: 15px 30px;
  border-bottom: 4px solid #3D6E7B;
  font-family: 'Segoe UI', sans-serif;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-item {
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 6px 10px;
  position: relative;
  transition: color 0.2s ease;
}

.nav-item::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 0%;
  height: 3px;
  background-color: #E0911F;
  transition: width 0.3s ease;
}

.nav-item:hover {
  color: #E0911F;
}

.nav-item:hover::after {
  width: 100%;
}

.router-link-exact-active {
  color: #E0911F;
}

.router-link-exact-active::after {
  width: 100%;
}
</style>
