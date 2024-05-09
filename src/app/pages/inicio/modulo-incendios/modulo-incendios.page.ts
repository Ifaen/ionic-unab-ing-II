import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Coordinate } from "ol/coordinate";
import { MapService } from "src/app/services/map.service";

@Component({
  selector: "app-modulo-incendios",
  templateUrl: "./modulo-incendios.page.html",
  styleUrls: ["./modulo-incendios.page.scss"],
})
export class ModuloIncendiosPage implements OnInit {
  constructor() {}

  ngOnInit() {}

  setReportLocation() {}
}
