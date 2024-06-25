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
        .then((response) => resolve(true))
        .catch((error) => {
          console.error(error);
          reject(false);
        });
    });

    if (result) this.navController.navigateRoot("/inicio/map"); // Volver al inicio
  }

  /**
   * Funcion encargada de transformar la fecha en formato string a formato date, para utilizarla en funciones
   * de vencimiento y tambien para visualizacion. Separa en sus correspondientes partes la fecha,
   * luego se lo pasa a la funcion new Date()
   * @param dateString fecha en formato string
   * @returns fecha en formato date
   */
  private convertToDate(dateString: string): Date {
    const [datePart, timePart] = dateString.split(", ");

    const [day, month, year] = datePart
      .split("/")
      .map((part) => parseInt(part, 10));

    const [hours, minutes, seconds] = timePart
      .split(":")
      .map((part) => parseInt(part, 10));

    const date = new Date(year, month - 1, day, hours, minutes, seconds);
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
        report.date = this.convertToDate(report.date as unknown as string); //Convertir la fecha para agregar al reporte
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
        report.date = this.convertToDate(report.date as unknown as string); ////Convertir la fecha para agregar al reporte
        reports.push(report); // Agregarlo a la lista
      });

      return reports;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Servicio encargado de mover los reportes expirados a una nueva colección, primero copiando el reporte a una colección
   * llamada 'expired-reports' y luego, la elimina de la colección 'reports'.
   * @param report Informacion del reporte expirado
   * @returns un booleano que indica si fue posible eliminar el reporte de la base de datos y moverlo a la colección 'expired-reports'
   */
  public async removeReport(report: Report): Promise<boolean> {
    // Mover a expirados
    let result = new Promise<boolean>((resolve, reject) => {
      this.firestore
        .collection("expired-reports")
        .add(report)
        .then(() => resolve(true))
        .catch((error) => {
          console.error(error);
          reject(false);
        });
    });

    if (result) {
      return new Promise<boolean>((resolve, reject) => {
        this.firestore
          .collection("reports")
          .doc(report.id)
          .delete()
          .then(() => resolve(true))
          .catch((error) => {
            console.error(error);
            reject(false);
          });
      });
    }

    return result; // Si resultado falla, entonces retornar falso
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
      case "punto-reciclaje":
        return "assets/icon/recycling-point.png";
      default:
        console.log(`No icon found for module: ${module}, using default icon.`);
        return "assets/icon/poste.png"; // Icono por defecto
    }
  }
}

// public async deleteOldReports(): Promise<void> {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0); // Set time to the start of the day to ensure correct comparison

//   // Query to get all reports with a date less than today
//   const snapshot = await this.firestore.firestore.collection("reports").get();

//   //console.log("Number of reports to delete:", snapshot.size);

//   // Initialize a batch operation
//   const batch = this.firestore.firestore.batch();

//   snapshot.forEach((doc) => {
//     batch.delete(doc.ref);
//   });

//   // Commit the batch operation to delete all documents
//   await batch.commit();
//   console.log("Old reports deleted successfully.");
// }
