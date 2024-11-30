<script setup>

</script>

<template>
  <div class="tourist-routes">
    <header class="header">
      <div class="brand">
        <img class="logo" src="./assets/logo_pre_sketch.png"/>
        <p>TripTailor</p>
      </div>
      <nav>
        <ul>
          <li><a href="#">About</a></li>
          <li><a href="/quiz/">Customizer</a></li>
          <li><a href="https://github.com/TipTailor" target="_blank">GitHub</a></li>
          <li><a href="#">Log In</a></li>
        </ul>
      </nav>
    </header>
    <!-- Full Frame Landing Page section -->
    <section class="hero">
      <div class="hero-text">
        <span class="headline">Trips tailored to blow your mind</span>
        <span class="headline-add">legally</span>
        <button @click="test">Learn More</button>
      </div>
      <img class="hero-image" src="./assets/Route_Sketch.png"/>
    </section>

    <!-- Main Content -->
    <main ref="mainsection">
      <!-- Preference Section -->
      <section class="preference">
        <div class="image">
          <a href="/login/">Start Now</a>
        </div>
        <div class="preference-text">
          <span class="headline">Select your Preference</span>
          <span class="headline-add">Let us do the Planning</span>
        </div>
      </section>

      <!-- Statistics Section -->
      <section class="stats">
        <span class="headline">Statistics / Dashboard coming soon</span>
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
  color: var(--tt-dark-green);
  line-height: 1.6;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: var(--tt-dark-green);
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--tt-light-green);
}
.brand{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo{
  height: 3rem;
  padding-right: 20px;
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
  display: grid;
  grid-template-columns: 2fr 1fr;
  justify-items: center;
}

.hero-text, .preference-text{
  width: 100%;
  display:flex ;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
}
.hero-text{
  background-color: var(--tt-light-green);
  box-shadow: 10px 0 6px -6px var(--tt-light-green);
}
.hero-text .headline, .hero-text .headline-add, .stats .headline {
  font-size: 3.5rem;
}

.hero-text .headline-add {
  font-style: italic;
  color: var(--tt-green);
  font-weight: bold;
}

.hero-text button, .preference a {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: var(--tt-dark-green);
  color: var(--tt-light-green);
  border: none;
  border-radius: 5px;
  cursor: pointer;
}


.hero-image{
  width: 100%;
  height: 100%;
  max-height: 50vh;
  object-fit: cover;
  z-index: -1;
}

/* Main Content */
main {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 1fr;
  justify-items: center;
}

.preference{
  width: 100%;
  grid-column: 1/3;
  grid-row: 1;
  display: flex;
  justify-content: space-between;
}

.preference a{
  text-decoration: none;
  
}

.preference-text{
  background-color: var(--tt-dark-green);
  color: var(--tt-light-green);
  box-shadow: -10px 0 6px -6px var(--tt-dark-green);
}
.preference-text .headline, .preference-text .headline-add {
  font-size: 3.5rem;
}
.preference-text  .headline {
  color: var(--tt-green);
}
.preference-text  .headline-add {
  font-style: italic;
  color: var(--tt-light-green);
  font-weight: bold;
}

.preference .image{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  background-image: url("./assets/Route_Sketch.png");
  text-align: center;
  z-index: -1;
}

/* Statistics Section */
.stats {
  width: 100%;
  grid-column: 1/3;
  grid-row: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--tt-light-green);
  color: var(--tt-dark-green);
}

/* Footer */
footer {
  text-align: center;
  padding: 10px;
  background-color: var(--tt-dark-green);
  color: var(--tt-light-green);
}
</style>
