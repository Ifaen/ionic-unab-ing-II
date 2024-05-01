import { Component, Input, OnInit, inject } from "@angular/core";
import { MapService } from "src/app/services/map.service";

@Component({
  selector: "app-location",
  templateUrl: "./location.page.html",
  styleUrls: ["./location.page.scss"],
})
export class LocationPage implements OnInit {
  private mapService = inject(MapService);
  @Input() longitude: number;
  @Input() latitude: number;

  ngOnInit() {
    this.mapService.setView(-70.9377743, -53.1989798, 6);

    this.mapService.setMap();
  }
}
