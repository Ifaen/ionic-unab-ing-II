import { Component, OnInit, inject, ChangeDetectorRef } from "@angular/core";
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
import { Report, ReportVector } from "src/app/models/report.model";
import { MapService } from "src/app/services/map.service";
import { ReportService } from "src/app/services/report.service";
import { LoadingController, ModalController } from "@ionic/angular";
import { MapBrowserEvent } from "ol";
import { InformationModalComponent } from "src/app/shared/component/information-modal/information-modal.component";

@Component({
  selector: "app-map",
  templateUrl: "./map.page.html",
  styleUrls: ["./map.page.scss"],
})
export class MapPage {
  private view: View;
  private map: Map;
  public reportVectors: ReportVector[] = [];

  constructor(
    private mapService: MapService,
    private reportService: ReportService,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private cdr: ChangeDetectorRef // Inyecta ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    const loading = await this.loadingController.create({
      spinner: "crescent",
    });

    await loading.present();

    try {
      await this.setMap();

      this.setGeolocation();

      const reports = await this.reportService.getReports();

      reports.forEach((report) => this.setReportIcons(report)); // Crear iconos de reportes

      this.map.on("singleclick", (event) => this.tapMapEvent(event)); // Asignar singleclick event a mapa
    } catch (error) {
      console.log(error);
    } finally {
      await loading.dismiss();
    }

    setInterval(() => {
      this.checkReports();
    }, 1 * 60 * 1000); // Revisar cada minuto
  }

  /**
   * Crear mapa y vista, estableciendo el centro inicial y los limites del mapa
   */
  private async setMap(): Promise<void> {
    // Coordenadas que definen los limites del mapa desde Viña hasta Valparaíso
    const extent = [
      fromLonLat([-71.7372, -33.1019]), // Sur: Viña del Mar
      fromLonLat([-71.4964, -32.9486]), // Norte : Valparaíso
    ];

    this.view = new View({
      center: fromLonLat([-71.6226, -33.0469]), // centro inicial
      extent: [extent[0][0], extent[0][1], extent[1][0], extent[1][1]],
      zoom: 12, // default zoom
      minZoom: 10, // zoom minimo
      maxZoom: 15, // zoom maximo
    });

    this.map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: this.view,
    });
    this.mapService.setMap(this.map); // Pasar la referencia del mapa al servicio
    this.mapService.addMarkers(); // Añadir los marcadores iniciales
  }

  /**
   * Evento tap/singleclick del mapa, que al ser activado, selecciona cada objeto del tipo Feature,
   * el cual es comparado con la lista de reportes. Si hay una coincidencia, se abre un modal.
   * @param event Evento del mapa
   */
  private tapMapEvent(event: MapBrowserEvent<any>) {
    this.map.forEachFeatureAtPixel(event.pixel, (feature) =>
      this.reportVectors.forEach((item) => {
        if (item.vector.getFeatures()[0] == feature)
          this.openModal(item.report);
      })
    );
  }

  /**
   * Abre un modal llamando al InformationModalComponent, el cual muestra información del reporte clickeado / tappeado
   * @param report Informacion del reporte clickeado
   */
  private async openModal(report: Report) {
    const modal = await this.modalController.create({
      component: InformationModalComponent,
      cssClass: "custom-modal",
      componentProps: {
        report: report,
      },
    });

    await modal.present();
  }

  /**
   * Establecer la geolocalización en el mapa, creando un vector que se centre alrededor del usuario
   * y se actualice cada cierto tiempo estimado pre-establecido por la API (cerca de cada 3 segundos)
   */
  private setGeolocation(): void {
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

    this.mapService.createVector(
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

  private setReportIcons(report: Report): void {
    const src: string = this.reportService.getIcon(report.module);

    let reportFeature = new Feature({
      geometry: new Point(report.coordinate),
    });

    reportFeature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 50],
          anchorXUnits: "fraction",
          anchorYUnits: "pixels",
          src: src,
          scale: 0.08,
        }),
      })
    );

    const item: ReportVector = {
      report: report,
      vector: new VectorSource({
        features: [reportFeature],
      }),
    };

    // Crear vector y agregarlo en el mapa
    this.mapService.createVector(this.map, item.vector);

    this.reportVectors.push(item);
    this.mapService.addMarkers();

    // Forzar la detección de cambios
    this.cdr.detectChanges();
  }

  /**
   * Encargado de revisar si hay reportes nuevos, a traves de comparar los reportes actuales en el mapa.
   * Si el id no coincide con ninguno de los reportes en mapa, es que es un reporte nuevo.
   * Luego, verifica el vencimiento de todos los reportes, si su fecha de vencimiento supera a la fecha actual
   * lo elimina del mapa y llama a la funcion para remover reportes del servicio reportes.
   */
  private async checkReports() {
    const timeLimit = 12; // horas de tiempo limite antes de expirar reporte
    const timeNow = new Date();

    const reports = await this.reportService.getReports(); // Llamar nuevamente endpoint

    // Verificar si es nuevo
    reports.forEach((report) => {
      let isNew = true;

      this.reportVectors.forEach((item) => {
        if (report.id === item.report.id) isNew = false;
      });

      if (isNew) this.setReportIcons(report); // Si es nuevo, agregar al reporte
    });

    // Verificar si ha expirado
    for (let i = 0; i < this.reportVectors.length; i++) {
      let timeReport = new Date(this.reportVectors[i].report.date); // Debido a que report.date es string o Date, necesita crearse un nuevo Date object
      timeReport.setHours(timeReport.getHours() + timeLimit);

      // Si el tiempo del reporte incrementado por 'timeLimit' horas sigue siendo menor al tiempo actual
      if (timeReport < timeNow) {
        // Eliminar de la base de datos
        const removed = await this.reportService.removeReport(
          this.reportVectors[i].report
        );

        // Si es que se pudo remover el reporte de la base de lados
        if (removed) {
          this.reportVectors[i].vector.clear(); // Eliminar del mapa
          this.reportVectors.splice(i, 1); // Eliminar de la lista
          i--; // Reducir el contador en 1, debido a que la lista se ha acortado

          // Forzar la detección de cambios
          this.cdr.detectChanges();
        }
      }
    }
  }

  private checkReportsPeriodically() {
    setInterval(() => {
      this.checkReports();
    }, 1 * 60 * 1000); // Revisar cada minuto
  }
}
