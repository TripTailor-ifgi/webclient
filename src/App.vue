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

    <section class="hero"><!--Bild von <a href="https://pixabay.com/de/users/leonhard_niederwimmer-1131094/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8268841">Leonhard Niederwimmer</a> auf <a href="https://pixabay.com/de//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8268841">Pixabay</a>-->
      <div class="hero-text">
        <span class="headline">Trips tailored to blow your mind</span>
        <span class="headline-add">legally</span>
        <a href="/login/">Start Now</a>
      </div>
    </section>

    <!-- Main Content -->
    <main ref="mainsection">
      <!-- Preference Section -->
      <section class="preference">
        <div class="preference-text">
          <span class="headline">Select your Preference</span>
          <span class="headline-add">Let us do the Planning</span>
        </div>
        <a href="/about/">Learn More</a>
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
  background-color: var(--tt);
  color: var(--tt-dark);
  line-height: 1.6;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: var(--tt-white-soft);
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--tt-dark);
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
  color: var(--tt-dark);
  text-decoration: none;
  font-size: 1rem;
}

/* Hero Section */
.hero {
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
}

.hero-text, .preference-text{
  display:flex ;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.hero-text{
  width: 100%;
  background-image: url("./assets/hero_bg.jpg");
  background-position: center;
  background-size: 100% auto;
  height: 70vh;
}
.hero-text .headline, .hero-text .headline-add, .stats .headline {
  font-size: 3.5rem;
}

.hero-text .headline-add {
  font-style: italic;
  color: var(--tt);
  font-weight: bold;
  -webkit-text-stroke: 2px var(--tt-dark);
}
.hero .headline{
    color: var(--tt-dark);
    font-weight: bold;
}

.hero-text button, .hero-text a, .preference a {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: var(--tt);
  color: var(--tt-dark);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
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
  align-items: center;
  justify-content: spacce-evenly;
  height: 40vh;
}

.preference-text{
  background-color: var(--tt-white-soft);
  color: var(--tt-dark);
  width: 80%;
}
.preference-text .headline, .preference-text .headline-add {
  font-size: 3.5rem;
}
.preference-text  .headline {
  color: var(--tt);
}
.preference-text  .headline-add {
  font-style: italic;
  color: var(--tt-dark);
  font-weight: bold;
}

/* Statistics Section */
.stats {
  width: 100%;
  grid-column: 1/3;
  grid-row: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--tt-gray);
  color: var(--tt-dark);
  height: 40vh;
}

/* Footer */
footer {
  text-align: center;
  padding: 10px;
  background-color: var(--tt-dark);
  color: var(--tt-light);
}
</style>
