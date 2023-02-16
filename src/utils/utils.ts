export function abbreviateBaseTen(
  value: number,
  unit: string,
  decimals = 2
): string {
  if (!+value) return "0";

  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    unit,
    "K" + unit,
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

export function abbreviateBytes(bytes: number, decimals = 2): string {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatProperty(rawProperty: number, property: string): string {
  if (property === "total_dose") {
    return abbreviateBaseTen(rawProperty, "rad");
  }

  if (property === "clock_speed") {
    return abbreviateBaseTen(rawProperty, "Hz");
  }

  if (property === "memory_capacity") {
    return abbreviateBytes(rawProperty);
  }

  if (property === "voltage") {
    return rawProperty + " V";
  }

  return rawProperty.toString();
}
