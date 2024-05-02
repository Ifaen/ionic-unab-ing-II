import { Component, OnInit, inject } from "@angular/core";
// importaciones de la biblioteca ol
import View from "ol/View";
import Map from "ol/Map";
import Geolocation from "ol/Geolocation";
import Feature from "ol/Feature";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { fromLonLat } from "ol/proj";
import { Point, Geometry } from "ol/geom";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage {
  private map: Map; // Declarar la variable map como propiedad de la clase
  private view: View;
  private geolocation: Geolocation;
  // Radio y punto de la ubicacion
  private accuracyFeature: Feature;
  private positionFeature: Feature;

  constructor() {
    this.accuracyFeature = new Feature();
    this.positionFeature = new Feature();
    this.positionFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 6, // Radio del punto de la ubicacion
          fill: new Fill({
            color: "#3399CC", // Color del punto
          }),
          stroke: new Stroke({
            color: "#fff", // Color del radio
            width: 1, // Ancho del borde del radio
          }),
        }),
      })
    );
  }

  ngOnInit() {
    this.view = new View({
      center: fromLonLat([-71.6273, -33.0472]), // Coordenadas de Valparaiso para ingresar y ver directamente a la region
      //center: fromLonLat([-70.9377743, -53.1989798]), // Para testing, coordenadas de Punta Arenas
      zoom: 12,
    });

    this.createMap(); // Crear mapa

    this.setGeolocation(); // TODO Solicitar permisos de geolocalizacion a usuario

    // TODO Obtener reportes activos y crear vectores
  }

  createMap() {
    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(), //invocacion de la biblioteca para hacer visual el mapa
        }),
      ],
      target: "map",
      view: this.view,
    });
  }

  setGeolocation() {
    this.geolocation = new Geolocation({
      tracking: true, // TODO Cambiar a una funcion cuando se solicite el permiso de trackear ubicacion usando this.geolocation.setTracking(BOOL CON PERMISO);
      trackingOptions: {
        enableHighAccuracy: true, // Habilitar alta precision
      },
      projection: this.view.getProjection(), // Obtener la vista para la geolocalizacion
    });

    let vectorUser = this.createVector(); // Crear vector para usuario

    this.geolocation.on("change", () => this.getCurrentLocation()); // Observador que, cada cambio en la geolocalizacion, actualiza la ubicacion
  }

  getCurrentLocation(): void {
    let accuracy = this.geolocation.getAccuracyGeometry(); // Obtener precision geometrica, siendo el radio alrededor del punto
    this.accuracyFeature.setGeometry(accuracy); // Setear geometria en feature

    let position = this.geolocation.getPosition(); // Obtener posicion, siendo el punto de ubicacion
    this.positionFeature.setGeometry(position ? new Point(position) : null); // Setear geometria de posicion en feature
  }

  createVector() {
    return new VectorLayer({
      map: this.map,
      source: new VectorSource({
        features: [this.accuracyFeature, this.positionFeature],
      }),
    });
  }
}
