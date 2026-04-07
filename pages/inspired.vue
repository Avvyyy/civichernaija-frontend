<template>
  <div class="inspired-page">
    <!-- Splash Screen with Zoom Animation -->
    <Transition name="splash-fade">
      <div v-if="showSplash" class="splash-screen">
        <div class="splash-content">
          <div class="splash-text-container">
            <h1 class="splash-text">Get Ready to Get Inspired</h1>
            <p class="splash-subtitle">Discover stories of remarkable female politicians</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Main Content -->
    <div class="page-content" :class="{ revealed: !showSplash }">
      <div class="container">
        <div class="header">
          <h2>Get Inspired</h2>
          <p>Learn from the incredible journeys of female politicians who are shaping our nation</p>
        </div>

        <div v-if="pending" class="rolemodels-grid">
          <div v-for="n in 6" :key="`skeleton-${n}`" class="rolemodel-card skeleton-card" aria-hidden="true">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-name"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-line"></div>
          </div>
        </div>

        <div v-else-if="loadError" class="state-card error-state">
          <h3>Unable to load role models</h3>
          <p>We could not fetch role models from the backend. Please try again shortly.</p>
        </div>

        <div v-else-if="!roleModels.length" class="state-card empty-state">
          <h3>No role models yet</h3>
          <p>Inspiring stories will appear here soon. Check back later!</p>
        </div>

        <div v-else class="rolemodels-grid">
          <button
            v-for="roleModel in roleModels"
            :key="roleModel._id"
            class="rolemodel-card"
            @click="openRoleModel(roleModel)"
          >
            <div class="card-image-container">
              <img 
                v-if="roleModel.imageUrl" 
                :src="roleModel.imageUrl" 
                :alt="roleModel.name"
                class="card-image"
              >
              <div v-else class="card-image-placeholder">
                👩‍💼
              </div>
            </div>
            <div class="card-content">
              <h3 class="card-name">{{ roleModel.name }}</h3>
              <p class="card-title">{{ roleModel.title }}</p>
              <p class="card-story-preview">{{ truncateText(roleModel.story, 80) }}</p>
              <div class="card-footer">
                <span class="read-more">Read Story →</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Role Model Detail Modal -->
    <Transition name="modal-fade">
      <div v-if="selectedRoleModel" class="modal-overlay" @click="closeRoleModel">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="closeRoleModel">×</button>
          
          <div class="modal-image-section">
            <img 
              v-if="selectedRoleModel.imageUrl" 
              :src="selectedRoleModel.imageUrl" 
              :alt="selectedRoleModel.name"
              class="modal-image"
            >
            <div v-else class="modal-image-placeholder">
              👩‍💼
            </div>
          </div>

          <div class="modal-text-section">
            <h2 class="modal-name">{{ selectedRoleModel.name }}</h2>
            <p class="modal-title">{{ selectedRoleModel.title }}</p>

            <div v-if="selectedRoleModel.quoteText" class="quote-section">
              <blockquote class="quote-text">
                "{{ selectedRoleModel.quoteText }}"
              </blockquote>
              <p class="quote-attribution">— {{ selectedRoleModel.quoteAttr }}</p>
            </div>

            <div class="story-section">
              <h3>Story</h3>
              <p class="story-text">{{ selectedRoleModel.story }}</p>
            </div>

            <div v-if="selectedRoleModel.achievements && selectedRoleModel.achievements.length" class="achievements-section">
              <h3>Key Achievements</h3>
              <ul class="achievements-list">
                <li v-for="(achievement, idx) in selectedRoleModel.achievements" :key="idx">
                  {{ achievement }}
                </li>
              </ul>
            </div>

            <button class="btn-close-modal" @click="closeRoleModel">Close</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const config = useRuntimeConfig();
const pending = ref(true);
const loadError = ref(false);
const roleModels = ref([]);
const showSplash = ref(true);
const selectedRoleModel = ref(null);

onMounted(async () => {
  try {
    // Fetch role models from backend
    const data = await $fetch(`${config.public.apiBase}/rolemodels`);

    if (Array.isArray(data)) {
      roleModels.value = data;
    }
  } catch (err) {
    console.error('Failed to load role models:', err);
    loadError.value = true;
  } finally {
    pending.value = false;
    // Hide splash screen after animation
    setTimeout(() => {
      showSplash.value = false;
    }, 2500);
  }
});

const truncateText = (text, length) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

const openRoleModel = (roleModel) => {
  selectedRoleModel.value = roleModel;
  document.body.style.overflow = 'hidden';
};

const closeRoleModel = () => {
  selectedRoleModel.value = null;
  document.body.style.overflow = 'auto';
};
</script>

<style scoped>
.inspired-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0d1117 0%, #14213d 100%);
  position: relative;
}

/* Splash Screen */
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0d1117 0%, #14213d 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.splash-content {
  text-align: center;
  overflow: hidden;
}

.splash-text-container {
  animation: zoomOut 2.5s ease-out forwards;
}

.splash-text {
  font-size: 4rem;
  font-weight: 700;
  background: linear-gradient(90deg, #fca311, #ffc05c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -1px;
  text-shadow: 0 4px 20px rgba(252, 163, 17, 0.3);
  animation: fadeOut 2s ease-out 0.5s forwards;
}

.splash-subtitle {
  font-size: 1.3rem;
  color: #a3a3a3;
  margin-top: 1rem;
  animation: fadeOut 2s ease-out 0.5s forwards;
}

@keyframes zoomOut {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0.3);
    opacity: 0;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* Main Content */
.page-content {
  opacity: 0;
  transition: opacity 0.8s ease-in 0.5s;
}

.page-content.revealed {
  opacity: 1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.header {
  text-align: center;
  margin-bottom: 4rem;
}

.header h2 {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(90deg, #fca311, #ffc05c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1rem 0;
}

.header p {
  font-size: 1.2rem;
  color: #a3a3a3;
  max-width: 600px;
  margin: 0 auto;
}

/* Grid Styles */
.rolemodels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.rolemodel-card {
  background: rgba(20, 33, 61, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 0;
  flex: 1;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.rolemodel-card:hover {
  transform: translateY(-8px);
  border-color: rgba(252, 163, 17, 0.5);
  box-shadow: 0 20px 40px rgba(252, 163, 17, 0.2);
}

.card-image-container {
  width: 100%;
  height: 250px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(252, 163, 17, 0.2), rgba(20, 33, 61, 0.5));
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.rolemodel-card:hover .card-image {
  transform: scale(1.1);
}

.card-image-placeholder {
  font-size: 4rem;
}

.card-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fca311;
  margin: 0 0 0.5rem 0;
}

.card-title {
  font-size: 0.95rem;
  color: #a3a3a3;
  margin: 0 0 1rem 0;
  font-weight: 500;
}

.card-story-preview {
  font-size: 0.95rem;
  color: #e5e5e5;
  margin: 0 0 1rem 0;
  flex: 1;
  line-height: 1.6;
}

.card-footer {
  margin-top: auto;
}

.read-more {
  font-size: 0.9rem;
  color: #fca311;
  font-weight: 600;
  transition: transform 0.3s ease;
  display: inline-block;
}

.rolemodel-card:hover .read-more {
  transform: translateX(4px);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 2rem;
  overflow-y: auto;
}

.modal-content {
  background: linear-gradient(135deg, #1e293b 0%, #14213d 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  backdrop-filter: blur(16px);
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 2rem;
  color: #fca311;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(252, 163, 17, 0.2);
  transform: rotate(90deg);
}

.modal-image-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
}

.modal-image-placeholder {
  font-size: 6rem;
  text-align: center;
}

.modal-text-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
  max-height: calc(90vh - 4rem);
}

.modal-name {
  font-size: 2rem;
  font-weight: 700;
  color: #fca311;
  margin: 0;
}

.modal-title {
  font-size: 1.1rem;
  color: #a3a3a3;
  margin: 0;
  font-weight: 500;
}

.quote-section {
  background: rgba(252, 163, 17, 0.1);
  border-left: 4px solid #fca311;
  padding: 1.5rem;
  border-radius: 8px;
}

.quote-text {
  font-size: 1.1rem;
  color: #e5e5e5;
  font-style: italic;
  margin: 0 0 1rem 0;
  line-height: 1.8;
}

.quote-attribution {
  color: #a3a3a3;
  margin: 0;
  font-size: 0.95rem;
}

.story-section h3,
.achievements-section h3 {
  font-size: 1.2rem;
  color: #fca311;
  margin: 1rem 0 0.5rem 0;
  font-weight: 600;
}

.story-text {
  color: #e5e5e5;
  line-height: 1.8;
  margin: 0;
  font-size: 0.95rem;
}

.achievements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.achievements-list li {
  color: #e5e5e5;
  padding: 0.5rem 0 0.5rem 1.5rem;
  position: relative;
  font-size: 0.95rem;
}

.achievements-list li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #fca311;
  font-weight: bold;
}

.btn-close-modal {
  align-self: flex-start;
  padding: 0.8rem 1.5rem;
  background: #fca311;
  color: #14213d;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.btn-close-modal:hover {
  background: #ffc05c;
  transform: translateY(-2px);
}

/* Skeleton Loaders */
.skeleton-card {
  padding: 1rem;
  cursor: default;
}

.skeleton {
  background: linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05), rgba(255,255,255,0.1));
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}

.skeleton-image {
  height: 250px;
  margin-bottom: 1rem;
}

.skeleton-name {
  height: 1.5rem;
  margin-bottom: 0.5rem;
}

.skeleton-title {
  height: 1rem;
  margin-bottom: 1rem;
  width: 80%;
}

.skeleton-line {
  height: 0.8rem;
  margin-bottom: 0.5rem;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* State Cards */
.state-card {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(20, 33, 61, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(16px);
}

.state-card h3 {
  font-size: 1.5rem;
  color: #fca311;
  margin-bottom: 1rem;
}

.state-card p {
  color: #a3a3a3;
  font-size: 1rem;
}

.error-state {
  border-color: rgba(239, 68, 68, 0.5);
}

.error-state h3 {
  color: #f87171;
}

/* Transitions */
.splash-fade-enter-active,
.splash-fade-leave-active {
  transition: opacity 0.8s ease;
}

.splash-fade-enter-from,
.splash-fade-leave-to {
  opacity: 1;
}

.splash-fade-enter-to,
.splash-fade-leave-from {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 2rem 1rem;
  }

  .header h2 {
    font-size: 2rem;
  }

  .header p {
    font-size: 1rem;
  }

  .splash-text {
    font-size: 2rem;
  }

  .splash-subtitle {
    font-size: 1rem;
  }

  .rolemodels-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .modal-content {
    grid-template-columns: 1fr;
    padding: 1.5rem 1rem;
    gap: 1.5rem;
  }

  .modal-text-section {
    max-height: none;
  }

  .modal-image-placeholder {
    font-size: 4rem;
  }

  .modal-name {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .splash-text {
    font-size: 1.5rem;
  }

  .header h2 {
    font-size: 1.5rem;
  }

  .rolemodel-card {
    min-height: 400px;
  }

  .card-image-container {
    height: 200px;
  }

  .modal-close {
    top: 0.5rem;
    right: 0.5rem;
    width: 36px;
    height: 36px;
    font-size: 1.5rem;
  }
}
</style>
