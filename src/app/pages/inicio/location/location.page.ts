import { Component, Input, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Feature, Map, View } from "ol";
import { Coordinate } from "ol/coordinate";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import { Circle, Fill, Stroke, Style } from "ol/style";
import { MapService } from "src/app/services/map.service";

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
    private activatedRoute: ActivatedRoute
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

  ngOnInit() {
    // Obtener los parametros enviados a traves de routerLink
    this.activatedRoute.params.subscribe((params) => {
      // Transformar params de tipo objeto a un array<float> de dos
      this.coordinates = Object.keys(params).map((key) =>
        parseFloat(params[key])
      );
    });
    this.view = this.mapService.setView(this.coordinates, 16);
    this.map = this.mapService.setMap(this.view);

    this.mapService.createVector(
      this.map,
      new VectorSource({
        features: [this.pointer],
      })
    );
    // Asignar al puntero el valor de las coordenadas obtenidas
    this.point = new Point(this.coordinates);
    this.pointer.setGeometry(this.point);

    this.map.on("pointermove", (e) => {
      this.point.setCoordinates(this.map.getView().getCenter());
    });
  }

  sendPosition(): void {
    console.log(this.map.getView().getCenter()); // TODO Enviar ubicacion devuelta al formulario
  }
}