import { Injectable } from "@angular/core";
import {
  ReportAlumbrado,
  ReportBasura,
  ReportIncendio,
  Report,
  ReportVehicular,
} from "../models/report.model";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { LoadingController, NavController } from "@ionic/angular";
import { CameraService } from "./camera.service";

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
    private navController: NavController,
    private loadingController: LoadingController,
    private cameraService: CameraService
  ) {}

  public async validateForm(isValid: boolean): Promise<void> {
    const loading = await this.loadingController.create({
      spinner: "crescent",
    });

    await loading.present();

    try {
      if (this.formData.module == "") {
        // TODO Mostrar popup con error
        isValid = false;
      }
      if (
        this.formData.coordinate[0] == 0 ||
        this.formData.coordinate[1] == 0
      ) {
        // TODO Mostrar popup con error
        isValid = false;
      }

      // Si tiene una photo, enviarla al storage de firebase y almacenar el url resultante
      if (this.formData.photo != "") {
        this.formData.photo = await this.cameraService.sendPhoto(
          this.formData.photo
        );
      }

      if (isValid) this.sendForm();
    } catch (error) {
      console.log(error);
    } finally {
      await loading.dismiss(); // Ocultar loading
    }
  }

  // Enviar formulario a backend
  sendForm() {
    // Agregar fecha y hora de envio del reporte
    this.formData.date = new Date().toLocaleString("es-ES", {
      timeZone: "America/Santiago",
    });

    // Enviar formulario a collection reportes
    let result = new Promise<boolean>((resolve, reject) => {
      this.firestore
        .collection("reports")
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

    if (result) this.navController.navigateRoot("/inicio/home"); // Volver al inicio
  }

  //TODO:Funcion que cambia la fecha de string a formato date para poder ser utilizada luego en el HTML
  //FUNCION DE OBTENER Y CAMBIAR LA FECHA A FORMATO DATE
  private convertToDate(dateString: string): Date {
    //console.log(`Original date string: ${dateString}`); // Verificar que esta tomando la fecha
    const [datePart, timePart] = dateString.split(", ");
    const [day, month, year] = datePart
      .split("/")
      .map((part) => parseInt(part, 10));
    const [hours, minutes, seconds] = timePart
      .split(":")
      .map((part) => parseInt(part, 10));
    const date = new Date(year, month - 1, day, hours, minutes, seconds);
    //console.log(`Converted date: ${date}`); // Verificar que la fecha fue convertida
    return date;
  }

  public async getReports(): Promise<Report[]> {
    const reports: Report[] = [];

    try {
      const snapshot = await this.firestore
        .collection("reports")
        .get()
        .toPromise();

      snapshot.forEach((doc) => {
        const report = doc.data() as Report; // Obtener la data del documento
        report.id = doc.id; // Obtener la id creada por firebase
        //TODO: Se agrega al reporte la fecha convertida para poder usarla despues
        report.date = this.convertToDate(report.date as unknown as string); //Convertir la fecha
        reports.push(report); // Agregarlo a la lista
      });

      return reports;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getReportsByUser(userEmail: string): Promise<Report[]> {
    const reports: Report[] = [];

    try {
      const snapshot = await this.firestore
        .collection("reports", (ref) => ref.where("userEmail", "==", userEmail))
        .get()
        .toPromise();

      snapshot.forEach((doc) => {
        const report = doc.data() as Report; // Obtener la data del documento
        report.id = doc.id; // Obtener la id creada por firebase
        //TODO: Se agrega al reporte la fecha convertida para poder usarla despues
        report.date = this.convertToDate(report.date as unknown as string); //Convertir la fecha
        reports.push(report); // Agregarlo a la lista
      });

      return reports;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public getIcon(module: string): string {
    switch (module) {
      case "Alumbrado":
        return "assets/icon/icon-modulo-1.png";
      case "Accidente Vehicular":
        return "assets/icon/icon-modulo-2.png";
      case "Incendios":
        return "assets/icon/icon-modulo-3.png";
      case "Basura":
        return "assets/icon/icon-modulo-4.png";
      default:
        console.log(module);
        return "";
    }
  }
}
