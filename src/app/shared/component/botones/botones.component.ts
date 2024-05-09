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
}
