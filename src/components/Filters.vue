<template>
  <div id="search-area" class="mb-5">
    <v-row>
      <v-col cols="12" sm="4">
        <v-select
          v-model="selectedCategory"
          :items="categoryItems"
          label="Category"
          variant="outlined"
          density="compact"
          clearable
          @update:modelValue="updateCategory"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="4">
        <v-text-field
          v-model="search"
          variant="outlined"
          label="Search"
          density="compact"
          append-inner-icon="mdi-magnify"
          @input="$emit('search', search)"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="4" v-if="categoryFilters.length">
        <v-btn
          color="red"
          :variant="showFilters ? 'tonal' : 'flat'"
          @click="showFilters = !showFilters"
          block
        >
          Filters <v-icon large class="ml-2"> mdi-filter </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>

  <div v-if="showFilters" class="mb-5">
    <v-row>
      <v-col cols="12" sm="4" v-for="(filter, index) in categoryFilters">
        <!-- <range-slider
          v-if="filter.name == 'Voltage'"
          :min="0"
          :max="10"
          v-model="selectedCategoryFilters[filter.key]"
          @update:modelValue="filterComponents"
        ></range-slider> -->
        <v-select
          v-model="selectedCategoryFilters[filter.key]"
          :items="filter.options"
          :label="filter.name"
          variant="outlined"
          density="compact"
          clearable
          multiple
          @update:modelValue="filterComponents"
        >
        </v-select>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { CategoryFilter, ComponentCategory } from "@/types/components";
import RangeSlider from "@/components/RangeSlider.vue";
import { onBeforeMount, ref } from "vue";

const props = defineProps<{
  categories: ComponentCategory[];
  currentCategory?: ComponentCategory;
  categoryFilters: CategoryFilter[];
}>();

const emit = defineEmits<{
  (event: "search", ...args: any[]): void;
  (event: "filter", ...args: any[]): void;
  (event: "updateCategory", ...args: any[]): void;
  (event: "filterCategories", ...args: any[]): void;
}>();

const categoryItems = ref<{ title: string; value: number }[]>([]);
const selectedCategory = ref<number>();

const selectedCategoryFilters = ref<{ [key: string]: any[] }>({});

const search = ref("");
const showFilters = ref(false);

onBeforeMount(() => {
  categoryItems.value = props.categories.map((category) => {
    return { title: category.name, value: category.category_id };
  });

  selectedCategory.value = props.currentCategory?.category_id;
});

function updateCategory(newCategory: number) {
  emit("updateCategory", newCategory);
}

function filterComponents() {
  // console.log("filterComponents", selectedCategoryFilters.value);

  if (!selectedCategory.value) selectedCategoryFilters.value = {};

  emit("filter", selectedCategoryFilters.value, search.value);
}
</script>

<style>
#search-area {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 30px;
}
</style>
