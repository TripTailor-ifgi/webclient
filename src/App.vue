<script setup>

</script>

<template>
  <div class="tourist-routes">
    <!-- Header -->
    <header class="header">
      <div class="logo">ICON</div>
      <nav>
        <ul>
          <li><a href="/map/">About</a></li>
          <li><a href="/quiz/">Services</a></li>
          <li><a href="https://github.com/TipTailor" target="_blank">GitHub</a></li>
          <li><a href="/login/">Log In</a></li>
        </ul>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-text">
        <h1>Tourist Routes - <br> <span>Made for You</span></h1>
        <button @click="learnMore">Learn More</button>
      </div>
      <div class="hero-image">
        <p>IMAGE</p>
      </div>
    </section>

    <!-- Main Content -->
    <main>
      <!-- Preference Section -->
      <section class="preference">
        <div class="text">
          <h2>Tell us your preference</h2>
          <p>Let us do the work</p>
        </div>
        <div class="image">
          <p>IMAGE</p>
          <button @click="startNow">Start Now</button>
        </div>
      </section>

      <!-- Content Section -->
      <section class="content">
        <div class="image">IMAGE</div>
        <div class="something">Something</div>
      </section>

      <!-- Statistics Section -->
      <section class="stats">
        <p>Statistics / Dashboard</p>
      </section>
    </main>

    <!-- Footer -->
    <footer>
      <p>Footer Content</p>
    </footer>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

.tourist-routes {
  background-color: var(--tt-green);
  color: var(--tt-light-green);
  line-height: 1.6;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: var(--tt-dark-green);
}

.header .logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--tt-light-green);
}

.header nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
}

.header nav a {
  color: var(--tt-light-green);
  text-decoration: none;
  font-size: 1rem;
}

/* Hero Section */
.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50px;
  color: var(--tt-light-green);
}

.hero-text h1 {
  font-size: 2.5rem;
}

.hero-text span {
  font-style: italic;
}

.hero-text button, .preference button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: var(--tt-light-green);
  color: var(--tt-dark-green);
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.hero-image {
  width: 50%;
  text-align: center;
  background: var(--tt-green);
  padding: 50px;
}

/* Main Content */
main {
  padding: 20px;
}

.preference,
.content {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin: 20px 0;
}

.preference .text,
.preference .image,
.content .image,
.content .something {
  width: 48%;
  background: var(--tt-green);
  padding: 20px;
  text-align: center;
}

/* Statistics Section */
.stats {
  text-align: center;
  padding: 20px;
  background: var(--tt-dark-green);
  color: var(--tt-light-green);
}

/* Footer */
footer {
  text-align: center;
  padding: 10px;
  background-color: var(--tt-dark-green);
  color: var(--tt-light-green);
}
</style>
