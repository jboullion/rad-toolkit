import {
  Component,
  ComponentInterface,
  ComponentProperties,
} from "@/types/components";

// turn an array of objects into a csv string
export function arrayToCsv(data: any[]): string {
  let headers = Object.keys(data[0]);

  const headerString =
    headers
      .map(String)
      .map((v: string) => v.replaceAll('"', '""'))
      .map((v: string) => `"${v}"`)
      .join(",") + "\r\n";

  return (
    headerString +
    data
      .map((row) => {
        return Object.values(row)
          .map(String)
          .map((v: string) => v.replaceAll('"', '""'))
          .map((v: string) => `"${v}"`)
          .join(",");
      })
      .join("\r\n")
  );
}

// Shorten a large number to a more readable format
export function abbreviateNumber(
  value: number,
  unit: string,
  decimals = 2,
  k = 1000
): string {
  if (!+value) return "0";

  // kilo is lowercase "k". however kiltobytes use uppercase "K"
  const byteUnit = k === 1024 ? "K" : "k";

  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    unit,
    byteUnit + unit,
    "M" + unit,
    "G" + unit,
    "T" + unit,
    "P" + unit,
    "E" + unit,
    "Z" + unit,
    "Y" + unit,
  ];

  const i = Math.floor(Math.log(value) / Math.log(k));

  return `${parseFloat((value / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// determine how to format each property based on its name
export function formatProperty(rawProperty: number, property: string): string {
  if (property === "total_dose") {
    return abbreviateNumber(rawProperty, "rad");
  }

  if (property === "clock_speed") {
    return abbreviateNumber(rawProperty, "Hz");
  }

  if (property === "memory_capacity") {
    return abbreviateNumber(rawProperty, "B", 2, 1024);
  }

  if (
    property === "voltage" ||
    property === "forward_voltage" ||
    property === "reverse_voltage"
  ) {
    return (
      rawProperty.toLocaleString(undefined, { maximumFractionDigits: 0 }) + " V"
    );
  }

  if (property === "forward_current") {
    return (
      rawProperty.toLocaleString(undefined, { maximumFractionDigits: 0 }) + " A"
    );
  }

  return rawProperty.toString();
}

// Check for a prefix and remove it if present. Then format the number and reapply the prefix
export function prefixNumber(value: any, property: string): string {
  let prefix = value.toString()[0];

  // some values have a prevfix but should still be abbreviated if possible
  if (prefix === ">" || prefix === "<" || prefix === "~") {
    value = Number(value.toString().slice(1));
  } else {
    prefix = "";
  }

  if (typeof value === "number") {
    return prefix + formatProperty(value, property);
  }

  return value;
}

// Sometimes we want to format or otherwise edit the display of a value in the table
export function displayComponentProperty(
  component: Component,
  property: string
): string {
  let rawProperty = component.properties[property as keyof ComponentProperties];

  if (!rawProperty) return "";

  if (
    property === "primary_interface" &&
    // @ts-ignore
    rawProperty.property
  ) {
    let interfaceProperty = rawProperty as ComponentInterface;

    return interfaceProperty.quantity + "x " + interfaceProperty.property;
  }

  if (Array.isArray(rawProperty)) {
    // @ts-ignore
    if (rawProperty[0] && rawProperty[0].property) {
      let interfaceArray: string[] = [];

      // @ts-ignore
      rawProperty.forEach((p: ComponentInterface) => {
        interfaceArray.push(p.quantity + "x " + p.property);
      });

      rawProperty = interfaceArray;
    }

    return rawProperty
      .map((p) => {
        return p;
      })
      .join(", ");
  }

  return rawProperty.toString();
}

export function displayFileName(file: string): string {
  return file.split("/").pop() || "";
}
