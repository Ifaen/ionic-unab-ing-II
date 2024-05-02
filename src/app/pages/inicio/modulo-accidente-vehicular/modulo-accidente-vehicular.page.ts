import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router"; // Importa Router para la redirección
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorSource from "ol/source/Vector";
import { Icon, Style } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";

@Component({
  selector: "app-modulo-accidente-vehicular",
  templateUrl: "./modulo-accidente-vehicular.page.html",
  styleUrls: ["./modulo-accidente-vehicular.page.scss"],
})
export class ModuloAccidenteVehicularPage implements OnInit {
  constructor(private router: Router) {} // Inyecta Router en el constructor

  ngOnInit() {}

  updateCount() {
    var textarea = document.getElementById(
      "area_descripcion"
    ) as HTMLTextAreaElement;
    var count = document.getElementById("charCount");
    count.innerText = textarea.value.length + " / 250";
  }

  reportar() {
    this.router.navigate(["home"]);
  }
}
