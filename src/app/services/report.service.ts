import { Injectable } from "@angular/core";
import {
  ReportAlumbrado,
  ReportBasura,
  ReportIncendio,
  Report,
  ReportVehicular,
} from "../models/report.model";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { NavController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  public formData:
    | ReportAlumbrado
    | ReportBasura
    | ReportIncendio
    | ReportVehicular;

  constructor(
    private firestore: AngularFirestore,
    private navController: NavController
  ) {}

  // TODO Firebase endpoints

  public sendForm(isValid: boolean): void {
    if (this.formData.module == "") {
      // TODO Mostrar popup con error
      console.log("No modulo"); // TODO Borrar esto
      isValid = false;
    }
    if (this.formData.coordinate[0] == 0 || this.formData.coordinate[1] == 0) {
      // TODO Mostrar popup con error
      console.log("No coordenadas"); // TODO Borrar esto
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    let result = new Promise<boolean>((resolve, reject) => {
      this.firestore
        .collection("reportes")
        .add(this.formData)
        .then((response) => {
          console.log(response.id);
          resolve(true);
        })
        .catch((error) => {
          console.error(error);
          resolve(false);
        });
    });

    if (result) this.navController.navigateRoot("/inicio/home");
  }

  public async getReports(): Promise<Report[]> {
    const reports: Report[] = [];
    try {
      const snapshot = await this.firestore
        .collection("reportes")
        .get()
        .toPromise();
      snapshot.forEach((doc) => {
        reports.push(doc.data() as Report);
      });
      return reports;
    } catch (error) {
      console.error("Error getting reports:", error);
      throw error;
    }
  }
}
