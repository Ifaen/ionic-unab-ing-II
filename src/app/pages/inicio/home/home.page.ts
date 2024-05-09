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
import { Circle, Fill, Icon, Stroke, Style } from "ol/style";
import { Report } from "src/app/models/report.model";
import { MapService } from "src/app/services/map.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage {
  public geolocation: Geolocation;
  private view: View;
  private map: Map; // Declarar la variable map como propiedad de la clase
  private iconFeatures = [];

  constructor(private mapService: MapService) {}

  private ngOnInit(): void {
    this.view = this.mapService.setView(
      [-7973514.562897045, -3901570.651086505],
      12
    );
    // TODO Borrar esto en build final
    //this.view = this.mapService.setView(
    //  [-7894288.481299472, -7010253.926397604], // Testing para Punta Arenas
    //  12
    //);

    this.map = this.mapService.setMap(this.view);

    this.setGeolocation();

    this.getReports();
  }

  private setGeolocation(): void {
    // Radio y punto de la ubicacion
    let accuracyFeature = new Feature();
    let positionFeature = new Feature();
    positionFeature.setStyle(
      new Style({
        image: new Circle({
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

    this.geolocation = new Geolocation({
      tracking: true, // TODO Cambiar a una funcion cuando se solicite el permiso de trackear ubicacion usando this.geolocation.setTracking(BOOL CON PERMISO);
      trackingOptions: {
        enableHighAccuracy: true, // Habilitar alta precision
      },
      projection: this.view.getProjection(), // Obtener la vista para la geolocalizacion
    });

    // Crear vector para usuario
    let vectorUser = this.mapService.createVector(
      this.map,
      new VectorSource({
        features: [accuracyFeature, positionFeature],
      })
    );

    // Observador que, con cada cambio en la geolocalizacion, actualiza la ubicacion
    this.geolocation.on("change", () =>
      this.getCurrentLocation(accuracyFeature, positionFeature)
    );
  }

  private getCurrentLocation(
    accuracyFeature: Feature,
    positionFeature: Feature
  ): void {
    let accuracy = this.geolocation.getAccuracyGeometry(); // Obtener precision geometrica, siendo el radio alrededor del punto
    accuracyFeature.setGeometry(accuracy); // Setear geometria en feature

    let position = this.geolocation.getPosition(); // Obtener posicion, siendo el punto de ubicacion
    positionFeature.setGeometry(new Point(position)); // Setear geometria de posicion en feature
  }

  private getReports(): void {
    // var reportes = this.reportServices.getReports() // TODO Crear endpoint que obtenga informacion de los reportes
    /**
     * @deprecated reemplazar por FormReport
     */
    var reportes: Report[] = [
      {
        id: 1,
        type: "incendio",
        description: "testing",
        coordinates: [-71.6273, -33.0422],
      },
      {
        id: 2,
        type: "automovilistico",
        description: "testing",
        coordinates: [-71.6223, -33.0472],
      },
      {
        id: 3,
        type: "incendio",
        description: "testing",
        coordinates: [-71.6223, -33.041],
      },
      {
        id: 4,
        type: "automovilistico",
        description: "testing",
        coordinates: [-71.6283, -33.0572],
      },
    ];

    reportes.forEach((reporte) => {
      let src = this.getIcon(reporte.type);

      var reporteFeature = new Feature({
        geometry: new Point(fromLonLat(reporte.coordinates)),
      });
      reporteFeature.setStyle(
        new Style({
          // Le asignamos que sera una imagen y sera de tipo "Icon"
          image: new Icon({
            anchor: [0.5, 46],
            anchorXUnits: "fraction",
            anchorYUnits: "pixels",
            src: src,
            scale: 0.05, // Ajusta el tamaño del icono
          }),
        })
      );
      this.iconFeatures.push(reporteFeature);
    });

    this.mapService.createVector(
      this.map,
      new VectorSource({
        features: this.iconFeatures,
      })
    );
  }

  private getIcon(type: string) {
    switch (type) {
      case "incendio":
        return "assets/icon/fuego.png";
      case "vehicular":
        return "assets/icon/coche.png";
      default:
        return "assets/icon/favicon.png";
    }
  }
}