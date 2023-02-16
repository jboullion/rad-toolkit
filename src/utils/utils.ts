export function abbreviateNumber(
  value: number,
  unit: string,
  decimals = 2,
  k = 1000
): string {
  if (!+value) return "0";

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

  if (property === "voltage") {
    return rawProperty + " V";
  }

  return rawProperty.toString();
}
