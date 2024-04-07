const DPI = 97.7; // replace 97.7 with the actual DPI if it's different
const DISTANCE_MM = 500; // screen distance in mm, 50cm = 500mm
const MM_PER_PIXEL = 25.4 / DPI;

export class Utils {
  static pixelsToPrism(gap) {
    return 100 * (gap * MM_PER_PIXEL / DISTANCE_MM);
  }

  static prismToPixels(prism) {
    return (prism * DISTANCE_MM) / (100 * MM_PER_PIXEL);
  }
}