<template>
  <div class="category-list mb-12">
    <v-container class="">
      <h2 class="text-center">Categories</h2>
      <v-row>
        <v-col
          v-for="category in categories"
          :key="category.category_id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-btn
            size="x-large"
            block
            @click="$emit('category-selected', category.category_id)"
          >
            {{ category.name }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ComponentCategory } from "@/types/components";

defineEmits<{
  (event: "category-selected", categoryId: number): void;
}>();

defineProps<{
  categories: ComponentCategory[];
}>();
</script>

<style>
.category-list h2 {
  margin-bottom: 20px;
}
</style>
