import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { Camera } from '@capacitor/camera';

const { Permissions } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor() { }

  async checkLocationPermissions(): Promise<boolean> {
    try {
      let status = await Geolocation.checkPermissions();
      if (status.location === 'denied') {
        // Solicitar permiso nuevamente si fue denegado
        status = await Geolocation.requestPermissions();
      }

      return status.location === 'granted';
    } catch (error) {
      console.error('Error al verificar permisos de ubicación', error);
      return false;
    }
  }

  async checkCameraPermissions(): Promise<boolean> {
    try {
      let status = await Camera.checkPermissions();
      if (status.camera === 'denied') {
        // Solicitar permiso nuevamente si fue denegado
        status = await Camera.requestPermissions();
      }

      return status.camera === 'granted';
    } catch (error) {
      console.error('Error al verificar permisos de cámara', error);
      return false;
    }
  }

  async checkAllPermissions(): Promise<boolean> {
    const locationGranted = await this.checkLocationPermissions();
    const cameraGranted = await this.checkCameraPermissions();
    return locationGranted && cameraGranted;
  }
}
