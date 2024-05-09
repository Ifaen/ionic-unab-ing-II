import { Coordinate } from "ol/coordinate";

export interface FormReport {
  module: string;
  coordinate: Coordinate;
  photo: string; // Link de la foto
  date: Date;
}

/**
 * Separado en distintos formularios, de tal forma, si necesitan agregar otro parametro,
 * puedan hacerlo sin afectar al resto de formularios.
 */

export interface FormIncendio extends FormReport {
  typeIncident: string;
  knowsGrifo: boolean;
  descriptionGrifo: string;
  description: string;
}

export interface FormAlumbrado extends FormReport {
  typeIncident: string;
  description: string;
}

export interface FormVehicular extends FormReport {
  typeIncident: string;
  description: string;
}

export interface FormBasura extends FormReport {}
