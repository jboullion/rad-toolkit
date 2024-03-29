export type Component = {
  component_id: number;
  partnum: string;
  name: string;
  description: string;
  manufacturer_id: number;
  category_id: number;
  status: string;
  url: string;
  category_name: string;
  manufacturer: string;
  properties: ComponentProperties;
  files: string[];
  tester_id: number;
};

export type ComponentTableProps = {
  title: string;
  unit?: string;
  sortProperty: string;
  sortAscending?: boolean | null;
  format?: (value: any) => string;
  //onSort: (sortProperty: string, sortAscending: boolean) => void;
};

export type ComponentProperties = {
  package: string | string[];
  process_node: string;
  qualifications: string | string[];
  voltage: number | number[] | (number | string)[];
  cost: string;
  total_dose: number | string;
  lut_threshold: number | string;
  cores: string | string[];
  clock_speed: number;
  interfaces: ComponentInterface[];
  width: string;
  ram_type: string;
  memory_capacity: number;
  interface: string;
  memory_type: string;
  memory_format: string;
  output_voltage: number | string;
  output_current: number | string;
  logic_cells: number;
  io_count: number;
  form_factor: string;
  processor: string | string[];
  nv_memory_capacity: string;
  volatile_memory_capacity: string;
  primary_interface: ComponentInterface;
  secondary_interfaces: ComponentInterface[];
  forward_voltage: number;
  reverse_voltage: number;
  forward_current: number;
  tester_id: number;
};

export type ComponentInterface = {
  property: string;
  quantity: number;
};

export type ComponentCategory = {
  category_id: number;
  name: string;
};

export type CategoryFilter = {
  name: string;
  key: string;
  options: string[];
};

export enum ComponentCategoryEnum {
  SOC = "System On Chip (SoC)",
  Microprocessors = "Microprocessors",
  Microcontrollers = "Microcontrollers",
  FPGA = "FPGAs",
  Memory = "Memory",
  VoltageRegulator = "Voltage Regulators",
  SBC = "SBCs",
  InterfaceIC = "Interface ICs",
  Diodes = "Diodes",
  Transistors = "Transistors - Bipolar",
  JFET = "Transistors - JFET",
  MOSFET = "Transistors - MOSFET",
}
// export enum ComponentCategoryEnum {
//   Microprocessor = 1,
//   Memory = 2,
//   PowerRegulation = 3,
//   Microcontroller = 4,
//   Sensors = 5,
//   DiscreteSemiconductors = 6,
//   OBCBoards = 7,
//   LogicGates = 8,
//   ADCs = 9,
//   DACs = 10,
//   FPGAs = 11,
// }
// Core(s)
// Clock Speed
// Interfaces
// Width
// Cache
// RAM Type

export const defaultComponent: Component = {
  component_id: 0,
  partnum: "",
  name: "",
  description: "",
  manufacturer_id: 0,
  category_id: 0,
  status: "",
  url: "",
  category_name: "",
  manufacturer: "",
  properties: {
    package: "",
    process_node: "",
    qualifications: "",
    voltage: "",
    cost: "",
    total_dose: "",
    lut_threshold: "",
    cores: "",
    clock_speed: "",
    interfaces: [],
    width: "",
    ram_type: "",
    memory_capacity: "",
    interface: "",
    memory_type: "",
    memory_format: "",
    output_voltage: "",
    output_current: "",
    logic_cells: "",
    io_count: "",
    form_factor: "",
    processor: "",
    nv_memory_capacity: "",
    volatile_memory_capacity: "",
    primary_interface: {
      name: "",
      type: "",
      speed: "",
      width: "",
    },
    secondary_interfaces: [],
    forward_voltage: "",
    reverse_voltage: "",
    forward_current: "",
  } as unknown as ComponentProperties,
  files: [],
  tester_id: 0,
};

export type Source = {
  id: number;
  name: string;
  url: string;
};
