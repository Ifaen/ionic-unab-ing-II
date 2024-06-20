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

  public setView(coordinates: Coordinate, zoom: number): View {
    return new View({
      center: coordinates,
      zoom: zoom,
    });
  }

  public setMap(view: View): Map {
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: "map",
      view: view,
    });
    console.log("Map initialized with view:", view);
    return map;
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

  goToFormPage(coordinate: Coordinate) {
    localStorage.setItem("showLocationSelectedToast", "true");
    if (this.reportService.formData.module == "alumbrado") {
      this.navController.navigateBack(
        "/inicio/modulo-alumbrado/formulario-alum"
      );
    } else {
      this.navController.navigateBack(
        "/inicio/modulo-" + this.reportService.formData.module
      );
    }
    this.reportService.formData.coordinate = coordinate;
  }
}
