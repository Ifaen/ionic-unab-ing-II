import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./component/header/header.component";
import { CustomInputComponent } from "./component/custom-input/custom-input.component";
import { LogoComponent } from "./component/logo/logo.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TabsComponent } from "./component/tabs/tabs.component";
import { BotonesComponent } from "./component/botones/botones.component";
import { FiltrosComponent } from "./component/filtros/filtros.component";
import { RouterModule } from "@angular/router";
import { InformationModalComponent } from "./component/information-modal/information-modal.component";

@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    TabsComponent,
    BotonesComponent,
    FiltrosComponent,
    InformationModalComponent,
  ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    ReactiveFormsModule,
    TabsComponent,
    BotonesComponent,
    FiltrosComponent,
    InformationModalComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
  ],
})
export class SharedModule {}
