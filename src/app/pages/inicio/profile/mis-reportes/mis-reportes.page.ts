import { Component, OnInit } from "@angular/core";
import { Report } from "src/app/models/report.model";
import { FirestoreService } from "src/app/services/firestore.service";
import { ReportService } from "src/app/services/report.service";

@Component({
  selector: "app-mis-reportes",
  templateUrl: "./mis-reportes.page.html",
  styleUrls: ["./mis-reportes.page.scss"],
})
export class MisReportesPage implements OnInit {
  userReports: Report[] = [];
  loading: boolean = true;
  error: string | null = null;

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

  //TODO: Cambiar los nombres de los iconos de acuerdo a los nombres de los del grupo 2
  getIcon(reportModule: string): string {
    switch (reportModule) {
      case "Incendio":
        return "flame-outline";
      case "Alumbrado":
        return "water-outline";
      case "Accidente Vehicular":
        return "earth-outline";
      case "Basura":
        return "airplane-outline";
      default:
        return "help-outline";
    }
  }
}
