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
import { CategoryFilter, ComponentTableProps } from "./types/components";

export const commonFilters = computed<CategoryFilter[]>(() => {
  return setupFilters(commonProperties);
});

export const microProcessorFilters = computed<CategoryFilter[]>(() => {
  return setupFilters(microProcessorProperties);
});

export const microControllerFilters = computed<CategoryFilter[]>(() => {
  return setupFilters(microcontrollerProperties);
});

export const socFilters = computed<CategoryFilter[]>(() => {
  return setupFilters(socProperties);
});

export const fpgaFilters = computed<CategoryFilter[]>(() => {
  return setupFilters(fpgaProperties);
});

export const memoryFilters = computed<CategoryFilter[]>(() => {
  return setupFilters(memoryProperties);
});

export const voltageRegulatorFilters = computed<CategoryFilter[]>(() => {
  return setupFilters(voltageRegulatorProperties);
});

export const SBCFilters = computed<CategoryFilter[]>(() => {
  return setupFilters(SBCProperties);
});

export const interfaceICFilters = computed<CategoryFilter[]>(() => {
  return setupFilters(interfaceICProperties);
});

function setupFilters(properties: ComponentTableProps[]) {
  return properties.map((prop) => {
    return {
      name: prop.title,
      key: prop.sortProperty,
      options: [],
    };
  });
}
