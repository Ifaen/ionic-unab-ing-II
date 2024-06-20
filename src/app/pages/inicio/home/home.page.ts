import { Component, OnInit, AfterViewInit } from "@angular/core";
import { LoadingController } from "@ionic/angular";
import { HomeService } from "src/app/services/home.service";
import { ReportIcon } from "src/app/models/report.model";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit, AfterViewInit {
  private markersVisible: boolean = true;
  public reportIcons: ReportIcon[] = [];

  constructor(
    private homeService: HomeService,
    private loadingController: LoadingController
  ) {}

  async ngOnInit(): Promise<void> {
    const loading = await this.loadingController.create({
      spinner: "crescent",
    });

    await loading.present();

    try {
      await this.homeService.initializeMap(); // Initialize the map
      this.homeService.setGeolocation();
      this.homeService.addMarkers();
      await this.homeService.loadReports();
      this.reportIcons = this.homeService.getReportIcons();
    } catch (error) {
      console.log(error);
    } finally {
      await loading.dismiss();
    }
  }

  ngAfterViewInit(): void {
    const tooltipElement = document.getElementById("tooltip");

    if (tooltipElement) {
      this.homeService.initializeTooltip(tooltipElement);
    }
  }

  public toggleMarkersVisibility(): void {
    this.markersVisible = !this.markersVisible;
    this.homeService.toggleMarkersVisibility(this.markersVisible);
  }
}
