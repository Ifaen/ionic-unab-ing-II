import { Feature } from "ol";
import { Coordinate } from "ol/coordinate";

export interface Report {
  id?: string; // Id creada por firebase
  user?: string;
  module: string;
  coordinate: Coordinate;
  photo: string; // Link de la foto
  date: string;
}

/**
 * Separado en distintos formularios, de tal forma, si necesitan agregar otro parametro,
 * puedan hacerlo sin afectar al resto de formularios.
 */

export interface ReportIncendio extends Report {
  typeIncident: string;
  knowsGrifo: boolean;
  descriptionGrifo: string;
  description: string;
}

export interface ReportAlumbrado extends Report {
  typeIncident: string;
  description: string;
}

export interface ReportVehicular extends Report {
  typeIncident: string;
  description: string;
}

export interface ReportBasura extends Report {
  typeIncident: string;
  description: string;
}

export interface ReportIcon {
  data: Report;
  iconFeature: Feature;
}
