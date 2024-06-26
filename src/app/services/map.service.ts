import { Injectable } from "@angular/core";
// importaciones de la biblioteca ol
import View from "ol/View";
import Map from "ol/Map";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { Coordinate } from "ol/coordinate";
import { ActivatedRoute, Router } from "@angular/router";
import { Geolocation } from "ol";
import { ReportService } from "./report.service";
import Feature from "ol/Feature";
import { Point } from "ol/geom";
import { Circle, Fill, Icon, Stroke, Style, Text } from "ol/style";
import { fromLonLat } from "ol/proj";
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
  private map: Map;
  private markerFeatures: { feature: Feature; originalStyle: Style }[] = [];

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

  public createVector(map: Map, source: VectorSource): VectorLayer<any> {
    return new VectorLayer({
      map: map,
      source: source,
    });
  }
  public setMap(map: Map): void {
    this.map = map;
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

  public addMarkers(): void {
    this.addMarker(
      [-71.50008333333334, -33.01727777777778],
      "assets/icon/inorganic-point.png",
      "Recycling V Región",
      "inorgánico"
    );
    this.addMarker(
      [-71.52702777777777, -33.01727777777778],
      "assets/icon/industrial-point.png",
      "TRICICLOS",
      "Industrial"
    );
    this.addMarker(
      [-71.44822222222223, -33.04108333333333],
      "assets/icon/organic-point.png",
      "Estero Vivo",
      " Orgánico"
    );
    this.addMarker(
      [-71.6098889, -33.0451667],
      "assets/icon/inorganic-point.png",
      "CAMBIASO",
      "inorgánico "
    );
  }

  private addMarker(
    coordinates: [number, number],
    iconUrl: string,
    name: string,
    description: string
  ): void {
    if (!this.map) {
      console.error("Map is not initialized");
      return;
    }
    console.log(`Adding marker: ${name} at ${coordinates}`);
    const marker = new Feature({
      geometry: new Point(fromLonLat(coordinates)),
    });

    marker.set("description", description);

    const markerStyle = new Style({
      image: new Icon({
        src: iconUrl,
        anchor: [0.5, 1],
        scale: 0.04,
      }),
      text: new Text({
        text: name,
        offsetY: 25,
        fill: new Fill({ color: "#000" }),
        stroke: new Stroke({ color: "#fff", width: 2 }),
        backgroundFill: new Fill({
          color: "rgba(255, 255, 255, 0.7)",
        }),
        padding: [2, 2, 2, 2],
      }),
    });

    marker.setStyle(markerStyle);

    const vectorSource = new VectorSource({
      features: [marker],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    this.map.addLayer(vectorLayer);
    this.markerFeatures.push({ feature: marker, originalStyle: markerStyle });
    console.log(`Marker added: ${name}`);
  }
}
