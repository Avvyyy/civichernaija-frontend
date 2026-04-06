<template>
  <div class="learn-page container">
    <div class="header">
      <h2>Learning Modules</h2>
      <p>Build your knowledge about governance, step by step.</p>
    </div>

    <div class="modules-grid">
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
          <span v-if="mod.status === 'completed'" class="state-icon">✓</span>
          <span v-else-if="mod.status === 'locked'" class="state-icon">🔒</span>
        </div>
        <h3>{{ mod.title }}</h3>
        <p class="desc">{{ mod.description }}</p>
        <span class="status-chip" :class="mod.status">{{ mod.statusLabel }}</span>
      </button>
    </div>

    <div v-if="pending" class="loading-state">Loading modules...</div>

    <div v-if="loadError" class="load-error">Could not fetch modules from server.</div>

    <div v-else-if="!pending && !modules.length" class="load-error">
      No modules available yet.
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
  color: #6f6183;
  font-size: 0.95rem;
}

.module-card h3 {
  color: #1f1430;
  margin-bottom: 0.35rem;
  font-size: 1.18rem;
  line-height: 1.35;
}

.desc {
  margin: 0 0 0.8rem;
  color: #655b78;
  line-height: 1.45;
  font-size: 0.95rem;
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

.loading-state,
.load-error {
  margin-top: 0.6rem;
  color: #6f6183;
  font-size: 0.9rem;
}

@media (min-width: 900px) {
  .modules-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>