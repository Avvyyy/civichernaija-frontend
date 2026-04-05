<template>
  <div class="landing-page">
    <nav class="navbar">
      <div class="logo">CivicHerNaija</div>
      <div class="links">
        <NuxtLink to="/auth/login" class="nav-link">Login</NuxtLink>
        <NuxtLink to="/auth/signup" class="btn-primary">Sign Up</NuxtLink>
      </div>
    </nav>
    <header class="hero">
      <h1>Your Voice Matters. Shape the Future.</h1>
      <p>Empowering young women in Nigeria to learn, practice, and engage in politics and governance.</p>
      <NuxtLink to="/auth/signup" class="btn-secondary hero-btn">Start Learning Now</NuxtLink>
    </header>
  </div>
</template>

<style scoped>
.landing-page {
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(107, 33, 168, 0.05) 0%, rgba(251, 191, 36, 0.1) 100%);
}
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  align-items: center;
}
.logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary);
}
.nav-link {
  margin-right: 1.5rem;
  text-decoration: none;
  font-weight: 600;
  color: var(--text-main);
  transition: color 0.2s;
}
.nav-link:hover { color: var(--primary); }
.hero {
  text-align: center;
  padding: 6rem 1rem;
  max-width: 800px;
  margin: 0 auto;
}
.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primary);
}
.hero p {
  font-size: 1.25rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
}
.hero-btn { font-size: 1.1rem; padding: 1rem 2rem; }
</style>
