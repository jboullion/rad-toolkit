import { ref } from "vue";
import { ComponentTableProps } from "./types/components";

export const basicProperties: ComponentTableProps[] = [
  { title: "Name", sortProperty: "name" },
  { title: "Part #", sortProperty: "partnum" },
  { title: "Manufacturer", sortProperty: "manufacturer" },
  { title: "Category", sortProperty: "category_name" },
  { title: "URL", sortProperty: "url" },
  { title: "Description", sortProperty: "description" },
];

export const commonProperties: ComponentTableProps[] = [
  { title: "Package", sortProperty: "package" },
  { title: "Process Node", sortProperty: "process_node" },
  { title: "Qualification", sortProperty: "qualification" },
  { title: "Voltage", sortProperty: "voltage" },
  { title: "Cost", sortProperty: "cost" },
];

export const microProcessorProperties: ComponentTableProps[] = [
  { title: "Cores", sortProperty: "cores" },
  { title: "Clock Speed", sortProperty: "clock_speed" },
  { title: "Interfaces", sortProperty: "interfaces" },
  // { title: "Width", sortProperty: "width" },
  // { title: "Cache", sortProperty: "cache" },
  // { title: "RAM Type", sortProperty: "ram_type" },
];

export const memoryProperties: ComponentTableProps[] = [
  { title: "Memory Capacity", sortProperty: "memory_capacity" },
  { title: "Interface", sortProperty: "interface" },
  { title: "Clock Speed", sortProperty: "clock_speed" },
  { title: "Memory Type", sortProperty: "memory_type" },
  { title: "Memory Format", sortProperty: "memory_format" },
];

export const microcontrollerProperties: ComponentTableProps[] = [
  { title: "Core Type", sortProperty: "core_type" },
  { title: "Clock Speed", sortProperty: "clock_speed" },
  { title: "Interfaces", sortProperty: "interfaces" },
];

// System On Chip (SoC)
export const socProperties: ComponentTableProps[] = [];

// FPGAs
export const fpgaProperties: ComponentTableProps[] = [];
