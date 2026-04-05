<template>
  <div class="dashboard container">
    <header class="dash-header">
      <div>
        <h2>Welcome, {{ user?.name || 'Future Leader' }}!</h2>
        <p>Ready to make an impact today?</p>
      </div>
      <button @click="logout" class="btn-secondary">Logout</button>
    </header>

    <div v-if="pending" class="stats-grid">
      <div class="glass-card stat-card skeleton-card">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-number"></div>
      </div>
      <div class="glass-card stat-card skeleton-card">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-row"></div>
        <div class="skeleton skeleton-row"></div>
      </div>
    </div>

    <div v-else class="stats-grid">
      <div class="glass-card stat-card">
        <h3>Modules Completed</h3>
        <p class="stat-number">{{ user?.completedModules?.length || 0 }}</p>
      </div>
      <div class="glass-card stat-card">
        <h3>Badges Earned</h3>
        <div class="badges">
          <span v-for="badge in user?.badges" :key="badge" class="badge">🏆 {{ badge }}</span>
          <span v-if="!user?.badges?.length" class="text-muted">Start learning to earn badges!</span>
        </div>
      </div>
    </div>

    <div class="action-grid">
      <NuxtLink to="/learn" class="glass-card action-card learn-card">
        <h3>📚 Learning Center</h3>
        <p>Start or continue your political education modules.</p>
        <div class="go-icon">→</div>
      </NuxtLink>

      <NuxtLink to="/practice" class="glass-card action-card practice-card">
        <h3>🎤 Empowerment & Practice</h3>
        <p>Engage in simulations and practice decision making.</p>
        <div class="go-icon">→</div>
      </NuxtLink>

      <NuxtLink to="/opportunities" class="glass-card action-card opportunities-card">
        <h3>🌍 Take Action</h3>
        <p>Find real-world internships, volunteering, and projects.</p>
        <div class="go-icon">→</div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const user = ref(null);
const pending = ref(true);
const router = useRouter();
const config = useRuntimeConfig();

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/auth/login');
    return;
  }
  try {
    const data = await $fetch(`${config.public.apiBase}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    user.value = data;
  } catch(err) {
    localStorage.removeItem('token');
    router.push('/auth/login');
  } finally {
    pending.value = false;
  }
});

const logout = () => {
    localStorage.removeItem('token');
    router.push('/');
}
</script>

<style scoped>
.dashboard { padding-top: 2rem; padding-bottom: 3rem; }
.dash-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2.5rem; }
.stat-card { text-align: center; }
.stat-number { font-size: 3rem; font-weight: 800; color: var(--primary); margin: 0.5rem 0; }
.badges { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-top: 1rem; }
.badge { background: #FDF6E3; color: #B45309; padding: 0.5rem 1rem; border-radius: 9999px; font-weight: 600; font-size: 0.9rem;}
.action-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
.action-card { 
  display: block; text-decoration: none; color: inherit; 
  transition: transform 0.2s, box-shadow 0.2s; position: relative; overflow: hidden;
}
.action-card:hover { transform: translateY(-5px); box-shadow: 0 12px 24px rgba(0,0,0,0.1); }
.action-card h3 { color: var(--primary); margin-bottom: 0.5rem; }
.go-icon { position: absolute; bottom: 1.5rem; right: 1.5rem; font-size: 1.5rem; color: var(--primary); font-weight: 800; }
.learn-card { border-top: 4px solid var(--primary); }
.practice-card { border-top: 4px solid var(--secondary); }
.opportunities-card { border-top: 4px solid #10B981; }
.skeleton-card { display: flex; flex-direction: column; gap: 0.8rem; }
.skeleton {
  border-radius: 8px;
  background: linear-gradient(90deg, #eceff3 25%, #f6f8fa 37%, #eceff3 63%);
  background-size: 400% 100%;
  animation: shimmer 1.25s ease-in-out infinite;
}
.skeleton-title { width: 55%; height: 1rem; margin: 0 auto; }
.skeleton-number { width: 35%; height: 2.8rem; margin: 0 auto; }
.skeleton-row { width: 80%; height: 0.9rem; margin: 0 auto; }
@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
}
</style>
