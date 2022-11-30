import { computed } from "vue";
import {
  commonProperties,
  fpgaProperties,
  memoryProperties,
  microcontrollerProperties,
  microProcessorProperties,
  socProperties,
} from "./properties";
import { CategoryFilter } from "./types/components";

export const commonFilters = computed<CategoryFilter[]>(() => {
  return commonProperties.map((prop) => {
    return {
      name: prop.title,
      key: prop.sortProperty,
      options: [],
    };
  });
});

export const microProcessorFilters = computed<CategoryFilter[]>(() => {
  return microProcessorProperties.map((prop) => {
    return {
      name: prop.title,
      key: prop.sortProperty,
      options: [],
    };
  });
});

export const memoryFilters = computed<CategoryFilter[]>(() => {
  return memoryProperties.map((prop) => {
    return {
      name: prop.title,
      key: prop.sortProperty,
      options: [],
    };
  });
});

export const microControllerFilters = computed<CategoryFilter[]>(() => {
  return microcontrollerProperties.map((prop) => {
    return {
      name: prop.title,
      key: prop.sortProperty,
      options: [],
    };
  });
});

export const socFilters = computed<CategoryFilter[]>(() => {
  return socProperties.map((prop) => {
    return {
      name: prop.title,
      key: prop.sortProperty,
      options: [],
    };
  });
});

export const fpgaFilters = computed<CategoryFilter[]>(() => {
  return fpgaProperties.map((prop) => {
    return {
      name: prop.title,
      key: prop.sortProperty,
      options: [],
    };
  });
});
