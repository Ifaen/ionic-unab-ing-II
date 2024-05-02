/**
 * @deprecated Debido a un bug y por la naturaleza de este componente que no es reutilizado, se movio directamente al page de home.
 */

import { Component, OnInit } from "@angular/core";

// importaciones de la biblioteca ol
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";

@Component({
  selector: "app-mapa",
  templateUrl: "./mapa.component.html",
  styleUrls: ["./mapa.component.scss"],
})
export class MapaComponent implements OnInit {
  map: Map; // Declarar la variable map como propiedad de la clase

  constructor() {}

  ngOnInit(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(), //invocacion de la biblioteca para hacer visual el mapa
        }),
      ],
      view: new View({
        center: fromLonLat([-71.6273, -33.0472]),
        // Coordenadas de Valparaiso para ingresar
        // y ver directamente a la region
        zoom: 12,
      }),
    });
  }
}
