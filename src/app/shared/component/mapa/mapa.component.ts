/**
 * @deprecated Debido a un bug y por la naturaleza de este componente que no es reutilizado, se movio directamente al page de home.
 */

import { Component, ElementRef, OnInit } from "@angular/core";

// importaciones de la biblioteca ol
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import { OSM, Vector, Vector as VectorSource } from "ol/source.js";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";

@Component({
  selector: "app-mapa",
  templateUrl: "./mapa.component.html",
  styleUrls: ["./mapa.component.scss"],
})
export class MapaComponent implements OnInit {
  map: Map; // Declarar la variable map como propiedad de la clase

  //constructor() {}
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    console.log("HOLAAAA");
    this.map = new Map({
      target: "map",
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
    this.addMarker([-33.0219, -71.5517]);
   
  }

  ngAfterViewInit(): void {
    // Aquí puedes añadir el marcador una vez que la vista está inicializada
    this.addMarker([-33.0219, -71.5517]); // Reemplaza con tus coordenadas
   
  }

  addMarker(coordinates: [number, number]): void {
    const marker = new Feature({
      geometry: new Point(fromLonLat(coordinates)),
    });

    marker.setStyle(
      new Style({
        image: new Icon({
          src: "assets/icon/basu.png", // Reemplaza con la ruta a tu ícono de marcador
          anchor: [0.5, 1],
          scale: 0.1, // Ajusta el tamaño del icono si es necesario
        }),
      })
    );

    const vectorSource = new VectorSource({
      features: [marker],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    this.map.addLayer(vectorLayer);
  }
}
