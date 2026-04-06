<template>
  <div class="landing-page">
    <header class="top-header">
      <div class="container top-header-inner">
        <NuxtLink to="/" class="brand">
          <span class="brand-civic">Civic</span><span class="brand-her">Her</span><span class="brand-naija">Naija</span>
        </NuxtLink>

        <div class="top-actions">
          <NuxtLink to="/auth/login" class="ghost-btn">Sign In</NuxtLink>
          <NuxtLink to="/auth/signup" class="btn-primary cta-small">Get Started</NuxtLink>
        </div>
      </div>
    </header>

    <section class="hero-section">
      <div class="hero-glow"></div>
      <div class="container hero-grid">
        <div class="hero-copy fade-slide-left">
          <div class="hero-chip">
            <Star :size="16" />
            Empowering the next generation
          </div>

          <h1>
            Your voice matters in <span class="brand-civic">Nigeria's</span>
            <span class="brand-her">future</span>
          </h1>

          <p>
            Learn about governance, practice leadership skills, and discover real opportunities to make
            a difference in your community.
          </p>

          <div class="hero-buttons">
            <NuxtLink to="/learn" class="btn-primary cta-main">
              Start Learning
              <ArrowRight :size="16" />
            </NuxtLink>
            <NuxtLink to="/auth/signup" class="outline-btn">Create Account</NuxtLink>
          </div>
        </div>

        <div class="hero-visual fade-scale-in">
          <div class="hero-image-wrap">
            <img src="~/assets/images/hero-image.jpg" alt="Young Nigerian woman leader at podium" class="hero-image" />
            <div class="image-overlay"></div>
          </div>
          <div class="mini-stat">
            <p class="mini-value">35%</p>
            <p class="mini-label">of learners now volunteer</p>
          </div>
        </div>
      </div>
    </section>

    <section class="feature-section">
      <div class="container">
        <div class="feature-head fade-up">
          <h2>Learn. Practice. <span class="brand-her">Lead.</span></h2>
          <p>
            From understanding how government works to drafting your own policies, we guide you every
            step of the way.
          </p>
        </div>

        <div class="feature-grid">
          <article v-for="item in features" :key="item.title" class="feature-card fade-up">
            <div class="feature-icon" :class="item.colorClass">
              <component :is="item.icon" :size="24" />
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="stats-section">
      <div class="container stats-grid">
        <article v-for="item in stats" :key="item.label" class="stat-card fade-up">
          <component :is="item.icon" :size="30" class="stat-icon" />
          <p class="stat-value">{{ item.value }}</p>
          <p class="stat-label">{{ item.label }}</p>
        </article>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-box">
          <h2>Ready to become a future leader?</h2>
          <p>
            Join thousands of young Nigerian women learning about governance and making a real impact.
          </p>
          <NuxtLink to="/auth/signup" class="btn-secondary cta-join">
            Join CivicHerNaija
            <ArrowRight :size="16" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <footer class="landing-footer">
      <div class="container">
        <p class="footer-brand">
          <span class="brand-civic">Civic</span><span class="brand-her">Her</span><span class="brand-naija"> Naija</span>
        </p>
        <p class="footer-text">Empowering young Nigerian women to lead. NG</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import {
  ArrowRight,
  Award,
  BookOpen,
  Star,
  Target,
  Users,
  Zap
} from 'lucide-vue-next';

const features = [
  {
    icon: BookOpen,
    title: 'Learn',
    description: 'Structured courses on Nigerian government, elections, leadership and policy making.',
    colorClass: 'icon-purple'
  },
  {
    icon: Zap,
    title: 'Practice',
    description: 'Interactive simulations, mock debates, and policy drafting exercises.',
    colorClass: 'icon-gold'
  },
  {
    icon: Target,
    title: 'Engage',
    description: 'Discover real internships, volunteer roles, and community projects.',
    colorClass: 'icon-purple'
  }
];

const stats = [
  { icon: Users, value: '10K+', label: 'Young women learning' },
  { icon: Star, value: '50+', label: 'Lessons available' },
  { icon: Award, value: '200+', label: 'Badges earned' }
];
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  /* background:
    radial-gradient(circle at 15% 15%, rgba(251, 191, 36, 0.24), transparent 34%),
    radial-gradient(circle at 80% 3%, rgba(147, 51, 234, 0.18), transparent 35%),
    #fafafa; */
}

.top-header {
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(10px);
}

.top-header-inner {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  text-decoration: none;
  font-weight: 800;
  font-size: 1.2rem;
}

.brand-civic {
  color: var(--primary);
}

.brand-her {
  color: #f59e0b;
}

.brand-naija {
  color: #172033;
}

.top-actions {
  display: flex;
  gap: 0.6rem;
  align-items: center;
}

.ghost-btn {
  text-decoration: none;
  color: #1d273b;
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 0.45rem 0.8rem;
  font-weight: 600;
}

.ghost-btn:hover {
  border-color: #e5dff1;
  background: #f7f4fc;
}

.cta-small {
  text-decoration: none;
  padding: 0.45rem 0.95rem;
  font-size: 0.92rem;
}

.hero-section {
  position: relative;
  overflow: hidden;
}

.hero-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(107, 33, 168, 0.07), rgba(251, 191, 36, 0.08));
}

.hero-grid {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;
  padding-top: 2.8rem;
  padding-bottom: 2.8rem;
}

.hero-copy h1 {
  color: #121c30;
  font-size: clamp(2rem, 4.8vw, 3.65rem);
  line-height: 1.08;
  margin-bottom: 1rem;
}

.hero-copy p {
  font-size: 1.04rem;
  color: #536079;
  max-width: 590px;
  margin-bottom: 1.4rem;
}

.hero-chip {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 999px;
  background: rgba(107, 33, 168, 0.09);
  color: var(--primary);
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.3rem 0.8rem;
  margin-bottom: 1rem;
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.cta-main {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.68rem 1rem;
}

.outline-btn {
  text-decoration: none;
  color: #202940;
  border: 1px solid #d8d2e7;
  background: #fff;
  border-radius: 10px;
  padding: 0.63rem 1rem;
  font-weight: 600;
}

.outline-btn:hover {
  background: #f6f3fa;
}

.hero-visual {
  position: relative;
}

.hero-image-wrap {
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(24, 32, 52, 0.15);
  border: 1px solid #efe9f8;
}

.hero-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  display: block;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(107, 33, 168, 0.18), transparent 55%);
  pointer-events: none;
}

.mini-stat {
  position: absolute;
  left: -10px;
  bottom: -14px;
  background: #fff;
  border: 1px solid #ece5f6;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(17, 24, 39, 0.12);
  padding: 0.7rem 0.9rem;
}

.mini-value {
  margin: 0;
  color: var(--primary);
  font-size: 1.4rem;
  font-weight: 800;
}

.mini-label {
  margin: 0;
  color: #5f5574;
  font-size: 0.82rem;
}

.feature-section {
  background: rgba(251, 191, 36, 0.13);
  padding: 3.1rem 0;
}

.feature-head {
  text-align: center;
  margin-bottom: 2rem;
}

.feature-head h2 {
  color: #1c1230;
  font-size: clamp(1.5rem, 3vw, 2.35rem);
  margin-bottom: 0.55rem;
}

.feature-head p {
  margin: 0 auto;
  max-width: 680px;
  color: #5f5574;
}

.feature-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.feature-card {
  background: #fff;
  border: 1px solid #ece5f6;
  border-radius: 16px;
  padding: 1.2rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(30, 41, 59, 0.1);
}

.feature-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.65rem;
}

.icon-purple {
  background: rgba(107, 33, 168, 0.13);
  color: var(--primary);
}

.icon-gold {
  background: rgba(251, 191, 36, 0.22);
  color: #7a4f06;
}

.feature-card h3 {
  color: #1c1230;
  margin-bottom: 0.4rem;
}

.feature-card p {
  margin: 0;
  color: #5f5574;
  line-height: 1.5;
}

.stats-section {
  padding: 2.8rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
}

.stat-card {
  text-align: center;
  background: #fff;
  border: 1px solid #efeaf6;
  border-radius: 14px;
  padding: 1rem;
}

.stat-icon {
  color: var(--primary);
  margin: 0 auto 0.4rem;
}

.stat-value {
  margin: 0;
  font-size: 1.7rem;
  color: #1c1230;
  font-weight: 800;
}

.stat-label {
  margin: 0.2rem 0 0;
  font-size: 0.9rem;
  color: #5f5574;
}

.cta-section {
  padding: 0.4rem 0 3rem;
}

.cta-box {
  border-radius: 24px;
  padding: 2rem 1.2rem;
  text-align: center;
  background: linear-gradient(125deg, #6b21a8, #9333ea, #7c3aed);
  color: #fff;
}

.cta-box h2 {
  color: #fff;
  margin-bottom: 0.6rem;
  font-size: clamp(1.5rem, 3vw, 2.2rem);
}

.cta-box p {
  max-width: 630px;
  margin: 0 auto 1.15rem;
  color: rgba(255, 255, 255, 0.88);
}

.cta-join {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: #fbbf24;
  color: #171314;
  border-radius: 10px;
  padding: 0.7rem 1rem;
}

.landing-footer {
  border-top: 1px solid #ece6f5;
  padding: 1.6rem 0;
  text-align: center;
}

.footer-brand {
  margin: 0;
  font-weight: 700;
}

.footer-text {
  margin: 0.35rem 0 0;
  color: #5f5574;
}

.fade-up {
  animation: fadeUp 0.55s ease both;
}

.fade-slide-left {
  animation: slideLeft 0.6s ease both;
}

.fade-scale-in {
  animation: scaleIn 0.6s ease both 0.15s;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideLeft {
  from {
    opacity: 0;
    transform: translateX(-24px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.94);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (min-width: 900px) {
  .hero-grid {
    grid-template-columns: 1.05fr 0.95fr;
    padding-top: 3.8rem;
    padding-bottom: 3.8rem;
    gap: 2.5rem;
  }

  .hero-image {
    aspect-ratio: 4 / 5;
  }

  .feature-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .stats-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .cta-box {
    padding: 2.8rem 2rem;
  }
}
</style>