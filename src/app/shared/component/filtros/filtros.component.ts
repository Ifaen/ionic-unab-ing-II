import { Component, Input, OnInit } from "@angular/core";
import { collectionGroup } from "firebase/firestore";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Icon, Style } from "ol/style";
import { Report, ReportIcon } from "src/app/models/report.model";
import { ReportService } from "src/app/services/report.service";

@Component({
  selector: "app-filtros",
  templateUrl: "./filtros.component.html",
  styleUrls: ["./filtros.component.scss"],
})
export class FiltrosComponent implements OnInit {
  private filters: { [key: string]: boolean } = {
    "accidente-vehicular": true,
    alumbrado: true,
    basura: true,
    incendios: true,
  };

  @Input() reportIcons: ReportIcon[] = [];

  constructor(private reportService: ReportService) {}

  ngOnInit() {}

  public filterReports(module: string): void {
    for (const key in this.filters) {
      if (key === module) {
        this.filters[key] = !this.filters[key]; // Invertir valor actual
        break;
      }
    }

    this.reportIcons.forEach((report) => {
      if (report.data.module == module) {
        const src: string = this.reportService.getIcon(module); // Obtener el icon del reporte segun su modulo

        // Definir el tamaño del icono
        let scale: number;
        if (this.filters[module]) {
          scale = 0.08;
        } else {
          scale = 0; // Ocultar icono
        }

        report.iconFeature.setStyle(
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
}
