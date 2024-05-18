import { Component, Input, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LoadingController, NavController } from "@ionic/angular";
import { Feature, Geolocation, Map, View } from "ol";
import { load } from "ol/Image";
import { Coordinate } from "ol/coordinate";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import { Circle, Fill, Stroke, Style } from "ol/style";
import { MapService } from "src/app/services/map.service";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "app-location",
  templateUrl: "./location.page.html",
  styleUrls: ["./location.page.scss"],
})
export class LocationPage implements OnInit {
  private coordinates: Coordinate;
  private view: View;
  private map: Map; // Declarar la variable map como propiedad de la clase
  private pointer: Feature;
  private point: Point;

  constructor(
    private mapService: MapService,
    private loadingController: LoadingController
  ) {
    this.pointer = new Feature();
    this.pointer.setStyle(
      new Style({
        image: new Circle({
          radius: 6, // Radio del punto de la ubicacion
          fill: new Fill({
            color: "#000000", // Color del punto
          }),
          stroke: new Stroke({
            color: "#111", // Color del radio
            width: 2, // Ancho del borde del radio
          }),
        }),
      })
    );
  }

  async ngOnInit(): Promise<void> {
    const loading = await this.loadingController.create({
      spinner: "crescent",
    });

    await loading.present();

    this.view = this.mapService.setView([0, 0], 16); // Inicialmente coordenadas 0,0 hasta que cargue la posicion actual del usuario
    this.map = this.mapService.setMap(this.view);

    while (!this.coordinates) {
      this.coordinates = this.mapService.getGeolocation().getPosition(); // Obtener coordenadas
      if (this.coordinates) {
        this.map.getView().setCenter(this.coordinates); // Centrar vista con coordenadas
        break; // Romper loop
      }
      await new Promise((resolve) => setTimeout(resolve, 100)); // Esperar 100 milisegundos
    }

    await loading.dismiss();
  }

  public sendPosition(): void {
    let coordinates = this.map.getView().getCenter(); // Obtain the coordinates of the current center of the map
    this.mapService.goToFormPage(coordinates); // Go to the previos page
  }
}
