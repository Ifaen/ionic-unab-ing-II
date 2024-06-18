import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { InicioPage } from "./inicio.page";
import { LocationPage } from "./location/location.page";

const routes: Routes = [
  {
    path: "",
    component: InicioPage,
    children: [
      {
        path: "map",
        loadChildren: () =>
          import("./map/map.module").then((m) => m.MapPageModule),
      },
      {
        path: "location",
        component: LocationPage,
      },
      {
        path: "profile",
        loadChildren: () =>
          import("./profile/profile.module").then((m) => m.ProfilePageModule),
      },
      {
        path: "modulo-alumbrado",
        loadChildren: () =>
          import("./modulo-alumbrado/modulo-alumbrado.module").then(
            (m) => m.ModuloAlumbradoPageModule
          ),
      },
      {
        path: "modulo-incendios",
        loadChildren: () =>
          import("./modulo-incendios/modulo-incendios.module").then(
            (m) => m.ModuloIncendiosPageModule
          ),
      },
      {
        path: "modulo-basura",
        loadChildren: () =>
          import("./modulo-basura/modulo-basura.module").then(
            (m) => m.ModuloBasuraPageModule
          ),
      },
      {
        path: "modulo-accidente-vehicular",
        loadChildren: () =>
          import(
            "./modulo-accidente-vehicular/modulo-accidente-vehicular.module"
          ).then((m) => m.ModuloAccidenteVehicularPageModule),
      },
    ],
  },
  {
    path: "notificaciones",
    loadChildren: () =>
      import("./notificaciones/notificaciones.module").then(
        (m) => m.NotificacionesPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioPageRoutingModule {}
