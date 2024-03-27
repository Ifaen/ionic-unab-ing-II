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
export class HomePage implements OnInit {
  firebaseSvc = inject(FirestoreService);
  utilSvc = inject(UtilsService);

  ngOnInit() {}

  // cerrar sesion
  signOut() {
    this.firebaseSvc.signOut();
  }

  map!: Map;

  ngAfterViewInit(): void {
    this.map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });
  }
}
