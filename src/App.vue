<template>
  <v-app :theme="theme">
    <Navbar :theme="theme" @toggle-theme="toggleTheme" />

    <v-main>
      <v-container fluid v-if="!loading">
        <Filters
          :categories="categories"
          :category-filters="categoryFilters"
          :current-category="currentCategory"
          @search="searchComponents"
          @filter="filterComponents"
          @updateCategory="updateCategory"
          @filterCategories="filterCategories"
        />
        <KeepAlive>
          <ComponentTable
            :components="filteredComponents"
            :properties="currentProperties"
            @sort="sortComponents"
            @compare="compare = true"
            @compareComponents="setCompareComponents"
            @showComponent="setupComponent"
            ref="componentTable"
          />
        </KeepAlive>
      </v-container>
      <div class="text-center" style="margin: 250px 0 0" v-else>
        <v-progress-circular
          :size="70"
          :width="4"
          color="red"
          indeterminate
        ></v-progress-circular>
      </div>
    </v-main>

    <ComponentDialog
      :show-dialog="showComponent"
      :component="currentComponent"
      :properties="currentProperties"
      @close="showComponent = false"
    />

    <CompareDialog
      @close="compare = false"
      :show-dialog="compare"
      :components="compareComponents"
      :properties="currentProperties"
    />

    <v-footer class="bg-black">
      <v-row align="center" justify="center">
        <v-col cols="12" class="text-center">
          <a href="https://nexusaurora.org/" target="_blank" class="white--text"
            >A Nexus Aurora Project</a
          >
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
/**
 * WANTS:
 * - Skeletal loading
 */

import { computed, onMounted, ref } from "vue";
import Navbar from "./components/Navbar.vue";
import Filters from "./components/Filters.vue";
import ComponentTable from "./components/ComponentTable.vue";
import ComponentDialog from "./components/ComponentDialog.vue";
import CompareDialog from "./components/CompareDialog.vue";
import {
  CategoryFilter,
  Component,
  ComponentCategory,
  ComponentProperties,
  ComponentTableProps,
} from "@/types/components";

import { useThrottleFn } from "@vueuse/core";
import {
  commonProperties,
  fpgaProperties,
  microcontrollerProperties,
  microProcessorProperties,
  memoryProperties,
  socProperties,
  voltageRegulatorProperties,
  SBCProperties,
  interfaceICProperties,
} from "./properties";
import {
  commonFilters,
  fpgaFilters,
  microControllerFilters,
  microProcessorFilters,
  socFilters,
} from "./filters";

const theme = ref("dark");
const compare = ref(false);
const loading = ref(false);

function toggleTheme() {
  theme.value = theme.value === "light" ? "dark" : "light";
}

const components = ref<Component[]>([]);

const categories = ref<ComponentCategory[]>([]);
const currentComponent = ref<Component | null>(null);
const currentCategory = ref<ComponentCategory>();
const showComponent = ref(false);
const filteredComponents = ref<Component[]>([]);
const sortOrder = ref(1);

/**
 * Compute our properties and filters based on the current category
 */
// currentProperties is used to determine which properties to show in the table and compare dialog.
const currentProperties = computed<ComponentTableProps[]>(() => {
  if (!currentCategory.value || categories.value.length === 0)
    return commonProperties;

  switch (currentCategory.value.name) {
    case "System On Chip (SoC)":
      return commonProperties.concat(socProperties);
    case "Microprocessors":
      return commonProperties.concat(microProcessorProperties);
    case "Microcontrollers":
      return commonProperties.concat(microcontrollerProperties);
    case "FPGAs":
      return commonProperties.concat(fpgaProperties);
    case "Memory":
      return commonProperties.concat(memoryProperties);
    case "Voltage Regulators":
      return commonProperties.concat(voltageRegulatorProperties);
    case "SBCs":
      return commonProperties.concat(SBCProperties);
    case "Interface ICs":
      return commonProperties.concat(interfaceICProperties);
  }

  return commonProperties;
});

const categoryFilters = computed<CategoryFilter[]>(() => {
  if (!currentCategory.value || categories.value.length === 0) return [];

  let buildFilters: CategoryFilter[] = commonFilters.value;

  switch (currentCategory.value.name) {
    case "Microprocessors":
      buildFilters = buildFilters.concat(microProcessorFilters.value);
      break;
    case "Microcontrollers":
      buildFilters = buildFilters.concat(microControllerFilters.value);
      break;
    case "System On Chip (SoC)":
      buildFilters = buildFilters.concat(socFilters.value);
      break;
    case "FPGAs":
      buildFilters = buildFilters.concat(fpgaFilters.value);
      break;
  }

  buildFilters = populateFilterOptions(buildFilters);

  return buildFilters;
});

/**
 * SETUP
 */

onMounted(async () => {
  loading.value = true;

  // setup categories
  const cat_response = await fetch(
    "https://rad-toolkit.nexusaurora.org/api/components/categories.php"
  );
  categories.value = await cat_response.json();

  loading.value = false;
});

function setupComponent(component: Component) {
  currentComponent.value = component;
  showComponent.value = true;
}

/**
 * Populate our filter options based on the components properties.
 *
 * This allows us to have a dynamic filter list based on the components, although it is a little complicated
 */
function populateFilterOptions(newFilters: CategoryFilter[]): CategoryFilter[] {
  // loop through each component and add the options to the filters
  components.value.forEach((component) => {
    // loop through each filter and add the options
    newFilters.forEach((filter) => {
      // check if the component has the property
      if (component.properties[filter.key as keyof ComponentProperties]) {
        // get the value of this property for this filter
        const value: string | [] =
          component.properties[filter.key as keyof ComponentProperties];

        console.log("value", value, typeof value);

        // check if the value is already in the options
        if (!filter.options.includes(value)) {
          if (filter.key !== "cores") {
            if (typeof value === "string") {
              // split on comma and add each value
              value.split(",").forEach((val) => {
                if (!filter.options.includes(val.trim())) {
                  filter.options.push(val.trim());
                }
              });
            } else if (typeof value === "number") {
              filter.options.push(value);
            } else if (Array.isArray(value) || typeof value === "object") {
              // Arrayed properties are often returned as Javascript Proxies, so we need to convert them to an array
              value.map((val) => {
                const cleanVal = typeof val === "string" ? val.trim() : val;
                if (!filter.options.includes(cleanVal)) {
                  filter.options.push(cleanVal);
                }
              });
            } else {
              console.log("value is of unknown type", value);
            }
          } else {
            // add the value
            filter.options.push(value.trim());
          }
        }
      }

      // sort the options
      filter.options.sort();
    });

    console.log("filter.options", newFilters);
  });

  // remove any filters that have no options
  newFilters = newFilters.filter((filter) => filter.options.length > 0);

  return newFilters;
}

/**
 * SEARCH
 */
// const throttledSearch = useThrottleFn(searchComponents, 250);
function filterComponents(
  filters: { [key: string]: string } = {},
  search: string = ""
) {
  filteredComponents.value = components.value.filter((component) => {
    let matches = true;

    // check filters
    if (filters) {
      Object.keys(filters).forEach((key) => {
        const componentProperty =
          component.properties[key as keyof ComponentProperties];
        let componentPropertiesArr: string[] = [];

        if (filters[key] && filters[key].length > 0) {
          if (key === "cores") {
            if (!filters[key].includes(componentProperty)) {
              matches = false;
            }
          } else {
            if (typeof componentProperty === "string") {
              componentPropertiesArr = componentProperty.split(",");
            } else if (
              Array.isArray(typeof componentProperty) ||
              typeof componentProperty === "object"
            ) {
              componentPropertiesArr = componentProperty;
            } else {
              console.error(
                "componentProperty is neither string or array",
                componentProperty
              );
            }

            if (
              !componentPropertiesArr.some((prop) =>
                filters[key].includes(prop.trim())
              )
            ) {
              matches = false;
            }
          }
        }
      });
    }

    // check search
    if (search.length > 0) {
      // Search for the search term in the common properties
      matches = Object.keys(component).some((key) => {
        const value = component[key as keyof Component];
        if (typeof value === "string") {
          return value.toLowerCase().includes(search);
        }
        return false;
      });

      if (matches) return matches;

      // Search for the search term in the current category properties
      matches = Object.keys(component.properties).some((key) => {
        const value = component.properties[key as keyof ComponentProperties];
        if (typeof value === "string") {
          return value.toLowerCase().includes(search);
        }
        return false;
      });
    }

    return matches;
  });
}

function searchComponents(search: string) {
  filterComponents({}, search);
}

function filterCategories(selectedCategory: number) {
  if (selectedCategory) {
    filteredComponents.value = components.value.filter(
      (component) => component.category_id === selectedCategory
    );
  } else {
    filteredComponents.value = components.value;
  }
}

function sortComponents(property: string) {
  filteredComponents.value = filteredComponents.value.sort((a, b) => {
    if (
      a[property as keyof Component] < b[property as keyof Component] ||
      a.properties[property as keyof ComponentProperties] <
        b.properties[property as keyof ComponentProperties]
    ) {
      return -1 * sortOrder.value;
    }

    if (
      a[property as keyof Component] > b[property as keyof Component] ||
      a.properties[property as keyof ComponentProperties] >
        b.properties[property as keyof ComponentProperties]
    ) {
      return 1 * sortOrder.value;
    }

    return 0;
  });

  sortOrder.value = sortOrder.value * -1;
}

/**
 * COMPARE
 */
const compareComponents = ref<Component[]>([]);

// Set the components to compare in our modal
function setCompareComponents(components: Component[]) {
  compareComponents.value = components;
}

function clearCompare() {
  compareComponents.value = [];
  compare.value = false;
  // if (componentTableRef.value) {
  //   // @ts-ignore
  //   componentTableRef.value.clearCompare();
  // }
}

// Update the current category and load components
async function updateCategory(category: number) {
  clearCompare();

  loading.value = true;

  currentCategory.value = categories.value.find(
    (c) => c.category_id === category
  ) as ComponentCategory;

  // Get componnents for this category
  const response = await fetch(
    "https://rad-toolkit.nexusaurora.org/api/components/?category_id=" +
      category
  );

  components.value = await response.json();

  // reset all filters and components
  filteredComponents.value = components.value;

  loading.value = false;
}
</script>

<style>
.v-container {
  padding-top: 40px;
}

.pointer {
  cursor: pointer;
}

.white--text {
  color: white !important;
}

.v-footer {
  min-height: 120px;
}
</style>
