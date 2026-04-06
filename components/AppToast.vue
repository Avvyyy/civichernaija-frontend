<template>
  <div class="toast-stack" aria-live="polite" aria-atomic="true">
    <TransitionGroup name="toast-list" tag="div" class="toast-list">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast--${toast.type}`"
        role="status"
      >
        <div class="toast__icon" aria-hidden="true">
          <CheckCircle2 v-if="toast.type === 'success'" :size="18" />
          <AlertCircle v-else-if="toast.type === 'error'" :size="18" />
          <Info v-else :size="18" />
        </div>
        <p class="toast__message">{{ toast.message }}</p>
        <button class="toast__close" type="button" @click="removeToast(toast.id)" aria-label="Dismiss notification">
          <X :size="16" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-vue-next';

const { toasts, removeToast } = useToast();
</script>

<style scoped>
.toast-stack {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 9999;
  width: min(100vw - 2rem, 360px);
  pointer-events: none;
}

.toast-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.toast {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: start;
  gap: 0.75rem;
  padding: 0.95rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(17, 24, 39, 0.08);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(14px);
  pointer-events: auto;
}

.toast__icon {
  margin-top: 0.05rem;
}

.toast__message {
  margin: 0;
  line-height: 1.45;
  color: var(--text-main);
}

.toast__close {
  appearance: none;
  border: 0;
  background: transparent;
  color: inherit;
  padding: 0.1rem;
  cursor: pointer;
  opacity: 0.7;
}

.toast__close:hover {
  opacity: 1;
}

.toast--success {
  border-left: 4px solid #16a34a;
}

.toast--error {
  border-left: 4px solid #dc2626;
}

.toast--info {
  border-left: 4px solid var(--primary);
}

.toast--success .toast__icon {
  color: #16a34a;
}

.toast--error .toast__icon {
  color: #dc2626;
}

.toast--info .toast__icon {
  color: var(--primary);
}

.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.22s ease;
}

.toast-list-enter-from,
.toast-list-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

.toast-list-leave-active {
  position: absolute;
}
</style>
