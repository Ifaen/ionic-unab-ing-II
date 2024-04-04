import { Component, OnInit, inject } from "@angular/core";
import { FirestoreService } from "src/app/services/firestore.service";
import { UtilsService } from "src/app/services/utils.service";

import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage{
  firebaseSvc = inject(FirestoreService);
  utilSvc = inject(UtilsService);
  // cerrar sesion
  signOut() {
    this.firebaseSvc.signOut();
  }
}
