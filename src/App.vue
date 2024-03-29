<template>
  <v-app :theme="theme">
    <Navbar :theme="theme" @toggle-theme="toggleTheme" />

    <v-main>
      <Hero @search="updateSearch" :showSearch="!!currentCategory" />

      <template v-if="!currentCategory">
        <CategoryList
          :categories="categories"
          @category-selected="updateCategory"
        />
        <About />
      </template>
      <v-container fluid v-else-if="!loading">
        <Filters
          :categories="categories"
          :category-filters="categoryFilters"
          :current-category="currentCategory"
          @filter="filterComponents"
          @updateCategory="updateCategory"
          @filterCategories="filterCategories"
          @export="exportComponents"
        />

        <KeepAlive>
          <ComponentTable
            :components="filteredComponents"
            :properties="currentProperties"
            :test-sources="testSources"
            :sort-order="sortOrder"
            :sort-property="sortProperty"
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
 * TODO:
 *
 *
 */
/**
 * WANTS:
 * - Skeletal loading
 */

import { computed, onMounted, ref } from "vue";
import Navbar from "./components/Navbar.vue";
import Filters from "./components/Filters.vue";
import Hero from "./components/Hero.vue";
import CategoryList from "./components/CategoryList.vue";
import ComponentTable from "./components/ComponentTable.vue";
import ComponentDialog from "./components/ComponentDialog.vue";
import CompareDialog from "./components/CompareDialog.vue";
import About from "./components/About.vue";
import {
  CategoryFilter,
  Component,
  ComponentCategory,
  ComponentCategoryEnum,
  ComponentInterface,
  ComponentProperties,
  ComponentTableProps,
  Source,
  defaultComponent,
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
  diodeProperties,
  transistorProperties,
  jfetProperties,
  mosfetProperties,
  transistorHideProperties,
} from "./types/properties";
import {
  commonFilters,
  fpgaFilters,
  microControllerFilters,
  microProcessorFilters,
  socFilters,
  memoryFilters,
  voltageRegulatorFilters,
  SBCFilters,
  interfaceICFilters,
  diodeFilters,
  transistorFilters,
  jfetFilters,
  mosfetFilters,
} from "./types/filters";
import {
  arrayToCsv,
  prefixNumber,
  sortByNumericValue,
  sortProperties,
} from "./utils/utils";

const theme = ref("dark");
const compare = ref(false);
const loading = ref(false);
const search = ref("");

const components = ref<Component[]>([]);

const categories = ref<ComponentCategory[]>([]);
const currentComponent = ref<Component>(defaultComponent);

const currentCategory = ref<ComponentCategory>();
const showComponent = ref(false);
const filteredComponents = ref<Component[]>([]);
const sortOrder = ref(1);
const sortProperty = ref("");
const testSources = ref<Source[]>([]);

/**
 * Compute our properties and filters based on the current category
 */
// currentProperties is used to determine which properties to show in the table and compare dialog.
const currentProperties = computed<ComponentTableProps[]>(() => {
  if (!currentCategory.value || categories.value.length === 0)
    return commonProperties;

  switch (currentCategory.value.name) {
    case ComponentCategoryEnum.SOC:
      return commonProperties.concat(socProperties);
    case ComponentCategoryEnum.Microprocessors:
      return commonProperties.concat(microProcessorProperties);
    case ComponentCategoryEnum.Microcontrollers:
      return commonProperties.concat(microcontrollerProperties);
    case ComponentCategoryEnum.FPGA:
      return commonProperties.concat(fpgaProperties);
    case ComponentCategoryEnum.Memory:
      return commonProperties.concat(memoryProperties);
    case ComponentCategoryEnum.VoltageRegulator:
      return commonProperties.concat(voltageRegulatorProperties);
    case ComponentCategoryEnum.SBC:
      return commonProperties.concat(SBCProperties);
    case ComponentCategoryEnum.InterfaceIC:
      return commonProperties.concat(interfaceICProperties);
    case ComponentCategoryEnum.Diodes:
      return commonProperties
        .filter((prop) => !transistorHideProperties.includes(prop.sortProperty))
        .concat(diodeProperties);
    case ComponentCategoryEnum.Transistors:
      return commonProperties
        .filter((prop) => !transistorHideProperties.includes(prop.sortProperty))
        .concat(transistorProperties);
    case ComponentCategoryEnum.JFET:
      return commonProperties
        .filter((prop) => !transistorHideProperties.includes(prop.sortProperty))
        .concat(jfetProperties);
    case ComponentCategoryEnum.MOSFET:
      return commonProperties
        .filter((prop) => !transistorHideProperties.includes(prop.sortProperty))
        .concat(mosfetProperties);
  }

  return commonProperties;
});

const categoryFilters = computed<CategoryFilter[]>(() => {
  if (!currentCategory.value || categories.value.length === 0) return [];

  let buildFilters: CategoryFilter[] = commonFilters.value;

  switch (currentCategory.value.name) {
    case ComponentCategoryEnum.SOC:
      buildFilters = buildFilters.concat(socFilters.value);
      break;
    case ComponentCategoryEnum.Microprocessors:
      buildFilters = buildFilters.concat(microProcessorFilters.value);
      break;
    case ComponentCategoryEnum.Microcontrollers:
      buildFilters = buildFilters.concat(microControllerFilters.value);
      break;
    case ComponentCategoryEnum.FPGA:
      buildFilters = buildFilters.concat(fpgaFilters.value);
      break;
    case ComponentCategoryEnum.Memory:
      buildFilters = buildFilters.concat(memoryFilters.value);
      break;
    case ComponentCategoryEnum.VoltageRegulator:
      buildFilters = buildFilters.concat(voltageRegulatorFilters.value);
      break;
    case ComponentCategoryEnum.SBC:
      buildFilters = buildFilters.concat(SBCFilters.value);
      break;
    case ComponentCategoryEnum.InterfaceIC:
      buildFilters = buildFilters.concat(interfaceICFilters.value);
      break;
    case ComponentCategoryEnum.Diodes:
      buildFilters = buildFilters.concat(diodeFilters.value);
      break;
    case ComponentCategoryEnum.Transistors:
      buildFilters = buildFilters.concat(transistorFilters.value);
      break;
    case ComponentCategoryEnum.JFET:
      buildFilters = buildFilters.concat(jfetFilters.value);
      break;
    case ComponentCategoryEnum.MOSFET:
      buildFilters = buildFilters.concat(mosfetFilters.value);
      break;
    default:
  }

  buildFilters.forEach((filter) => (filter.options = []));

  buildFilters = populateFilterOptions(buildFilters);

  buildFilters.forEach((filter) => filter.options.sort(sortByNumericValue));

  return buildFilters;
});

/**
 * SETUP
 */
function toggleTheme() {
  theme.value = theme.value === "light" ? "dark" : "light";
}

onMounted(async () => {
  loading.value = true;

  // setup categories
  const cat_response = await fetch(
    "https://rad-toolkit.nexusaurora.org/api/components/categories.php"
  );
  categories.value = await cat_response.json();

  // setup sources
  const source_response = await fetch(
    "https://rad-toolkit.nexusaurora.org/api/components/test-sources.php"
  );
  testSources.value = await source_response.json();

  loading.value = false;

  const urlParams = new URLSearchParams(window.location.search);
  const category = Number(urlParams.get("category"));
  search.value = urlParams.get("search") || "";
  const keys = urlParams.keys();

  if (category) {
    await updateCategory(category);

    // let filters: { [key: string]: string } = {};
    // for (const key of keys) {
    //   if (key !== "category" && key !== "search") {
    //     filters[key] = urlParams.get(key)?.toString() || "";
    //   }
    // }
  }
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
  filteredComponents.value.forEach((component) => {
    // loop through each filter and add the options
    newFilters.forEach((filter) => {
      // check if the component has the property
      if (component.properties[filter.key as keyof ComponentProperties]) {
        // get the value of this property for this filter
        const value: any =
          component.properties[filter.key as keyof ComponentProperties];

        // check if the value is already in the options
        if (!filter.options.includes(value)) {
          if (filter.key !== "cores") {
            // @ts-ignore
            if (value && value.property) {
              // @ts-ignore
              if (!filter.options.includes(value.property)) {
                filter.options.push(value.property);
              }
            } else if (value[0] && value[0].property) {
              // @ts-ignore
              value.forEach((p: ComponentInterface) => {
                if (!filter.options.includes(p.property)) {
                  filter.options.push(p.property);
                }
              });
            } else if (typeof value === "string") {
              // split on comma and add each value
              value.split(",").forEach((val) => {
                const cleanVal = val.trim();
                if (!filter.options.includes(cleanVal)) {
                  filter.options.push(cleanVal);
                }
              });
            } else if (typeof value === "number") {
              if (!filter.options.includes(value.toString())) {
                filter.options.push(value.toString());
              }
            } else if (Array.isArray(value) || typeof value === "object") {
              // Arrayed properties are often returned as Javascript Proxies, so we need to convert them to an array

              // @ts-ignore
              value.map((val: string) => {
                if (!filter.options.includes(val)) {
                  filter.options.push(val);
                }
              });
            } else {
              console.error("value is of unknown type", value);
            }
          } else {
            // add the value
            if (!filter.options.includes(value)) {
              filter.options.push(value);
            }
          }
        }
      }

      // sort the options
      // filter.options.sort();
    });
  });

  // remove any filters that have no options
  newFilters = newFilters.filter((filter) => filter.options.length > 0);

  return newFilters;
}

/**
 * SEARCH
 */
function updateSearch(newSearch: string) {
  search.value = newSearch;

  filterComponents({}, search.value);
}

// const throttledSearch = useThrottleFn(filterComponents, 250);
function filterComponents(
  filters: { [key: string]: string } = {},
  search: string = ""
) {
  search = search.toLowerCase();

  // Update our URL with the new filters
  updateURLParameter(filters, search);

  // filter current catrgory components
  filteredComponents.value = components.value.filter((component: Component) => {
    let matches = true;

    // check filters
    if (filters) {
      Object.keys(filters).forEach((key) => {
        const componentProperty: any =
          component.properties[key as keyof ComponentProperties];
        let componentPropertiesArr: string[] = [];

        if (filters[key] && filters[key].length > 0) {
          if (key === "cores") {
            if (!filters[key].includes(componentProperty)) {
              matches = false;
            }
          } else {
            // @ts-ignore
            if (key === "interfaces" || key === "secondary_interfaces") {
              if (componentProperty && componentProperty[0]?.property) {
                componentProperty.forEach((p: ComponentInterface) => {
                  componentPropertiesArr.push(p.property);
                });
              }
            } else if (key === "primary_interface") {
              componentPropertiesArr = [componentProperty.property];
            } else if (typeof componentProperty === "string") {
              componentPropertiesArr = componentProperty.split(",");
            } else if (typeof componentProperty === "number") {
              componentPropertiesArr = [componentProperty.toString()];
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
                filters[key].includes(prop)
              )
            ) {
              matches = false;
            }
          }
        }
      });
    }

    if (!matches) {
      return false;
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

      if (!matches) {
        // Search for the search term in the current category properties
        matches = Object.keys(component.properties).some((key) => {
          const value = component.properties[key as keyof ComponentProperties];
          if (typeof value === "string") {
            return value.toLowerCase().includes(search);
          }
          return false;
        });
      }
    }

    return matches;
  });

  populateFilterOptions(categoryFilters.value);
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
  //update our sort order depending on the property
  if (sortProperty.value === property) {
    sortOrder.value = sortOrder.value * -1;
  } else {
    sortOrder.value = 1;
  }

  sortProperty.value = property;

  filteredComponents.value = filteredComponents.value.sort((a, b) => {
    let aProperty = "";
    let bProperty = "";

    if (property === "tester_id") {
      aProperty = getSourceName(a.tester_id);
      bProperty = getSourceName(b.tester_id);
    } else {
      if (a[property as keyof Component]) {
        aProperty = a[property as keyof Component] as string;
      }

      if (b[property as keyof Component]) {
        bProperty = b[property as keyof Component] as string;
      }

      if (
        property === "partnum" ||
        property === "manufacturer" ||
        property === "description" ||
        property === "name"
      ) {
        return aProperty.localeCompare(bProperty) * sortOrder.value;
      }
    }

    if (a.properties[property as keyof ComponentProperties]) {
      aProperty = a.properties[property as keyof ComponentProperties] as string;
    }

    if (b.properties[property as keyof ComponentProperties]) {
      bProperty = b.properties[property as keyof ComponentProperties] as string;
    }

    if (aProperty && !bProperty) {
      return -1 * sortOrder.value;
    }

    if (!aProperty && bProperty) {
      return 1 * sortOrder.value;
    }

    if (!aProperty && !bProperty) {
      return 0;
    }

    return sortProperties(aProperty, bProperty) * sortOrder.value;
  });
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

  // Abbreviate all our property values if needed
  components.value.map((component: Component) => {
    Object.keys(component.properties).map((key) => {
      let value = component.properties[key as keyof ComponentProperties];

      if (!value) return;

      if (Array.isArray(value)) {
        // @ts-ignore
        if (value[0] && value[0].property) {
          return;
        }

        // @ts-ignore
        component.properties[key] = value
          .map((p) => {
            return prefixNumber(p, key);
          })
          .join(", ");

        return;
      }

      // @ts-ignore
      component.properties[key] = prefixNumber(value, key);
    });
  });

  // reset all filters and components
  filteredComponents.value = components.value;

  loading.value = false;

  updateURLParameter({}, search.value);
}

/**
 * EXPORT
 */
function exportComponents() {
  const filteredComponentArray = JSON.parse(
    JSON.stringify(filteredComponents.value)
  );

  // extract the properties from the components
  filteredComponentArray.forEach((component: any) => {
    //component.properties = Object.values(component.properties);
    Object.keys(component.properties).forEach((key) => {
      const value = component.properties[key as keyof ComponentProperties];
      component[key] = value;
    });

    delete component.component_id;
    delete component.category_id;
    delete component.properties;
  });

  const content = arrayToCsv(filteredComponentArray);
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const filename = currentCategory.value?.name
    ? currentCategory.value.name + "_export.csv"
    : "SRT_export.csv";

  // Create a link to download it
  var pom = document.createElement("a");
  pom.href = url;
  pom.setAttribute("download", filename);
  pom.click();
}

/**
 * URL Update
 */
function updateURLParameter(
  filters: { [key: string]: string } = {},
  search: string = ""
) {
  if (!currentCategory.value) return;

  var newUrl = location.protocol + "//" + location.host + location.pathname;

  newUrl += "?category=" + currentCategory.value.category_id;

  if (search.length > 0) {
    newUrl += "&search=" + search;
  }

  // check filters
  if (filters) {
    Object.keys(filters).forEach((key) => {
      if (filters[key].length > 0) {
        newUrl += "&" + key + "=" + filters[key];
      }
    });
  }

  window.history.replaceState("", "", newUrl);
}

function getSourceUrl(tester_id: number) {
  const source = testSources.value.find((source) => source.id === tester_id);
  return source ? source.url : "";
}

function getSourceName(tester_id: number) {
  const source = testSources.value.find((source) => source.id === tester_id);
  return source ? source.name : "";
}
</script>

<style>
.v-container {
  padding-top: 30px;
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

a {
  color: #f44336;
}
</style>
