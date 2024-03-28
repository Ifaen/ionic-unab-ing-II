import { Component, OnInit } from "@angular/core";

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
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([-71.6273, -33.0472]), // Coordenadas de Valparaíso, Chile en EPSG:3857
        zoom: 12,
      }),
    });
  }
}
