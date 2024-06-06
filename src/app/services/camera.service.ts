import { Injectable } from "@angular/core";
import { Camera, CameraResultType } from "@capacitor/camera";
import {
  AngularFireStorage,
  AngularFireStorageReference,
} from "@angular/fire/compat/storage";

@Injectable({
  providedIn: "root",
})
export class CameraService {
  private fileRef: AngularFireStorageReference;
  constructor(private storage: AngularFireStorage) {}

  // Método para verificar y solicitar permisos de la cámara
  private async checkCameraPermissions(): Promise<boolean> {
    try {
      const status = await Camera.checkPermissions();
      if (status.camera === 'granted') {
        return true;
      }

      const request = await Camera.requestPermissions();
      return request.camera === 'granted';
    } catch (error) {
      console.error('Error checking camera permissions', error);
      return false;
    }
  }

  public async takePhoto(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Base64,
      });

      const fileName = `${new Date().getTime()}.jpg`; // Genera un nombre único para el archivo usando el tiempo

      const photo = `data:image/jpeg;base64,${image.base64String}`; // Formatea los datos base64 en el formato correcto

      this.fileRef = this.storage.ref(`reports/${fileName}`); // Crear el path y darselo a la referencia

      return photo; // Enviar informacion de la imagen en formato string
    } catch (error) {
      console.error("Error al tomar la foto:", error);
      return null;
    }
  }

  public async sendPhoto(photo: string): Promise<string | null> {
    try {
      await this.fileRef.putString(photo, "data_url"); // Envia a la base de datos

      const downloadUrl = await this.fileRef.getDownloadURL().toPromise(); // Obtiene la URL de descarga de la imagen

      return downloadUrl; // Retornar url
    } catch (error) {
      console.error("Error al tomar la foto:", error);
      return null;
    }
  }
}
