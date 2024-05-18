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
import { ReportService } from "src/app/services/report.service";

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

  constructor(
    private mapService: MapService,
    private reportService: ReportService
  ) {}

  private ngOnInit(): void {
    this.view = this.mapService.setView(
      [-7973514.562897045, -3901570.651086505],
      12
    );

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
    this.geolocation.on("change", () => {
      // Obtener precision geometrica y posicion
      accuracyFeature.setGeometry(this.geolocation.getAccuracyGeometry());
      positionFeature.setGeometry(new Point(this.geolocation.getPosition()));
    });
  }

  private async getReports(): Promise<void> {
    let reports = await this.reportService.getReports();

    reports.forEach((report) => {
      let src = this.getIcon(report.module);

      var reporteFeature = new Feature({
        geometry: new Point(report.coordinate),
      });
      reporteFeature.setStyle(
        new Style({
          // Le asignamos que sera una imagen y sera de tipo "Icon"
          image: new Icon({
            anchor: [0.5, 46],
            anchorXUnits: "fraction",
            anchorYUnits: "pixels",
            src: src,
            scale: 0.08, // Ajusta el tamaño del icono
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

  private getIcon(module: string): string {
    switch (module) {
      case "alumbrado":
        return "assets/icon/icon-modulo-1.png";
      case "accidente-vehicular":
        return "assets/icon/icon-modulo-2.png";
      case "incendios":
        return "assets/icon/icon-modulo-3.png";
      case "basura":
        return "assets/icon/icon-modulo-4.png";
      default:
        console.log(module);
        return "";
    }
  }
}
