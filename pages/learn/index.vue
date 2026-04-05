<template>
  <div class="learn-page container">
    <div class="header">
        <NuxtLink to="/dashboard" class="back-link">← Back to Dashboard</NuxtLink>
        <h2>Learning Center</h2>
    </div>

    <div v-if="pending" class="modules-grid">
      <div class="glass-card module-card" v-for="n in 3" :key="`skeleton-${n}`">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line short"></div>
        <div class="skeleton skeleton-btn mt-4"></div>
      </div>
    </div>

    <div v-else-if="!modules.length" class="glass-card empty-state">
      <h3>No modules yet</h3>
      <p>Learning content will appear here once modules are published.</p>
    </div>
    
    <div v-else class="modules-grid">
      <div class="glass-card module-card" v-for="mod in modules" :key="mod._id">
        <h3>{{ mod.title }}</h3>
        <p class="desc">{{ mod.description }}</p>
        <NuxtLink :to="`/learn/${mod._id}`" class="btn-primary mt-4 inline-block">Start Module</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const modules = ref([]);
const pending = ref(true);
const config = useRuntimeConfig();

onMounted(async () => {
    try {
    const data = await $fetch(`${config.public.apiBase}/modules`);
        modules.value = data;
    } catch(err) {
        console.error(err);
    } finally {
        pending.value = false;
    }
});
</script>

<style scoped>
.learn-page { padding: 2rem 1rem; }
.header { margin-bottom: 2rem; }
.back-link { color: var(--text-muted); text-decoration: none; display: inline-block; margin-bottom: 1rem; }
.back-link:hover { color: var(--primary); }
.modules-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
.module-card { display: flex; flex-direction: column; }
.desc { flex-grow: 1; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.5rem; }
.mt-4 { margin-top: auto; }
.inline-block { display: inline-block; text-align: center; text-decoration: none; }
.empty-state { text-align: center; max-width: 640px; margin: 1rem auto 0; }
.empty-state p { color: var(--text-muted); margin-top: 0.5rem; }
.skeleton {
  border-radius: 8px;
  background: linear-gradient(90deg, #eceff3 25%, #f6f8fa 37%, #eceff3 63%);
  background-size: 400% 100%;
  animation: shimmer 1.25s ease-in-out infinite;
}
.skeleton-title { width: 60%; height: 1.1rem; margin-bottom: 1rem; }
.skeleton-line { width: 100%; height: 0.9rem; margin-bottom: 0.6rem; }
.skeleton-line.short { width: 70%; }
.skeleton-btn { width: 45%; height: 2.5rem; }
@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
}
</style>
