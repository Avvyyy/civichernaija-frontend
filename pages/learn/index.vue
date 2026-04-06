<template>
  <div class="learn-page container">
    <div class="header">
      <h2>Learning Modules</h2>
      <p>Build your knowledge about governance, step by step.</p>
    </div>

    <div v-if="pending" class="modules-grid">
      <div v-for="n in 4" :key="`module-skeleton-${n}`" class="module-card skeleton-card" aria-hidden="true">
        <div class="module-top-row">
          <div class="skeleton skeleton-icon"></div>
          <div class="skeleton skeleton-small"></div>
        </div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line short"></div>
        <div class="skeleton skeleton-chip"></div>
      </div>
    </div>

    <div v-else-if="loadError" class="state-card error-state">
      <h3>Unable to load modules</h3>
      <p>We could not fetch modules from the backend. Please try again shortly.</p>
    </div>

    <div v-else-if="!modules.length" class="state-card empty-state">
      <h3>No modules yet</h3>
      <p>Learning modules will appear here as soon as they are published.</p>
    </div>

    <div v-else class="modules-grid">
      <button
        v-for="mod in modules"
        :key="mod._id"
        class="module-card"
        :class="{
          completed: mod.status === 'completed',
          locked: mod.status === 'locked'
        }"
        :disabled="mod.status === 'locked'"
        @click="openModule(mod)"
      >
        <div class="module-top-row">
          <span class="module-icon">{{ mod.icon }}</span>
          <!-- <span v-if="mod.status === 'completed'" class="state-icon">✓</span>
          <span v-else-if="mod.status === 'locked'" class="state-icon">🔒</span> -->
        </div>
        <h3 class="text-md font-semibold">{{ mod.title }}</h3>
        <p class="desc text-md">{{ mod.description }}</p>
        <span class="status-chip" :class="mod.status">{{ mod.statusLabel }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const { error: showError } = useToast();
const config = useRuntimeConfig();
const pending = ref(true);
const loadError = ref(false);
const modules = ref([]);

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const data = await $fetch(`${config.public.apiBase}/modules`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (Array.isArray(data) && data.length) {
      modules.value = data.map((mod, index) => {
        const done = !!mod.isCompleted;
        const locked = !!mod.isLocked;
        const status = done ? 'completed' : (locked ? 'locked' : 'available');
        const lessonCount = mod.lessonsCount || 1;
        return {
          ...mod,
          status,
          statusLabel: done ? 'Completed' : (locked ? 'Locked' : `${lessonCount} lesson${lessonCount > 1 ? 's' : ''}`),
          icon: ['🏛️', '🗳️', '🎤', '📜'][index % 4]
        };
      });
    }
  } catch (err) {
    loadError.value = true;
    showError('Unable to load modules from backend.');
  } finally {
    pending.value = false;
  }
});

const openModule = (mod) => {
  if (mod.status === 'locked') {
    showError('This module is locked. Complete earlier modules to unlock it.');
    return;
  }
  navigateTo(`/learn/${mod._id}`);
};
</script>

<style scoped>
.learn-page {
  padding: 1.4rem 1rem 2rem;
}

.header {
  margin-bottom: 1rem;
}

.header h2 {
  color: #221337;
  font-size: clamp(1.35rem, 2.3vw, 1.85rem);
  margin-bottom: 0.3rem;
}

.header p {
  color: var(--text-muted);
  margin: 0;
  font-size: 0.95rem;
}

.modules-grid {
  display: grid;
  gap: 0.85rem;
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.module-card {
  text-align: left;
  border: 1px solid #e6dff0;
  border-radius: 14px;
  background: #fff;
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.skeleton-card {
  cursor: default;
}

.skeleton {
  border-radius: 8px;
  background: linear-gradient(90deg, #eceff3 25%, #f6f8fa 37%, #eceff3 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
}

.skeleton-icon {
  width: 20px;
  height: 20px;
}

.skeleton-small {
  width: 14px;
  height: 14px;
}

.skeleton-title {
  width: 68%;
  height: 15px;
  margin-bottom: 0.55rem;
}

.skeleton-line {
  width: 100%;
  height: 12px;
  margin-bottom: 0.45rem;
}

.skeleton-line.short {
  width: 72%;
}

.skeleton-chip {
  margin-top: 0.45rem;
  width: 82px;
  height: 24px;
  border-radius: 999px;
}

.module-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.module-card.completed {
  border-color: #86d7b5;
  box-shadow: 0 0 0 2px rgba(82, 187, 138, 0.12) inset;
}

.module-card.locked {
  cursor: not-allowed;
  opacity: 0.9;
}

.module-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.55rem;
}

.module-icon {
  font-size: 1.35rem;
}

.state-icon {
  color: #655b72;
  font-size: 0.95rem;
}

.module-card h3 {
  color: #1f1430;
  margin-bottom: 0.35rem;
  line-height: 1.35;
}

.desc {
  margin: 0 0 0.8rem;
  color: #9f9aa9;
  line-height: 1.45;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.2rem 0.65rem;
  font-size: 0.8rem;
  font-weight: 700;
}

.status-chip.completed,
.status-chip.available {
  background: #6b21a8;
  color: #fff;
}

.status-chip.locked {
  background: #ece9f3;
  color: #6c5e81;
}

.state-card {
  margin-top: 0.6rem;
  border: 1px solid #e6dff0;
  border-radius: 14px;
  background: #fff;
  padding: 1.1rem;
}

.state-card h3 {
  margin: 0 0 0.25rem;
  color: #1f1430;
  font-size: 1rem;
}

.state-card p {
  margin: 0;
  color: #6f6183;
  font-size: 0.9rem;
}

.error-state {
  border-color: #f3d7db;
  background: #fff8f8;
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0 0;
  }
}

@media (min-width: 900px) {
  .modules-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>