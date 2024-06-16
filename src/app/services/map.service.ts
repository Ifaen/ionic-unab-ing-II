import { Injectable } from "@angular/core";
import Feature from "ol/Feature";
// importaciones de la biblioteca ol
import View from "ol/View";
import Map from "ol/Map";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { Coordinate } from "ol/coordinate";
import { ActivatedRoute, Router } from "@angular/router";
import { Geolocation } from "ol";
import { ReportService } from "./report.service";
import { NavController } from "@ionic/angular";
import {
  ReportAlumbrado,
  ReportBasura,
  ReportIncendio,
  ReportVehicular,
} from "../models/report.model";

@Injectable({
  providedIn: "root",
})
export class MapService {
  private geolocation: Geolocation;
  private vectorLayers: VectorLayer<VectorSource>[] = [];

  constructor(
    private router: Router,
    private navController: NavController,
    private reportService: ReportService
  ) {
    this.geolocation = new Geolocation({
      tracking: true, // TODO Cambiar a una funcion cuando se solicite el permiso de trackear ubicacion usando this.geolocation.setTracking(BOOL CON PERMISO);
      trackingOptions: {
        enableHighAccuracy: true, // Habilitar alta precision
      },
      projection: new View().getProjection(), // Obtener la vista para la geolocalizacion
    });
  }

  public setView(coordinates: Coordinate, zoom: number): View {
    return new View({
      center: coordinates, // Coordenadas de Valparaiso para ingresar y ver directamente a la region
      zoom: zoom,
    });
  }

  public setMap(view: View): Map {
    return new Map({
      layers: [
        new TileLayer({
          source: new OSM(), //invocacion de la biblioteca para hacer visual el mapa
        }),
      ],
      target: "map",
      view: view,
    });
  }

  public createVector(map: Map, source: VectorSource): VectorLayer<any> {
    return new VectorLayer({
      map: map,
      source: source,
    });
  }



public removeVectorFeature(feature: Feature): void {
  this.vectorLayers.forEach(layer => {
    const source = layer.getSource();
    if (source) {
      source.removeFeature(feature);
    }
  });
}
  

  public getGeolocation(): Geolocation {
    return this.geolocation;
  }

  /**
   * Funcion encargada de volver a la pagina anterior.
   * En el caso de module-alumbrado, se devuelve a una subpagina.
   * @param coordinate coordenadas entregadas en LocationPage
   */
  goToFormPage(coordinate: Coordinate) {
    //TODO PROBANDO NOTIFICACION --> FUNCIONA
    //Guardar un indicador en localStorage antes de navegar de regresso al formulario
    localStorage.setItem("showLocationSelectedToast", "true");
    //TODO
    //Navegar de regreso al formulario segun el modulo
    if (this.reportService.formData.module == "alumbrado") {
      this.navController.navigateBack(
        "/inicio/modulo-alumbrado/formulario-alum"
      );
    } else {
      this.navController.navigateBack(
        "/inicio/modulo-" + this.reportService.formData.module
      );
    }
    //Actualizar las coordenadas en formData
    this.reportService.formData.coordinate = coordinate;
  }
}
