import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import Geolocation from "ol/Geolocation";
import { MapService } from "src/app/services/map.service";
@Component({
  selector: "app-botones",
  templateUrl: "./botones.component.html",
  styleUrls: ["./botones.component.scss"],
})
export class BotonesComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  /**
   * Encargada de enviar al usuario al modulo de reporte seleccionado,
   * en conjunto a las coordenadas de su posicion aproximada en el mapa
   * @param module Nombre del modulo al cual redireccionar
   */
  public navigate(module: string) {
    let path = "/inicio/" + module;
    this.router.navigate([path]);
  }
}
