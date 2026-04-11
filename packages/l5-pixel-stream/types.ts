export type RGBA = [red: number, green: number, blue: number, alpha: number];

type RowMajor = "RowMajor";
type ColumnMajor = "ColumnMajor";
export type TraverseMode = RowMajor | ColumnMajor;

export const ROW_MAJOR: RowMajor = "RowMajor";
export const COLUMN_MAJOR: ColumnMajor = "ColumnMajor";

export interface PixelStream {
  getPixel(x: number, y: number): RGBA;
  setPixel(x: number, y: number, rgba: RGBA): RGBA;
  forEach(mode: TraverseMode, callback: (rgba: RGBA, x: number, y: number) => void): void
}
5
