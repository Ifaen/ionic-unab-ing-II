import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ModuloPuntoReciclajePage } from "./modulo-punto-reciclaje.page";

const routes: Routes = [
  {
    path: "",
    component: ModuloPuntoReciclajePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuloPuntoReciclajePageRoutingModule {}
