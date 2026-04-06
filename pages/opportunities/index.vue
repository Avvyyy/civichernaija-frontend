<template>
  <div class="opportunities-page container">
    <div class="header">
      <NuxtLink to="/dashboard" class="back-link">← Back to Dashboard</NuxtLink>
      <h2>Real-World Opportunities</h2>
      <p>Apply your knowledge locally through these curated internships, volunteering, and projects.</p>
    </div>

    <div v-if="pending" class="opps-grid">
      <div class="glass-card opp-card" v-for="n in 3" :key="`opp-skeleton-${n}`">
        <div class="skeleton skeleton-chip"></div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line short"></div>
        <div class="skeleton skeleton-btn mt-4"></div>
      </div>
    </div>

    <div v-else-if="!opportunities.length" class="glass-card empty-state">
      <h3>No opportunities right now</h3>
      <p>Check back soon for internships, volunteer roles, and civic projects.</p>
    </div>

    <div v-else class="opps-grid">
      <div class="glass-card opp-card" v-for="opp in opportunities" :key="opp._id">
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <h3>{{ opp.title }}</h3>
          <div class="badge-type w-max text-xs">{{ opp.type }}</div>
        </div>
        <p class="location">📍 {{ opp.location }}</p>
        <p class="desc">{{ opp.description }}</p>
        <a :href="opp.applyLink" target="_blank" class="btn-primary mt-4 inline-block">Apply Now</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const opportunities = ref([]);
const pending = ref(true);
const config = useRuntimeConfig();

onMounted(async () => {
  try {
    const data = await $fetch(`${config.public.apiBase}/opportunities`);
    opportunities.value = data;
  } catch (err) {
    console.error(err);
  } finally {
    pending.value = false;
  }
});
</script>

<style scoped>
.opportunities-page {
  padding: 2rem 1rem;
}

.header {
  margin-bottom: 2rem;
}

.header p {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.back-link {
  color: var(--text-muted);
  text-decoration: none;
  display: inline-block;
  margin-bottom: 1rem;
}

.back-link:hover {
  color: var(--primary);
}

.opps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.opp-card {
  display: flex;
  flex-direction: column;
  position: relative;
}

.badge-type {
  background: var(--secondary);
  color: #000;
  font-weight: 700;
  padding: 0.25rem 0.3rem;
  border-radius: 999px;
}

.location {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.desc {
  flex-grow: 1;
  color: var(--text-main);
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.mt-4 {
  margin-top: auto;
}

.inline-block {
  display: inline-block;
  text-align: center;
  text-decoration: none;
}

.empty-state {
  text-align: center;
  max-width: 680px;
  margin: 1rem auto 0;
}

.empty-state p {
  color: var(--text-muted);
  margin-top: 0.5rem;
}

.skeleton {
  border-radius: 8px;
  background: linear-gradient(90deg, #eceff3 25%, #f6f8fa 37%, #eceff3 63%);
  background-size: 400% 100%;
  animation: shimmer 1.25s ease-in-out infinite;
}

.skeleton-chip {
  width: 90px;
  height: 24px;
  margin-left: auto;
  margin-bottom: 1rem;
  border-radius: 999px;
}

.skeleton-title {
  width: 65%;
  height: 1.2rem;
  margin-bottom: 0.75rem;
}

.skeleton-line {
  width: 100%;
  height: 0.9rem;
  margin-bottom: 0.6rem;
}

.skeleton-line.short {
  width: 72%;
}

.skeleton-btn {
  width: 48%;
  height: 2.5rem;
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }

  100% {
    background-position: 0 0;
  }
}
</style>
