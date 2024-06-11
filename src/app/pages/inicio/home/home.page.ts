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
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage {
  private view: View;
  private map: Map; // Declarar la variable map como propiedad de la clase
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
      // Centrar vista
      this.view = this.mapService.setView(
        [-7973514.562897045, -3901570.651086505],
        12
      );
      this.map = this.mapService.setMap(this.view); // Crear mapa y asignar vista

      this.setGeolocation(); // Obtener y configurar la geologalizacion

      const reports = await this.reportService.getReports(); // Obtener lista de reportes de report collection

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

    let geolocation = this.mapService.getGeolocation(); // Obtener geolocalizacion del servicio

    // Crear vector para usuario
    let vectorUser = this.mapService.createVector(
      this.map,
      new VectorSource({
        features: [accuracyFeature, positionFeature],
      })
    );

    // Observador que, con cada cambio en la geolocalizacion, actualiza la ubicacion
    geolocation.on("change", () => {
      // Obtener precision geometrica y posicion
      accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
      positionFeature.setGeometry(new Point(geolocation.getPosition()));
    });
  }

  private setReportIcons(report: Report): void {
    const src: string = this.reportService.getIcon(report.module); // Obtener el icon del reporte segun su modulo

    // Asignar las coordendas al icono del reporte
    let reportFeature = new Feature({
      geometry: new Point(report.coordinate),
    });

    // Asignarle un diseño al icono del reporte
    reportFeature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 50], // TODO Arreglar centrado del icono
          anchorXUnits: "fraction",
          anchorYUnits: "pixels",
          src: src,
          scale: 0.08, // Ajusta el tamaño del icono
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

    // Enviar a la lista la data del reporte junto su icono
    this.reportIcons.push(reportIcon);
  }
}
