import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import View from "ol/View";
import Map from "ol/Map";
import Geolocation from "ol/Geolocation";
import Feature from "ol/Feature";
import { Vector as VectorLayer, Tile as TileLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { Point } from "ol/geom";
import { Circle, Fill, Icon, Stroke, Style } from "ol/style";
import { Report, ReportIcon } from "src/app/models/report.model";
import { MapService } from "src/app/services/map.service";
import { ReportService } from "src/app/services/report.service";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit, OnDestroy {
  private view: View;
  private map: Map;
  public reportIcons: ReportIcon[] = [];
  private reportUpdatesSubscription: Subscription;

  constructor(
    private mapService: MapService,
    private reportService: ReportService,
    private loadingController: LoadingController
  ) {}

  async ngOnInit(): Promise<void> {
    const loading = await this.loadingController.create({
      spinner: "crescent",
    });

    await loading.present();

    try {
      this.view = this.mapService.setView(
        [-7973514.562897045, -3901570.651086505],
        12
      );

      this.map = this.mapService.setMap(this.view);

      this.setGeolocation();

      const reports = await this.reportService.getReports();
      reports.forEach((report) => {
        this.setReportIcons(report);
      });

      this.reportUpdatesSubscription = this.reportService.getReportsUpdates().subscribe(changes => {
        changes.forEach(change => {
          const report = change.payload.doc.data() as Report;
          const reportId = change.payload.doc.id;
          
          if (change.type === 'added') {
            console.log('Report added:', report);
            this.setReportIcons(report);
          } else if (change.type === 'modified') {
            console.log('Report modified:', report);
            this.updateReportIcons(reportId, report);
          } else if (change.type === 'removed') {
            console.log('Report removed:', reportId);
            this.removeReportIcons(reportId);
          }
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      await loading.dismiss();
    }
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

    this.mapService.createVector(
      this.map,
      new VectorSource({
        features: [reportIcon.iconFeature],
      })
    );

    this.reportIcons.push(reportIcon);
  }

  private updateReportIcons(reportId: string, updatedReport: Report): void {
    const index = this.reportIcons.findIndex(icon => icon.data.id === reportId);
    if (index !== -1) {
      const oldReportIcon = this.reportIcons[index];
      this.mapService.removeVectorFeature(oldReportIcon.iconFeature);
      this.reportIcons.splice(index, 1);
      this.setReportIcons(updatedReport);
    }
  }

  private removeReportIcons(reportId: string): void {
    const index = this.reportIcons.findIndex(icon => icon.data.id === reportId);
    if (index !== -1) {
      const reportIcon = this.reportIcons[index];
      this.mapService.removeVectorFeature(reportIcon.iconFeature);
      this.reportIcons.splice(index, 1);
    }
  }

  ngOnDestroy() {
    if (this.reportUpdatesSubscription) {
      this.reportUpdatesSubscription.unsubscribe();
    }
  }
}
