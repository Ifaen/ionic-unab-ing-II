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
import { Report, ReportIcon } from "src/app/models/report.model";
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
  public reportIcons: ReportIcon[] = [];

  constructor(
    private mapService: MapService,
    private reportService: ReportService,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) {}

  private async ngOnInit(): Promise<void> {
    const loading = await this.loadingController.create({
      spinner: "crescent",
    });

    await loading.present();

    try {
      //este "Extent" limita el mapa, por lo que se pueden modificar las coordenadas
      //yo puse el sur de viña y norte de valpo y queda como se ve
      //importante recalcar que las coordenadas del mapa son especiales, por lo que se tiene que ver bien
      //que coordenadas colocar si se cambiará
      const extent = [
        fromLonLat([-71.7372, -33.1019]), // Sur: Viña del Mar
        fromLonLat([-71.4964, -32.9486]), // Norte : Valparaíso
      ];

      this.view = new View({
        center: fromLonLat([-71.6226, -33.0469]), // Center point
        zoom: 12,
        extent: [
          extent[0][0],
          extent[0][1], // Southwest corner
          extent[1][0],
          extent[1][1], // Northeast corner
        ],
        //aca como su nombre dice, se coloca el zoom minimo y maximo, si desean que las calles se vean
        //con mas zoop se mueve el maxzoom
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

      this.setGeolocation();

      const reports = await this.reportService.getReports();

      reports.forEach((report) => this.setReportIcons(report)); // Crear iconos de reportes

      this.map.on("singleclick", (event) => this.tapMapEvent(event)); // Asignar singleclick event a mapa
    } catch (error) {
      console.log(error);
    } finally {
      await loading.dismiss();
    }
  }

  /**
   * Evento tap/singleclick del mapa, que al ser activado, selecciona cada objeto del tipo Feature,
   * el cual es comparado con la lista de reportes. Si hay una coincidencia, se abre un modal.
   * @param event Evento del mapa
   */
  private tapMapEvent(event: MapBrowserEvent<any>) {
    this.map.forEachFeatureAtPixel(event.pixel, (feature) =>
      this.reportIcons.forEach((report) => {
        if (report.iconFeature == feature) this.openModal(report.data);
      })
    );
  }

  /**
   * Abre un modal llamando al InformationModalComponent, el cual muestra información del reporte clickeado / tappeado
   * @param data Informacion del reporte clickeado
   */
  private async openModal(data: Report) {
    const modal = await this.modalController.create({
      component: InformationModalComponent,
      cssClass: "custom-modal",
      componentProps: {
        data: data,
      },
    });

    await modal.present();
  }

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

    const reportIcon: ReportIcon = {
      data: report,
      iconFeature: reportFeature,
    };

    // Crear vector y agregarlo en el mapa
    this.mapService.createVector(
      this.map,
      new VectorSource({
        features: [reportIcon.iconFeature],
      })
    );

    this.reportIcons.push(reportIcon);
  }
}
