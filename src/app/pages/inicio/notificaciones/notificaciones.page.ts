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

  constructor(public reportService: ReportService) { }

  ngOnInit() {
    this.loadReports();
  }

  // Ordena las Fechas
  async loadReports() {
    this.reports = await this.reportService.getReports();
    this.reports.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Ordenar de más reciente a más antiguo
    });
  }

  public getIcon(module: string): string {
    return this.reportService.getIcon(module);
  }

  public hasTypeIncident(report: Report | ReportIncendio | ReportAlumbrado | ReportVehicular | ReportBasura): report is ReportIncendio | ReportAlumbrado | ReportVehicular | ReportBasura {
    return 'typeIncident' in report;
  }
}
