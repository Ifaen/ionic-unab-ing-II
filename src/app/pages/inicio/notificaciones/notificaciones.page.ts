import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { Report, ReportIncendio, ReportAlumbrado, ReportBasura, ReportVehicular } from 'src/app/models/report.model';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {
  public reports: (Report | ReportIncendio | ReportAlumbrado | ReportVehicular | ReportBasura)[] = [];

  private iconMap: { [key: string]: string } = {
    "Alumbrado": "bulb",
    "Accidente Vehicular": "car-sport",
    "Incendios": "flame",
    "Basura": "trash",
    // Añade otros módulos si es necesario
  };

  constructor(public reportService: ReportService) { }

  ngOnInit() {
    this.loadReports();
  }

  async loadReports() {
    this.reports = await this.reportService.getReports();
    console.log("Reports loaded:", this.reports); // Añadir registro de consola
    this.reports.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Ordenar de más reciente a más antiguo
    });
  }

  public getIcon(module: string): string {
    const iconName = this.iconMap[module] || "alert"; // Icono predeterminado si no se encuentra
    console.log(`Icon name for module ${module}: ${iconName}`);
    return iconName;
  }

  public hasTypeIncident(report: Report | ReportIncendio | ReportAlumbrado | ReportVehicular | ReportBasura): report is ReportIncendio | ReportAlumbrado | ReportVehicular | ReportBasura {
    return 'typeIncident' in report;
  }
}
