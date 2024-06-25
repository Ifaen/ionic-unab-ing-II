import { Injectable } from "@angular/core";
import View from "ol/View";
import Map from "ol/Map";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { Coordinate } from "ol/coordinate";
import { Geolocation } from "ol";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import { ReportService } from "./report.service";
import { NavController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class MapService {
  private geolocation: Geolocation;

  constructor(
    private reportService: ReportService,
    private navController: NavController
  ) {
    this.geolocation = new Geolocation({
      tracking: true,
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: "EPSG:3857",
    });
  }

  public createVector(map: Map, source: VectorSource): VectorLayer<any> {
    const vectorLayer = new VectorLayer({
      source: source,
    });
    map.addLayer(vectorLayer);
    console.log("Vector layer added to map:", vectorLayer);
    return vectorLayer;
  }

  public getGeolocation(): Geolocation {
    return this.geolocation;
  }

  /**
   * Funcion encargada de volver a la pagina anterior, dependiendo el modulo .
   * @param coordinate coordenadas entregadas en LocationPage
   */
  public goToFormPage(coordinate: Coordinate): void {
    //Guardar un indicador en localStorage antes de navegar de regresso al formulario
    localStorage.setItem("showLocationSelectedToast", "true");
    //Actualizar las coordenadas en formData
    this.reportService.formData.coordinate = coordinate;

    //Navegar de regreso al formulario segun el modulo
    switch (this.reportService.formData.module) {
      case "Alumbrado":
        this.navController.navigateBack(
          "/inicio/modulo-alumbrado/formulario-alum"
        );
        break;
      case "Accidente Vehicular":
        this.navController.navigateBack("/inicio/modulo-accidente-vehicular");
        break;
      case "Incendios":
        this.navController.navigateBack("/inicio/modulo-incendios");
        break;
      case "Basura":
        this.navController.navigateBack("/inicio/modulo-basura");
        break;
      default:
        console.log(module);
        break;
    }
  }
}
