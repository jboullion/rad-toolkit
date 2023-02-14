import { computed } from "vue";
import {
  commonProperties,
  fpgaProperties,
  memoryProperties,
  microcontrollerProperties,
  microProcessorProperties,
  socProperties,
  voltageRegulatorProperties,
  SBCProperties,
  interfaceICProperties,
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

export const memoryFilters = computed<CategoryFilter[]>(() => {
  return memoryProperties.map((prop) => {
    return {
      name: prop.title,
      key: prop.sortProperty,
      options: [],
    };
  });
});

export const voltageRegulatorFilters = computed<CategoryFilter[]>(() => {
  return voltageRegulatorProperties.map((prop) => {
    return {
      name: prop.title,
      key: prop.sortProperty,
      options: [],
    };
  });
});

export const SBCFilters = computed<CategoryFilter[]>(() => {
  return SBCProperties.map((prop) => {
    return {
      name: prop.title,
      key: prop.sortProperty,
      options: [],
    };
  });
});

export const interfaceICFilters = computed<CategoryFilter[]>(() => {
  return interfaceICProperties.map((prop) => {
    return {
      name: prop.title,
      key: prop.sortProperty,
      options: [],
    };
  });
});
