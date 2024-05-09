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

  public sendForm(
    formData: FormAlumbrado | FormBasura | FormIncendio | FormVehicular,
    isValid: boolean
  ): boolean {
    if (formData.module == "") {
      // TODO Mostrar popup con error
      isValid = false;
    }
    if (formData.coordinate[0] == 0 || formData.coordinate[1] == 0) {
      // TODO Mostrar popup con error
      //isValid = false;
    }

    if (isValid) {
      // TODO Enviar form a backend
      console.log(formData);
    }

    return isValid;
  }
}
