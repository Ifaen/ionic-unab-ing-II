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
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

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
    private loadingController: LoadingController,
    private navController: NavController
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

    const extent = [
      //las coordenadas del sur y norte de viña que limitan la vista
      fromLonLat([-71.7372, -33.1019]), // Sur: Viña del Mar
      fromLonLat([-71.4964, -32.9486]), // Norte: Valparaíso
    ];

    this.view = new View({
      center: fromLonLat([-71.6226, -33.0469]), // punto inicial
      zoom: 12,
      extent: [extent[0][0], extent[0][1], extent[1][0], extent[1][1]],
      minZoom: 10, // zoom maximo
      maxZoom: 15, // zoom minimo
    });

    this.map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: this.view,
    });

    while (!this.coordinates) {
      this.coordinates = this.mapService.getGeolocation().getPosition(); // Obtener coordenadas
      if (this.coordinates) {
        this.map.getView().setCenter(this.coordinates); // Centrar vista con coordenadas
        break; // Romper loop
      }
      await new Promise((resolve) => setTimeout(resolve, 100)); // Esperar x milisegundos
    }

    await loading.dismiss();
  }

  public sendPosition(): void {
    let coordinates = this.map.getView().getCenter(); // Obtain the coordinates of the current center of the map
    try {
      this.mapService.goToFormPage(coordinates);
    } catch (error) {
      console.log(error);
      this.navController.navigateRoot("/inicio/map");
    }
  }
}
