import { Component, OnInit, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FirestoreService } from "src/app/services/firestore.service";
import { UtilsService } from "src/app/services/utils.service";
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: "app-modulo-alumbrado",
  templateUrl: "./modulo-alumbrado.page.html",
  styleUrls: ["./modulo-alumbrado.page.scss"],
})
export class ModuloAlumbradoPage implements OnInit {
  form = new FormGroup({
    uid: new FormControl(""),
    titulo: new FormControl("", [Validators.required]),
    descripcion: new FormControl("", [Validators.required]),
    horario: new FormControl("", [Validators.required]),
  });

  firebaseSvc = inject(FirestoreService);
  utilsSvc = inject(UtilsService);

  constructor(private alertController: AlertController,private navCtrl: NavController) {}

  ngOnInit() {}
  redireccionarAPagina() {
    this.navCtrl.navigateForward('/inicio/modulo-alumbrado/formulario-alum');
  }
  
  async mostrarOpciones1() {
    const alert = await this.navCtrl.navigateForward('/inicio/modulo-alumbrado/contactos');
  }
}