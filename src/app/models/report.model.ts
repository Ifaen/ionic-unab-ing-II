import { Coordinate } from "ol/coordinate";

export interface Report {
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
