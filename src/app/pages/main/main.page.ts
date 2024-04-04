import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { FirestoreService } from "src/app/services/firestore.service";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "app-main",
  templateUrl: "./main.page.html",
  styleUrls: ["./main.page.scss"],
})
export class MainPage implements OnInit {
  pages = [
    { title: "perfil", url: "/main/profile", icon: "person-outline" },
    { title: "mapa", url: "/main/home", icon: "map-outline" },
  ];

  router = inject(Router);
  firebaseSvc = inject(FirestoreService);
  utilSvc = inject(UtilsService);
  currentPath: string = "";

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url;
    });
  }

  //==========cerrar sesion============
  signOut() {
    this.firebaseSvc.signOut();
  }
}
