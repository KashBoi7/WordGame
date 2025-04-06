<template>
  <div class="how-to-play">
    <header>
      <h1>🧠 How to Play <span>Word Duel</span></h1>
      <p>Think fast. Spell smart. Score big. Here’s everything you need to know to dominate the duel.</p>
    </header>

    <main>
      <div class="card">
        <h2>🎮 Single Player Mode</h2>
        <ul>
          <li>Start by entering your name.</li>
          <li>You’ll get a fresh 5×5 grid filled with random letters.</li>
          <li>You have <strong>60 seconds</strong> to build as many valid words as possible.</li>
          <li>Points are based on word length — longer words score more!</li>
          <li>Using more complex letters also increased your score</li>
          <li>When the timer ends, your final score is displayed.</li>
        </ul>
      </div>

      <div class="card">
        <h2>👥 Multiplayer Mode</h2>
        <ul>
          <li>Player 1 enters their name and plays the first round.</li>
          <li>The exact same board is passed to Player 2.</li>
          <li>Both players get 30 seconds each.</li>
          <li>Scores are revealed after both rounds.</li>
          <li><strong>Highest score wins the duel!</strong></li>
        </ul>
      </div>

      <div class="card tips">
        <h2>💡 Tips & Tricks</h2>
        <ul>
          <li>Each letter can only be used once per word.</li>
          <li>Words must be at least 3 letters long to score.</li>
          <li>Plan ahead — speed is key, but strategy wins games.</li>
          <li>Practice in solo mode to sharpen your reflexes before challenging friends.</li>
        </ul>
      </div>

      <div class="card">
        <h2>🔤 Letter Point Values</h2>
        <table class="points-table">
          <thead>
            <tr>
              <th>Letter</th><th>Points</th>
              <th>Letter</th><th>Points</th>
              <th>Letter</th><th>Points</th>
              <th>Letter</th><th>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>A</td><td>1</td><td>B</td><td>3</td><td>C</td><td>3</td><td>D</td><td>2</td></tr>
            <tr><td>E</td><td>1</td><td>F</td><td>4</td><td>G</td><td>2</td><td>H</td><td>4</td></tr>
            <tr><td>I</td><td>1</td><td>J</td><td>8</td><td>K</td><td>5</td><td>L</td><td>1</td></tr>
            <tr><td>M</td><td>3</td><td>N</td><td>1</td><td>O</td><td>1</td><td>P</td><td>3</td></tr>
            <tr><td>Q</td><td>10</td><td>R</td><td>1</td><td>S</td><td>1</td><td>T</td><td>1</td></tr>
            <tr><td>U</td><td>1</td><td>V</td><td>4</td><td>W</td><td>4</td><td>X</td><td>8</td></tr>
            <tr><td>Y</td><td>4</td><td>Z</td><td>10</td><td></td><td></td><td></td><td></td></tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'InfoPage'
}
</script>

<style scoped>
.how-to-play {
  font-family: 'Lexend', sans-serif;
  padding: 40px 20px;
  background: linear-gradient(to bottom right, #3D6E7B, #46234D);
  color: white;
  min-height: 100vh;
}

header {
  text-align: center;
  margin-bottom: 40px;
}

header h1 {
  font-size: 2.7rem;
  margin-bottom: 10px;
  color: #E0911F;
}

header h1 span {
  color: #fff;
}

header p {
  font-size: 1.2rem;
  color: #ddd;
}

main {
  display: grid;
  gap: 30px;
  max-width: 800px;
  margin: 0 auto;
}

.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 25px 30px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  overflow-x: auto;
}

.card:hover {
  transform: translateY(-5px);
}

.card h2 {
  font-size: 1.6rem;
  color: #E0911F;
  margin-bottom: 15px;
}

.card ul {
  list-style: none;
  padding-left: 0;
}

.card ul li {
  position: relative;
  padding-left: 28px;
  margin-bottom: 12px;
  font-size: 1rem;
  color: #e0e0e0;
}

.card ul li::before {
  content: '✔️';
  position: absolute;
  left: 0;
  top: 2px;
  font-size: 1rem;
}

.tips ul li::before {
  content: '💡';
}

.points-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
  color: #e0e0e0;
  margin-top: 10px;
}

.points-table th,
.points-table td {
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px;
  text-align: center;
}

.points-table th {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}
</style>
