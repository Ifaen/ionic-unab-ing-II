import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Coordinate } from "ol/coordinate";

@Component({
  selector: "app-modulo-incendios",
  templateUrl: "./modulo-incendios.page.html",
  styleUrls: ["./modulo-incendios.page.scss"],
})
export class ModuloIncendiosPage implements OnInit {
  private coordinates: Coordinate;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    // Obtener los parametros enviados a traves de routerLink
    this.activatedRoute.params.subscribe((params) => {
      // Transformar params de tipo objeto a un array<float> de dos
      this.coordinates = Object.keys(params).map((key) =>
        parseFloat(params[key])
      );
    });
  }

  public setReportLocation() {
    this.router.navigate(["/inicio/location", this.coordinates]);
  }
}
