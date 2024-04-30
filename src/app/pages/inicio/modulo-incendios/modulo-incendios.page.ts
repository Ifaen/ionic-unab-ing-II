import { Component } from "@angular/core";
import { MapService } from "src/app/services/map.service";

@Component({
  selector: "app-modulo-incendios",
  templateUrl: "./modulo-incendios.page.html",
  styleUrls: ["./modulo-incendios.page.scss"],
})
export class ModuloIncendiosPage {
  constructor(private mapService: MapService) {}

  ngOnInit() {
    this.mapService.mapReady.subscribe((ready: boolean) => {
      if (ready) {
        const map = this.mapService.map;
        if (map) {
          const view = map.getView(); // Obtener la vista del mapa
          const center = view.getCenter(); // Obtener ubicacion actual
          console.log(center); // Imprimir las coordenadas del centro en consola
          
        }
      }
    });
  }

}
