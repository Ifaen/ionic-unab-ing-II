import { Component, OnInit } from "@angular/core";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { fromLonLat } from "ol/proj";
import { get as getProjection } from 'ol/proj';

@Component({
  selector: "app-mapa",
  templateUrl: "./mapa.component.html",
  styleUrls: ["./mapa.component.scss"],
})
export class MapaComponent implements OnInit {
  map: Map; // Declarar la variable map como propiedad de la clase

  constructor() {}

  ngOnInit(): void {
    const valparaisoExtent = [
      fromLonLat([-71.8, -33.3])[0], // Coordenada oeste
      fromLonLat([-33.3, -71.8])[1], // Coordenada sur
      fromLonLat([-71.3, -32.9])[0], // Coordenada este
      fromLonLat([-32.9, -71.3])[1]  // Coordenada norte
    ];

    this.map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(), //invocacion de la biblioteca para hacer visual el mapa
        }),
      ],
      view: new View({
        center: fromLonLat([-71.6273, -33.0472]),
        zoom: 12,
        extent: valparaisoExtent, // Limitar la vista a la región de Valparaíso
        constrainResolution: true // Restringir la resolución del zoom
      }),
    });

    // Limitar la vista al extent especificado
    this.map.getView().fit(valparaisoExtent, { 
      size: this.map.getSize(),
      maxZoom: 15
    });
  }
}
