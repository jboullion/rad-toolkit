import { ref } from "vue";
import { ComponentTableProps } from "./components";

export const basicProperties: ComponentTableProps[] = [
  { title: "Name", sortProperty: "name" },
  { title: "Part #", sortProperty: "partnum" },
  { title: "Manufacturer", sortProperty: "manufacturer" },
  //{ title: "Category", sortProperty: "category_name" },
  { title: "URL", sortProperty: "url" },
  //{ title: "Description", sortProperty: "description" },
];

export const commonProperties: ComponentTableProps[] = [
  { title: "Package", sortProperty: "package" },
  // { title: "Process Node", sortProperty: "process_node" },
  { title: "Qualifications", sortProperty: "qualifications" },
  { title: "Voltage", unit: "V", sortProperty: "voltage" },
  // { title: "Cost", sortProperty: "cost" },
  {
    title: "Total Dose",
    unit: "rad",
    sortProperty: "total_dose",
  },
  {
    title: "Latch-Up Threshold",
    unit: "MeV-cm2/mg",
    sortProperty: "lut_threshold",
  },
  {
    title: "Test Source",
    sortProperty: "tester_id",
  },
];

// System On Chip (SoC)
export const socProperties: ComponentTableProps[] = [];

export const microProcessorProperties: ComponentTableProps[] = [
  { title: "Cores", sortProperty: "cores" },
  { title: "Clock Speed", sortProperty: "clock_speed" },
  { title: "Interfaces", sortProperty: "interfaces" },
  // { title: "Width", sortProperty: "width" },
  // { title: "Cache", sortProperty: "cache" },
  // { title: "RAM Type", sortProperty: "ram_type" },
];

export const microcontrollerProperties: ComponentTableProps[] = [
  { title: "Core Type", sortProperty: "core_type" },
  { title: "Clock Speed", sortProperty: "clock_speed" },
  { title: "Interfaces", sortProperty: "interfaces" },
];

// FPGAs
export const fpgaProperties: ComponentTableProps[] = [
  { title: "Logic Cells", sortProperty: "logic_cells" },
  { title: "IO Count", sortProperty: "io_count" },
];

export const memoryProperties: ComponentTableProps[] = [
  { title: "Memory Capacity", sortProperty: "memory_capacity" },
  { title: "Interface", sortProperty: "interface" },
  { title: "Clock Speed", sortProperty: "clock_speed" },
  { title: "Memory Type", sortProperty: "memory_type" },
  { title: "Memory Format", sortProperty: "memory_format" },
];

export const voltageRegulatorProperties: ComponentTableProps[] = [
  { title: "Output Voltage", sortProperty: "output_voltage" },
  { title: "Output Current", sortProperty: "output_current" },
];

export const SBCProperties: ComponentTableProps[] = [
  { title: "Form Factor", sortProperty: "form_factor" },
  { title: "Processor", sortProperty: "processor" },
  { title: "Interface", sortProperty: "interface" },
  { title: "NV Memory Capacity", sortProperty: "nv_memory_capacity" },
  {
    title: "Volatile Memory Capacity",
    sortProperty: "volatile_memory_capacity",
  },
];

export const interfaceICProperties: ComponentTableProps[] = [
  { title: "Primary Interface", sortProperty: "primary_interface" },
  { title: "Secondary Interface", sortProperty: "secondary_interfaces" },
];

export const diodeProperties: ComponentTableProps[] = [
  { title: "Forward Current", sortProperty: "forward_current" },
  { title: "Forward Voltage", sortProperty: "forward_voltage" },
  { title: "Reverse Voltage", sortProperty: "reverse_voltage" },
  { title: "Type", sortProperty: "type" },
];

export const transistorProperties: ComponentTableProps[] = [
  { title: "Ic", sortProperty: "Ic" },
  { title: "Vceo", sortProperty: "Vceo" },
  { title: "Vcbo", sortProperty: "Vcbo" },
  { title: "Vebo", sortProperty: "Vebo" },
  { title: "Type", sortProperty: "type" },
];

export const jfetProperties: ComponentTableProps[] = [
  { title: "Id", sortProperty: "Id" },
  { title: "Vds", sortProperty: "Vds" },
  { title: "Vgs", sortProperty: "Vgs" },
  { title: "Gate Cutoff", sortProperty: "gate_cutoff" },
  { title: "Type", sortProperty: "type" },
];

export const mosfetProperties: ComponentTableProps[] = [
  { title: "Id", sortProperty: "Id" },
  { title: "Vds", sortProperty: "Vds" },
  { title: "Vgs", sortProperty: "Vgs" },
  { title: "Gate Cutoff", sortProperty: "gate_cutoff" },
  { title: "Type", sortProperty: "type" },
];

export const transistorHideProperties: string[] = ["voltage"];
