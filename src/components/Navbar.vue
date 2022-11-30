<template>
  <v-app-bar class="bg-black" title="Semiconductor Radiation Toolkit">
    <template v-slot:prepend>
      <img
        src="@/assets/logo.jpg"
        width="50"
        height="50"
        class="mx-4 rounded-circle"
        alt="Semiconductor Radiation Toolkit"
      />
    </template>

    <v-spacer></v-spacer>

    <v-btn
      :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
      @click="$emit('toggle-theme')"
    ></v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  theme: string;
}>();

defineEmits<{
  (event: "toggle-theme", ...args: any[]): void;
}>();

const themeText = computed(() => {
  return props.theme === "light" ? "Light Mode" : "Dark Mode";
});
</script>

<style></style>
