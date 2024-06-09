import { Component, OnInit, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FirestoreService } from "src/app/services/firestore.service";
import { UtilsService } from "src/app/services/utils.service";
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.page.html',
  styleUrls: ['./contactos.page.scss'],
})
export class ContactosPage implements OnInit {
  form = new FormGroup({
    uid: new FormControl(""),
    titulo: new FormControl("", [Validators.required]),
    descripcion: new FormControl("", [Validators.required]),
    horario: new FormControl("", [Validators.required]),
  });

  firebaseSvc = inject(FirestoreService);
  utilsSvc = inject(UtilsService);
  constructor(private alertController: AlertController,private navCtrl: NavController) { }

  ngOnInit() {}
  async mostrarOpciones1() {
    const alert = await this.alertController.create({
      header: '¿Problemas con Alumbrado publico?',
      buttons: [
        {
          text: '800 720 077 (Viña Del Mar 08:30 a 19:00 hrs)',
          handler: () => {
            window.open('tel:800720077')
          }
        },
        {
          text: '32 3350 000 (Valparaiso 24 hrs)',
          handler: () => {
            window.open('tel:32335000')
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
  
    await alert.present();
  }
  async mostrarOpciones2() {
    const alert = await this.alertController.create({
      header: '¿Problemas con tu internet?',
      buttons: [
        {
          text: 'Entel 600 3600 103',
          handler: () => {
            window.open('tel:6003600103')
          }
        },
        {
          text: 'Movistar 600 600 3200',
          handler: () => {
            window.open('tel:6006003200')
          }
        },
        {
          text: 'Vtr 600 800 9000',
          handler: () => {
            window.open('tel:6008009000')
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
  
    await alert.present();
  }
  async mostrarOpciones3() {
    const alert = await this.alertController.create({
      header: '¿Problemas con tus datos moviles?',
      buttons: [
        {
          text: 'Claro 800 171 171',
          handler: () => {
            window.open('tel:800171171',)
          }
        },
        {
          text: 'Movistar 600 600 3000',
          handler: () => {
            window.open('tel:6006003000')
          }
        },
        {
          text: 'WOM 600 200 1000',
          handler: () => {
            window.open('tel:6002001000');
          }
        },
        {
          text: 'Entel 600 3700 104',
          handler: () => {
            window.open('tel:6003700104');
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
  
    await alert.present();
  }
  async mostrarOpciones4() {
    const alert = await this.alertController.create({
      header: 'Opciones adicionales',
      buttons: [
        {
          text: 'CGE 800 800 767',
          handler: () => {
            window.open('tel:800800767')
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    })
  
    await alert.present();
  }
}
