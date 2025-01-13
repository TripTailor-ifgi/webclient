<script>
export default {
  name: 'NavbarHeader'
}
</script>

<template>
  <header class="header">
      <div class="brand">
        <a href="/">
          <!--<img class="logo" src="../assets/logo_pre_sketch.png"/>-->
          <img class="logo" src="@/assets/tripTailor_Logo.svg"/>
          <p>TripTailor</p>
        </a>
        
      </div>
      <nav>
        <ul>
          <li><a href="/map/">Map</a></li>
          <li><a href="/quiz/">Customizer</a></li>
          <li><a href="https://github.com/TipTailor" target="_blank">GitHub</a></li>
          <li><a href="#" class="disabled-a">Log In</a></li>
        </ul>
      </nav>
    </header>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: var(--tt-white-soft);
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--tt-dark);
}
.brand a{
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  color: var(--tt-dark);
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
.disabled-a {
  color: gray !important;
  cursor: default;
  pointer-events: none;
}
</style>
