import { Feature } from "ol";
import { Coordinate } from "ol/coordinate";

export interface RecyclingPoint {
  id?: string; // Id creada por firebase
  module: string;
  coordinate: Coordinate;
  photo: string; // Link de la foto
  date: string;
  typeIncident: string;
  description: string;
}
