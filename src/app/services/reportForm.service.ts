import { Injectable } from "@angular/core";
import {
  FormAlumbrado,
  FormBasura,
  FormIncendio,
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
      isValid = false;
    }
    if (this.formData.coordinate[0] == 0 || this.formData.coordinate[1] == 0) {
      // TODO Mostrar popup con error
      isValid = false;
    }

    if (!isValid) {
      return isValid;
    }
    // TODO Enviar form a backend
    return new Promise<boolean>((resolve, reject) => {
      this.firestore
        .collection("reportes")
        .add(this.formData)
        .then((result) => {
          console.log("Document written with ID: ", result.id);
          resolve(true); // Data added successfully
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
          resolve(false); // Data added successfully
        });
    });
  }
}
