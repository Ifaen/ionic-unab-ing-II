import { Injectable } from "@angular/core";
// importaciones de la biblioteca ol
import View from "ol/View";
import Map from "ol/Map";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { fromLonLat } from "ol/proj";

@Injectable({
  providedIn: "root",
})
export class MapService {
  private view: View;
  private map: Map; // Declarar la variable map como propiedad de la clase

  constructor() {}

  public setView(longitude: number, latitude: number, zoom: number): void {
    this.view = new View({
      center: fromLonLat([longitude, latitude]), // Coordenadas de Valparaiso para ingresar y ver directamente a la region
      zoom: zoom,
    });
  }

  public getView(): View {
    return this.view;
  }

  public setMap(): void {
    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(), //invocacion de la biblioteca para hacer visual el mapa
        }),
      ],
      target: "map",
      view: this.view,
    });
  }

  public createVector(source: VectorSource): VectorLayer<any> {
    return new VectorLayer({
      map: this.map,
      source: source,
    });
  }
}
