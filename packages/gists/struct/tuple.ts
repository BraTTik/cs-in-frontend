import { Structure, type StructField } from "./structure.ts";

export const Tuple = (...types: StructField[]) => {
  const scheme = types.reduce((acc, type, index) => {
    acc[index] = type;
    return acc;
  }, {} as Record<number, StructField>);

  return new Structure(scheme);
}
