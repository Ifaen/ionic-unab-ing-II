import { Injectable } from "@angular/core";
import {
  FormAlumbrado,
  FormBasura,
  FormIncendio,
  FormReport,
  FormVehicular,
} from "../models/formsReport.model";
import { AngularFirestore } from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: "root",
})
export class ReportFormService {
  public formData: FormAlumbrado | FormBasura | FormIncendio | FormVehicular;

  constructor(private firestore: AngularFirestore) {}

  // TODO Firebase endpoints

  public async sendForm(isValid: boolean): Promise<boolean> {
    if (this.formData.module == "") {
      // TODO Mostrar popup con error
      console.log("No modulo");
      isValid = false;
    }
    if (this.formData.coordinate[0] == 0 || this.formData.coordinate[1] == 0) {
      // TODO Mostrar popup con error
      console.log("No coordenadas");
      isValid = false;
    }

    if (!isValid) {
      return isValid;
    }

    return new Promise<boolean>((resolve, reject) => {
      this.firestore
        .collection("reportes")
        .add(this.formData)
        .then((result) => {
          console.log("Document written with ID: ", result.id);
          resolve(true);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
          resolve(false);
        });
    });
  }

  public async getReports(): Promise<FormReport[]> {
    const reports: FormReport[] = [];
    try {
      const snapshot = await this.firestore
        .collection("reportes")
        .get()
        .toPromise();
      snapshot.forEach((doc) => {
        reports.push(doc.data() as FormReport);
      });
      return reports;
    } catch (error) {
      console.error("Error getting reports:", error);
      throw error;
    }
  }
}
