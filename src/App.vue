<script setup>
import NavbarHeader  from "./components/Navbar.vue"
import FooterComponent  from "./components/Footer.vue"
</script>

<template>
  <div class="tourist-routes">
    
    <NavbarHeader/>

    <section class="hero"><!--Bild von <a href="https://pixabay.com/de/users/karinkarin-145974/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1662569">KarinKarin</a> auf <a href="https://pixabay.com/de//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1662569">Pixabay</a> -->
      <div class="hero-text">
        <span class="headline">Trips tailored to blow your mind</span>
        <span class="headline-add">legally</span>
        <a href="/quiz/">Start Now</a>
      </div>
    </section>

    <!-- Main Content -->
    <main ref="mainsection">
      <!-- Preference Section -->
      <section class="preference">
        <div class="preference-text">
          <span class="headline">You already feel lost in a city even before you arrived?</span>
          <span class="headline-add">We only provide you information you really need.<br/>Customized Trips, tailored for you!</span>
          <a href="/about/">Learn More</a>
        </div>
      </section>

      <!-- Statistics Section -->
      <section class="stats">
        <span class="headline">Statistics / Dashboard coming soon</span>
      </section>
    </main>

    <!-- Footer -->
    <FooterComponent/>
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
  color: var(--tt-dark);
  line-height: 1.6;
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
  background-position: bottom;
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
  width: 100%;
  text-align: center;
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
  justify-content: center;
  height: 40vh;
}

.preference-text{
  background-color: var(--tt-white-soft);
  color: var(--tt-dark);
}
.preference-text .headline, .preference-text .headline-add {
  font-size: 3.5rem;
  text-align: center;
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

/* Bild von <a href="https://pixabay.com/de/users/bernhard_schuermann-20992548/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7269726">Bernhard Schürmann</a> auf <a href="https://pixabay.com/de//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7269726">Pixabay</a>*/
</style>
