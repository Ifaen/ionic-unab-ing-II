import { Component, OnInit, ViewChild } from "@angular/core";
import { IonModal } from "@ionic/angular";
import {
  Report,
  ReportAlumbrado,
  ReportBasura,
  ReportIncendio,
  ReportVehicular,
} from "src/app/models/report.model";
import { FirestoreService } from "src/app/services/firestore.service";
import { ReportService } from "src/app/services/report.service";

@Component({
  selector: "app-mis-reportes",
  templateUrl: "./mis-reportes.page.html",
  styleUrls: ["./mis-reportes.page.scss"],
})
export class MisReportesPage implements OnInit {
  //TODO: PROBANDO MODAL
  @ViewChild(IonModal) modal!: IonModal;

  userReports: Report[] = [];
  loading: boolean = true;
  error: string | null = null;

  //TODO: PROBANDO MODAL
  selectedReport!:
    | ReportIncendio
    | ReportAlumbrado
    | ReportVehicular
    | ReportBasura;

  private iconMap: { [key: string]: string } = {
    Alumbrado: "bulb",
    "Accidente Vehicular": "car-sport",
    Incendios: "flame",
    Basura: "trash",
    // Añade otros módulos si es necesario
  };

  constructor(
    private reportService: ReportService,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit() {
    this.loadUserReports();
  }

  async loadUserReports() {
    this.loading = true;
    this.error = null;

    try {
      const userEmail = await this.firestoreService.getUserEmail();
      if (userEmail) {
        this.userReports = await this.reportService.getReportsByUser(userEmail);
      } else {
        this.error = "No se pudo obtener el correo del usuario.";
      }
    } catch (error) {
      this.error = "Hubo un error al cargar los reportes.";
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  //Probando Funcion
  public hasTypeIncident(
    report:
      | Report
      | ReportIncendio
      | ReportAlumbrado
      | ReportVehicular
      | ReportBasura
  ): report is
    | ReportIncendio
    | ReportAlumbrado
    | ReportVehicular
    | ReportBasura {
    return "typeIncident" in report;
  }

  public getIcon(module: string): string {
    const iconName = this.iconMap[module] || "alert"; // Icono predeterminado si no se encuentra
    console.log(`Icon name for module ${module}: ${iconName}`);
    return iconName;
  }

  //TODO: Probando el Modal

  public isSpecificReportType(
    report: Report
  ): report is
    | ReportIncendio
    | ReportAlumbrado
    | ReportVehicular
    | ReportBasura {
    return (
      report.module === "Incendio" ||
      report.module === "Alumbrado" ||
      report.module === "Accidente Vehicular" ||
      report.module === "Basura"
    );
  }

  openReportModal(
    report: ReportIncendio | ReportAlumbrado | ReportVehicular | ReportBasura
  ) {
    this.selectedReport = report;
    this.modal.present();
  }
}
