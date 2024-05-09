import { Injectable } from "@angular/core";
import {
  FormAlumbrado,
  FormBasura,
  FormIncendio,
  FormVehicular,
} from "../models/formsReport.model";

@Injectable({
  providedIn: "root",
})
export class ReportFormService {
  public formData: FormAlumbrado | FormBasura | FormIncendio | FormVehicular;

  constructor() {}

  // TODO Firebase endpoints

  public sendForm(isValid: boolean): boolean {
    if (this.formData.module == "") {
      // TODO Mostrar popup con error
      isValid = false;
    }
    if (this.formData.coordinate[0] == 0 || this.formData.coordinate[1] == 0) {
      // TODO Mostrar popup con error
      //isValid = false;
    }

    if (isValid) {
      // TODO Enviar form a backend
      console.log(this.formData);
    }

    return isValid;
  }
}
