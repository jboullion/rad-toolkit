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
};

export type ComponentTableProps = {
  title: string;
  unit?: string;
  sortProperty: string;
  sortAscending?: boolean | null;
  //onSort: (sortProperty: string, sortAscending: boolean) => void;
};

// NOTE: This is not accurate for all components.  It is only accurate for some components.
export type ComponentProperties = {
  package: string;
  process_node: string;
  clock_speed: string;
  voltage: string;
  cores: string;
  width: string;
  cache: string;
  interfaces: string;
  ram_type: string;
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
