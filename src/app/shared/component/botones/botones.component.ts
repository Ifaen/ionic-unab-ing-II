import { Component, Input, OnInit } from "@angular/core";
import Geolocation from "ol/Geolocation";
@Component({
  selector: "app-botones",
  templateUrl: "./botones.component.html",
  styleUrls: ["./botones.component.scss"],
})
export class BotonesComponent implements OnInit {
  @Input() geolocation: Geolocation;

  constructor() {}

  ngOnInit() {
    //setTimeout(() => console.log(this.geolocation.getPosition()), 10000);
  }
}
