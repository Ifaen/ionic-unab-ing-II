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

      if (isValid) {
        this.sendForm();
      }
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
        reports.push(report); // Agregarlo a la lista
      });

      console.log("Reports fetched:", reports); // Añadir este log

      // Verificar cada reporte y sus coordenadas
      reports.forEach((report, index) => {
        console.log(`Report ${index}:`, report);
        if (!report.coordinate || report.coordinate.length !== 2) {
          console.error(
            `Report ${index} has invalid coordinates:`,
            report.coordinate
          );
        }
      });

      return reports;
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  }

  public getIcon(module: string): string {
    console.log(`Getting icon for module: ${module}`); // Añadir este log
    switch (
      module.toLowerCase() // Convertir a minúsculas para evitar problemas de coincidencia
    ) {
      case "alumbrado":
        return "assets/icon/icon-modulo-1.png";
      case "accidente-vehicular":
        return "assets/icon/icon-modulo-2.png";
      case "incendios":
        return "assets/icon/icon-modulo-3.png";
      case "basura":
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
