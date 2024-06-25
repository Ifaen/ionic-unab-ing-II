import { Injectable } from "@angular/core";
import View from "ol/View";
import Map from "ol/Map";
import Overlay from "ol/Overlay";
import Geolocation from "ol/Geolocation";
import Feature from "ol/Feature";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { fromLonLat } from "ol/proj";
import { Point } from "ol/geom";
import { Circle, Fill, Icon, Stroke, Style, Text } from "ol/style";
import { Report, ReportIcon } from "src/app/models/report.model";
import { MapService } from "src/app/services/map.service";
import { ReportService } from "src/app/services/report.service";

@Injectable({
  providedIn: "root",
})
export class HomeService {
  private markerFeatures: { feature: Feature; originalStyle: Style }[] = [];
  public reportIcons: ReportIcon[] = [];
  private tooltipOverlay: Overlay;
  private view: View;
  private map: Map;
  private mapInitialized: Promise<void>;
  private mapInitializedResolve: () => void;

  constructor(
    private mapService: MapService,
    private reportService: ReportService
  ) {
    this.mapInitialized = new Promise((resolve) => {
      this.mapInitializedResolve = resolve;
    });
  }

  async initializeMap(): Promise<void> {
    this.view = this.mapService.setView(
      [-7973514.562897045, -3901570.651086505],
      12
    );

    this.map = this.mapService.setMap(this.view);

    this.mapInitializedResolve(); // Resolver la promesa cuando el mapa esté inicializado
  }

  async setGeolocation(): Promise<void> {
    await this.mapInitialized;

    let accuracyFeature = new Feature();
    let positionFeature = new Feature();
    positionFeature.setStyle(
      new Style({
        image: new Circle({
          radius: 6,
          fill: new Fill({
            color: "#3399CC",
          }),
          stroke: new Stroke({
            color: "#fff",
            width: 1,
          }),
        }),
      })
    );

    let geolocation = this.mapService.getGeolocation();

    let vectorUser = this.mapService.createVector(
      this.map,
      new VectorSource({
        features: [accuracyFeature, positionFeature],
      })
    );

    geolocation.on("change", () => {
      accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
      positionFeature.setGeometry(new Point(geolocation.getPosition()));
    });
  }

  async loadReports(): Promise<void> {
    await this.mapInitialized;

    const reports = await this.reportService.getReports();
    reports.forEach((report) => {
      this.setReportIcons(report);
    });
  }

  setReportIcons(report: Report): void {
    if (!this.map) {
      console.error("Map is not initialized");
      return;
    }

    const src: string = this.reportService.getIcon(report.module);
    let reportFeature = new Feature({
      geometry: new Point(report.coordinate),
    });

    reportFeature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          anchorXUnits: "fraction",
          anchorYUnits: "pixels",
          src: src,
          scale: 0.1,
        }),
      })
    );

    const reportIcon: ReportIcon = {
      data: report,
      iconFeature: reportFeature,
    };

    const vectorSource = new VectorSource({
      features: [reportIcon.iconFeature],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    this.map.addLayer(vectorLayer);
    this.reportIcons.push(reportIcon);
  }

  async addMarkers(): Promise<void> {
    await this.mapInitialized;

    this.addMarker(
      [-71.50008333333334, -33.01727777777778],
      "assets/icon/inorganic-point.png",
      "Recycling",
      "Desechos inorgánicos"
    );
    this.addMarker(
      [-71.52702777777777, -33.01727777777778],
      "assets/icon/industrial-point.png",
      "Triciclos",
      "Desechos industriles "
    );
    this.addMarker(
      [-71.44822222222223, -33.04108333333333],
      "assets/icon/organic-point.png",
      "Estero Vivo",
      "Desechos organicos"
    );
    this.addMarker(
      [-71.6098889, -33.0451667],
      "assets/icon/inorganic-point.png",
      "Cambiaso",
      "Desechos inorganicos"
    );
  }

  addMarker(
    coordinates: [number, number],
    iconUrl: string,
    name: string,
    description: string
  ): void {
    if (!this.map) {
      console.error("Map is not initialized");
      return;
    }

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
        offsetY: 0,
        fill: new Fill({ color: "#000" }),
        stroke: new Stroke({ color: "#fff", width: 2 }),
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
  }

  async initializeTooltip(tooltipElement: HTMLElement): Promise<void> {
    await this.mapInitialized;

    this.tooltipOverlay = new Overlay({
      element: tooltipElement,
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -10],
    });
    this.map.addOverlay(this.tooltipOverlay);

    this.map.on("pointermove", (event) => {
      const feature = this.map.forEachFeatureAtPixel(
        event.pixel,
        (feat) => feat
      );
      if (feature && feature.get("description")) {
        const geometry = feature.getGeometry();
        if (geometry instanceof Point) {
          const coordinates = geometry.getCoordinates();
          this.tooltipOverlay.setPosition(coordinates);
          tooltipElement.innerHTML = feature.get("description") || "";
          tooltipElement.style.display = "block";
        }
      } else {
        tooltipElement.style.display = "none";
      }
    });
  }

  async toggleMarkersVisibility(visible: boolean): Promise<void> {
    await this.mapInitialized;

    this.markerFeatures.forEach(({ feature, originalStyle }) => {
      feature.setStyle(visible ? originalStyle : new Style({}));
    });
  }

  getReportIcons(): ReportIcon[] {
    return this.reportIcons;
  }

  getMap(): { view: View; map: Map } {
    return { view: this.view, map: this.map };
  }
}
