import { Component, Input, OnInit } from "@angular/core";
import { Style, Icon } from "ol/style";
import { ReportVector } from "src/app/models/report.model";
import { ReportService } from "src/app/services/report.service";
import { HomeService } from "src/app/services/home.service";

@Component({
  selector: "app-filtros",
  templateUrl: "./filtros.component.html",
  styleUrls: ["./filtros.component.scss"],
})
export class FiltrosComponent implements OnInit {
  public filters: { [key: string]: boolean } = {
    "Accidente Vehicular": true,
    Alumbrado: true,
    Basura: true,
    Incendios: true,
  };
  private markersVisible: boolean = true;
  @Input() reportVectors: ReportVector[] = [];

  private allFiltersActive: boolean = true; // Variable para rastrear el estado de todos los filtros

  constructor(
    private reportService: ReportService,
    private homeService: HomeService
  ) {}

  ngOnInit() {}

  public filterReports(module: string): void {
    this.filters[module] = !this.filters[module]; // Invertir valor actual
    this.applyFilter(module);
  }

  private applyFilter(module: string): void {
    this.reportVectors.forEach((item) => {
      if (item.report.module === module) {
        const src: string = this.reportService.getIcon(module); // Obtener el icon del reporte segun su modulo

        const scale = this.filters[module] ? 0.08 : 0; // Mostrar u ocultar icono

        item.vector.getFeatures()[0].setStyle(
          new Style({
            image: new Icon({
              anchor: [0.5, 50], // TODO Arreglar centrado del icono
              anchorXUnits: "fraction",
              anchorYUnits: "pixels",
              src: src,
              scale: scale,
            }),
          })
        );
      }
    });
  }

  public toggleAllFilters(): void {
    this.allFiltersActive = !this.allFiltersActive;
    Object.keys(this.filters).forEach((key) => {
      this.filters[key] = this.allFiltersActive;
      this.applyFilter(key);
    });
  }

  public toggleMarkersVisibility(): void {
    this.markersVisible = !this.markersVisible;
    this.homeService.toggleMarkersVisibility(this.markersVisible);
  }
}
