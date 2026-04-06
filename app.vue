<template>
  <div>
    <AppToast />
    <AppNavbar v-if="showTopNav" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
const route = useRoute();

const showTopNav = computed(() => {
  return route.path !== '/' && !route.path.startsWith('/auth');
});
</script>
