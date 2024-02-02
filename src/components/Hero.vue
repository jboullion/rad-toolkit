<template>
  <div
    class="hero"
    style="background-image: url('/images/circuit-board-6522546_1280.webp')"
    :class="{ 'hero--search': showSearch }"
  >
    <div class="hero__overlay">
      <div class="hero__content">
        <h1>Semiconductor Radiation Toolkit</h1>
        <p v-if="!showSearch">
          A database of semiconductor radiation test data
        </p>

        <div class="hero__search-field" v-if="showSearch">
          <v-text-field
            v-model="search"
            variant="outlined"
            label="Search"
            density="compact"
            append-inner-icon="mdi-magnify"
            @input="$emit('search', search)"
          ></v-text-field>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const search = ref("");

defineEmits<{
  (event: "search", search: string): void;
}>();

defineProps<{
  showSearch: boolean;
}>();
</script>

<style>
.hero {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero.hero--search .hero__overlay {
  padding: 20px 15px;
}

.hero__content {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
}

.hero__search-field {
  padding: 20px;
  border-radius: 8px;
  background-color: #121212;
  box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.hero__content h1 {
  font-weight: normal;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(0, 0, 0, 1);
}

.hero__content p {
  margin-bottom: 20px;
  text-shadow: 0 0 20px rgba(0, 0, 0, 1);
}

.hero__overlay {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 80px 15px 60px;
}

@media (max-width: 786px) {
  .hero__overlay {
    padding: 60px 15px 50px;
  }

  .hero__content {
    padding: 15px;
  }

  .hero__content h1 {
    font-size: 26px;
  }

  .hero__content p {
  }
}
</style>
