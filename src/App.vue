<template>
  <div
    class="flex flex-col items-center justify-center h-full w-screen bg-slate-200 gap-6"
  >
    <div v-if="isAuthenticated" class="w-full">
      <MaterialOverview />
    </div>

    <button
      v-else
      @click="login()"
      class="p-2 bg-slate-600 rounded-md shadow-md text-white hover:text-black hover:bg-slate-200"
    >
      Login
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted } from "vue";
import MaterialOverview from "./components/MaterialOverview.vue";

const $AuthService = inject("$AuthService");

const login = () => {
  const response = $AuthService.login("/auth");
};

const isAuthenticated = computed(() => {
  return $AuthService.isAuthenticated();
});

</script>
