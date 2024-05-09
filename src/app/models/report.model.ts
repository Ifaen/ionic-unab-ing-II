import { Coordinate } from "ol/coordinate";
/**
 * @deprecated cambiar por formsReport
 */
export interface Report {
  id: number;
  type: string;
  description: string;
  coordinates: Coordinate;
}
