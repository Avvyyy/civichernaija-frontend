<template>
  <header class="app-nav-wrap">
    <nav class="app-nav container">
      <NuxtLink to="/dashboard" class="brand">CivicHerNaija</NuxtLink>
      <div class="nav-links">
        <NuxtLink to="/learn" class="nav-link" :class="{ active: route.path.startsWith('/learn') }">Learn</NuxtLink>
        <NuxtLink to="/practice" class="nav-link" :class="{ active: route.path.startsWith('/practice') }">Practice</NuxtLink>
        <NuxtLink to="/opportunities" class="nav-link" :class="{ active: route.path.startsWith('/opportunities') }">Opportunities</NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup>
const route = useRoute();
</script>

<style scoped>
.app-nav-wrap {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(250, 250, 250, 0.88);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.app-nav {
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.brand {
  text-decoration: none;
  color: var(--primary);
  font-weight: 800;
  letter-spacing: 0.2px;
  font-size: 1.15rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text-main);
  font-weight: 600;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.nav-link:hover {
  background: rgba(107, 33, 168, 0.08);
  color: var(--primary);
}

.nav-link.active {
  background: var(--primary);
  color: #fff;
}

@media (max-width: 640px) {
  .app-nav {
    min-height: 60px;
  }

  .brand {
    font-size: 1rem;
  }

  .nav-link {
    font-size: 0.9rem;
    padding: 0.45rem 0.7rem;
  }
}
</style>