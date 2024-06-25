import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ModuloIncendiosPage } from "./modulo-incendios.page";
import { RedireccionEnvioPage } from "./redireccion-envio/redireccion-envio.page";

const routes: Routes = [
  {
    path: "",
    component: ModuloIncendiosPage,
  },
  {
    path: "redireccion",
    component: RedireccionEnvioPage,
  },
  {
    path: "redireccion-envio",
    loadChildren: () =>
      import("./redireccion-envio/redireccion-envio.module").then(
        (m) => m.RedireccionEnvioPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuloIncendiosPageRoutingModule {}
