import { Coordinate } from "ol/coordinate";

export interface Report {
  id: number;
  type: string;
  description: string;
  coordinates: Coordinate;
}
