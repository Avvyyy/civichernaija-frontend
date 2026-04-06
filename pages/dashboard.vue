<template>
  <div class="dashboard-page container">
    <section class="page-head">
      <div>
        <h1>Your Progress</h1>
        <p>Track your journey to becoming a civic leader.</p>
      </div>
    </section>

    <section v-if="pending" class="loading-wrap">
      <div class="skeleton skeleton-hero"></div>
      <div class="loading-grid">
        <div v-for="n in 4" :key="`stat-skeleton-${n}`" class="skeleton skeleton-card"></div>
      </div>
    </section>

    <template v-else>
      <section class="overall-card fade-up">
        <div class="overall-top">
          <h2>Overall Progress</h2>
          <span class="overall-value">{{ overallProgress }}%</span>
        </div>
        <div class="overall-progress-track">
          <div class="overall-progress-fill" :style="{ width: `${overallProgress}%` }"></div>
        </div>
        <p>Keep going. Complete more modules to unlock new features.</p>
      </section>

      <section class="stats-grid">
        <article
          v-for="(item, index) in statCards"
          :key="item.label"
          class="stat-card fade-up"
          :style="{ animationDelay: `${index * 80}ms` }"
        >
          <component :is="item.icon" :size="24" :class="['stat-icon', item.colorClass]" />
          <p class="stat-value">{{ item.value }}</p>
          <p class="stat-label">{{ item.label }}</p>
        </article>
      </section>

      <section class="panel fade-up" style="animation-delay: 120ms;">
        <h2>Quiz Scores</h2>

        <div v-if="quizEntries.length" class="quiz-grid">
          <article v-for="entry in quizEntries" :key="entry.lessonId" class="quiz-card">
            <div class="quiz-meta">
              <p class="quiz-title">{{ entry.lessonTitle }}</p>
              <p class="quiz-module">{{ entry.moduleTitle }}</p>
            </div>
            <span class="quiz-badge" :class="{ perfect: Number(entry.score) === 100 }">{{ entry.score }}%</span>
          </article>
        </div>

        <div v-else class="empty-state">No quiz scores yet. Start learning to see your performance here.</div>
      </section>

      <section class="panel fade-up" style="animation-delay: 180ms;">
        <h2>Badges &amp; Achievements</h2>

        <div v-if="badgesDisplay.length" class="badge-grid">
          <article
            v-for="(badge, index) in badgesDisplay"
            :key="badge.id"
            class="badge-card"
            :class="{ earned: badge.earned, locked: !badge.earned }"
            :style="{ animationDelay: `${index * 40}ms` }"
          >
            <span class="badge-icon">{{ badge.icon }}</span>
            <p class="badge-title">{{ badge.title }}</p>
            <p class="badge-desc">{{ badge.description }}</p>
            <span v-if="badge.earned" class="earned-chip">Earned ✓</span>
          </article>
        </div>

        <div v-else class="empty-state">No badges yet. Complete modules and exercises to earn your first badge.</div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Award, BookOpen, TrendingUp, Zap } from 'lucide-vue-next';

const router = useRouter();
const config = useRuntimeConfig();
const user = ref(null);
const modules = ref([]);
const pending = ref(true);

const completedModulesCount = computed(() => user.value?.completedModules?.length || 0);
const completedLessonsCount = computed(() => {
  const fromProfile = user.value?.completedLessons?.length || 0;
  if (fromProfile) return fromProfile;
  return Object.keys(user.value?.quizScores || {}).length;
});

const simulationsCompleted = computed(() => Number(user.value?.simulationsCompleted || 0));
const earnedBadgesCount = computed(() => {
  if (Array.isArray(user.value?.earnedBadges)) return user.value.earnedBadges.length;
  if (Array.isArray(user.value?.badges)) return user.value.badges.length;
  return 0;
});

const totalModulesCount = computed(() => modules.value.length || completedModulesCount.value || 0);
const totalBadgesCount = computed(() => {
  if (Array.isArray(user.value?.allBadges)) return user.value.allBadges.length;
  if (Array.isArray(user.value?.badgesCatalog)) return user.value.badgesCatalog.length;
  return earnedBadgesCount.value || 0;
});

const overallProgress = computed(() => {
  if (typeof user.value?.overallProgress === 'number') return Math.max(0, Math.min(100, Math.round(user.value.overallProgress)));
  const modulePart = totalModulesCount.value ? completedModulesCount.value / totalModulesCount.value : 0;
  const lessonPart = Math.min(1, completedLessonsCount.value / 10);
  const simPart = Math.min(1, simulationsCompleted.value / 5);
  return Math.round((modulePart * 0.5 + lessonPart * 0.3 + simPart * 0.2) * 100);
});

const statCards = computed(() => [
  {
    label: 'Modules Completed',
    value: `${completedModulesCount.value}/${totalModulesCount.value || completedModulesCount.value || 0}`,
    icon: BookOpen,
    colorClass: 'icon-primary'
  },
  {
    label: 'Lessons Done',
    value: String(completedLessonsCount.value),
    icon: TrendingUp,
    colorClass: 'icon-success'
  },
  {
    label: 'Simulations',
    value: String(simulationsCompleted.value),
    icon: Zap,
    colorClass: 'icon-gold'
  },
  {
    label: 'Badges Earned',
    value: `${earnedBadgesCount.value}/${totalBadgesCount.value || earnedBadgesCount.value || 0}`,
    icon: Award,
    colorClass: 'icon-primary'
  }
]);

const quizEntries = computed(() => {
  const scores = user.value?.quizScores || {};
  return Object.entries(scores).map(([lessonId, score]) => {
    let moduleTitle = 'Module';
    let lessonTitle = lessonId;

    for (const mod of modules.value) {
      const lessons = Array.isArray(mod.lessons) ? mod.lessons : [];
      const lesson = lessons.find((item) => item.id === lessonId || item._id === lessonId);
      if (lesson) {
        moduleTitle = mod.title || 'Module';
        lessonTitle = lesson.title || lessonId;
        break;
      }
    }

    return { lessonId, score, lessonTitle, moduleTitle };
  });
});

const badgesDisplay = computed(() => {
  const catalog = user.value?.badgesCatalog || user.value?.allBadges;
  const earnedRaw = user.value?.earnedBadges || user.value?.badges || [];

  if (Array.isArray(catalog) && catalog.length) {
    const earnedSet = new Set(earnedRaw.map((badge) => (typeof badge === 'string' ? badge : badge.id || badge.title)));
    return catalog.map((badge) => ({
      id: badge.id || badge.title,
      icon: badge.icon || '🏆',
      title: badge.title || 'Badge',
      description: badge.description || 'Complete more activities to unlock this badge.',
      earned: earnedSet.has(badge.id) || earnedSet.has(badge.title)
    }));
  }

  if (Array.isArray(earnedRaw) && earnedRaw.length) {
    return earnedRaw.map((badge, index) => ({
      id: typeof badge === 'string' ? badge : badge.id || `earned-${index}`,
      icon: typeof badge === 'string' ? '🏆' : badge.icon || '🏆',
      title: typeof badge === 'string' ? badge : badge.title || 'Earned Badge',
      description: typeof badge === 'string' ? 'Badge earned from your learning journey.' : badge.description || 'Badge earned from your learning journey.',
      earned: true
    }));
  }

  return [];
});

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/auth/login');
    return;
  }

  try {
    const [userRes, modulesRes] = await Promise.allSettled([
      $fetch(`${config.public.apiBase}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      $fetch(`${config.public.apiBase}/modules`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    if (userRes.status === 'fulfilled') {
      user.value = userRes.value;
    } else {
      localStorage.removeItem('token');
      router.push('/auth/login');
      return;
    }

    if (modulesRes.status === 'fulfilled' && Array.isArray(modulesRes.value)) {
      modules.value = modulesRes.value;
    }
  } catch (err) {
    localStorage.removeItem('token');
    router.push('/auth/login');
  } finally {
    pending.value = false;
  }
});


</script>

<style scoped>
.dashboard-page {
  padding: 1.6rem 1rem 2.8rem;
}

.page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.3rem;
}

.page-head h1 {
  color: #1d1232;
  font-size: clamp(1.55rem, 3vw, 2.25rem);
  margin-bottom: 0.25rem;
}

.page-head p {
  margin: 0;
  color: #625977;
}

.overall-card {
  border-radius: 18px;
  background: linear-gradient(128deg, #6b21a8, #8b2dd6);
  color: #fff;
  padding: 1.2rem;
  margin-bottom: 1rem;
}

.overall-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 0.55rem;
}

.overall-top h2 {
  margin: 0;
  color: #fff;
  font-size: 1.08rem;
}

.overall-value {
  font-size: 1.8rem;
  font-weight: 800;
}

.overall-progress-track {
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 999px;
  overflow: hidden;
}

.overall-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: #fef3c7;
  transition: width 0.8s ease;
}

.overall-card p {
  margin: 0.45rem 0 0;
  color: rgba(255, 255, 255, 0.84);
  font-size: 0.84rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.stat-card {
  background: #fff;
  border: 1px solid #ece5f6;
  border-radius: 14px;
  padding: 0.9rem;
  text-align: center;
}

.stat-icon {
  margin-bottom: 0.3rem;
}

.icon-primary {
  color: var(--primary);
}

.icon-success {
  color: #059669;
}

.icon-gold {
  color: #b45309;
}

.stat-value {
  margin: 0;
  color: #1f1430;
  font-weight: 800;
  font-size: 1.35rem;
}

.stat-label {
  margin: 0.18rem 0 0;
  color: #6f6483;
  font-size: 0.73rem;
}

.panel {
  background: #fff;
  border: 1px solid #ece5f6;
  border-radius: 14px;
  padding: 1rem;
  margin-bottom: 0.95rem;
}

.panel h2 {
  color: #1d1232;
  font-size: 1.05rem;
  margin-bottom: 0.75rem;
}

.quiz-grid {
  display: grid;
  gap: 0.55rem;
  grid-template-columns: 1fr;
}

.quiz-card {
  border: 1px solid #ece5f6;
  border-radius: 12px;
  padding: 0.72rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem;
}

.quiz-meta {
  min-width: 0;
}

.quiz-title {
  margin: 0;
  color: #1d1232;
  font-size: 0.88rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quiz-module {
  margin: 0.14rem 0 0;
  color: #716684;
  font-size: 0.75rem;
}

.quiz-badge {
  border-radius: 999px;
  padding: 0.2rem 0.62rem;
  background: #eee7f8;
  color: #4d3f63;
  font-weight: 700;
  font-size: 0.78rem;
}

.quiz-badge.perfect {
  background: var(--primary);
  color: #fff;
}

.badge-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
}

.badge-card {
  border-radius: 12px;
  border: 1px solid #ece5f6;
  background: #fff;
  padding: 0.75rem;
  text-align: center;
}

.badge-card.earned {
  border-color: rgba(107, 33, 168, 0.25);
  background: rgba(107, 33, 168, 0.08);
}

.badge-card.locked {
  opacity: 0.58;
}

.badge-icon {
  display: block;
  font-size: 1.4rem;
  margin-bottom: 0.32rem;
}

.badge-title {
  margin: 0;
  color: #1d1232;
  font-weight: 600;
  font-size: 0.84rem;
}

.badge-desc {
  margin: 0.2rem 0 0;
  color: #716684;
  font-size: 0.73rem;
  line-height: 1.35;
}

.earned-chip {
  display: inline-block;
  margin-top: 0.35rem;
  border-radius: 999px;
  background: var(--primary);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.18rem 0.5rem;
}

.empty-state {
  border: 1px dashed #ddd4ec;
  border-radius: 12px;
  color: #726884;
  font-size: 0.86rem;
  padding: 0.9rem;
  text-align: center;
}

.loading-wrap {
  display: grid;
  gap: 0.8rem;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem;
}

.skeleton {
  border-radius: 10px;
  background: linear-gradient(90deg, #eceff3 25%, #f6f8fa 37%, #eceff3 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
}

.skeleton-hero {
  height: 130px;
}

.skeleton-card {
  height: 90px;
}

.fade-up {
  animation: fadeUp 0.45s ease both;
}

@media (min-width: 820px) {
  .stats-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .quiz-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .badge-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0 0;
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>