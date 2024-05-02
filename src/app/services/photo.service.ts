import { Injectable } from "@angular/core";
import { Camera, CameraResultType } from "@capacitor/camera";

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  
  constructor() { }
    
  async takePhoto(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Base64
      });
  
      return 'data:image/jpeg;base64,' + image.base64String;
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      return null;
    }
  }
    
}
  