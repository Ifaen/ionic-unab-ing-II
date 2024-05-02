import { Injectable } from "@angular/core";
// importaciones de la biblioteca ol
import View from "ol/View";
import Map from "ol/Map";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { Coordinate } from "ol/coordinate";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class MapService {
  constructor(private router: Router) {}

  public setView(coordinates: Coordinate, zoom: number): View {
    return new View({
      center: coordinates, // Coordenadas de Valparaiso para ingresar y ver directamente a la region
      zoom: zoom,
    });
  }

  public setMap(view: View): Map {
    return new Map({
      layers: [
        new TileLayer({
          source: new OSM(), //invocacion de la biblioteca para hacer visual el mapa
        }),
      ],
      target: "map",
      view: view,
    });
  }

  public createVector(map: Map, source: VectorSource): VectorLayer<any> {
    return new VectorLayer({
      map: map,
      source: source,
    });
  }
}
