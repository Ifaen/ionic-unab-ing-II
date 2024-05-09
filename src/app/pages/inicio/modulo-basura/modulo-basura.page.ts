import { Component } from "@angular/core";
import { Router } from '@angular/router';
import { CameraService } from "src/app/services/photo.service";

@Component({
  selector: 'app-modulo-basura',
  templateUrl: './modulo-basura.page.html',
  styleUrls: ['./modulo-basura.page.scss'],
})
export class ModuloBasuraPage {
  capturedImg: string;


  constructor(private cameraService: CameraService, private router: Router) { }

  goToLocationPage() {
    this.router.navigate(['/inicio/location']);
  }

  ngOnInit() { }

  async executeImageCapture() {
    try {
      const photo = await this.cameraService.takePhoto();
      if (photo) {
        this.capturedImg = photo;
      } else {
        console.error('Error: Captured image is null or invalid.');
      }
    } catch (error) {
      console.error('Error: Unable to capture image.', error);
    }
  }

  refreshCharacterLimit() {
    let inputField = document.querySelector("#input_description") as HTMLTextAreaElement;
    let limitDisplay = document.querySelector("#limitDisplay");

    let currentLength = inputField.value.length;
    let maxLength = 200;

    limitDisplay.textContent = `${currentLength} of ${maxLength} characters used`;
  }
}