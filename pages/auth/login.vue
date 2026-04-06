<template>
  <div class="auth-page">
    <div class="glass-card auth-card">
      <h2 class="title">Welcome Back</h2>
      <form @submit.prevent="login">
        <div class="form-group">
           <label>Email</label>
           <input type="email" v-model="form.email" required />
        </div>
        <div class="form-group">
           <label>Password</label>
           <input type="password" v-model="form.password" required />
        </div>
        <button type="submit" class="btn-primary w-full login-btn" :disabled="loading">
          <span v-if="loading" class="btn-content">
            <Loader2 :size="18" class="spinner" aria-hidden="true" />
            Logging in...
          </span>
          <span v-else>Login</span>
        </button>
      </form>
      <p class="switch-auth">New here? <NuxtLink to="/auth/signup">Sign Up</NuxtLink></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Loader2 } from 'lucide-vue-next';

const form = ref({ email: '', password: '' });
const loading = ref(false);
const router = useRouter();
const config = useRuntimeConfig();
const { error: showError } = useToast();

const login = async () => {
    try {
      loading.value = true;
    const res = await $fetch(`${config.public.apiBase}/auth/login`, {
            method: 'POST',
            body: form.value
        });
        localStorage.setItem('token', res.token);
        router.push('/dashboard');
    } catch(err) {
        showError(err.data?.message || 'Error logging in');
    } finally {
      loading.value = false;
    }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-color);
}
.auth-card { width: 100%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
.title { text-align: center; margin-bottom: 1.5rem; }
.form-group { margin-bottom: 1rem; }
label { display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem; }
input { width: 100%; padding: 0.75rem; border-radius: 6px; border: 1px solid #ddd; outline: none; }
input:focus { border-color: var(--primary); }
.w-full { width: 100%; margin-top: 1rem; }
.login-btn { display: inline-flex; align-items: center; justify-content: center; }
.btn-content { display: inline-flex; align-items: center; gap: 0.5rem; }
.spinner { animation: spin 0.8s linear infinite; }
.switch-auth { text-align: center; margin-top: 1rem; font-size: 0.9rem; }
.switch-auth a { color: var(--primary); text-decoration: none; font-weight: 600; }

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
