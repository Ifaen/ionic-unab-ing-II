import { Component } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FirestoreService } from "src/app/services/firestore.service";
import { User } from "src/app/models/user.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-registro",
  templateUrl: "./registro.page.html",
  styleUrls: ["./registro.page.scss"],
})
export class RegistroPage {
  registerForm: FormGroup;
  mostrarContrasena: boolean = false;
  mostrarConfirmarContrasena: boolean = false;

  constructor(
    private toastController: ToastController,
    private firestoreSvc: FirestoreService,
    private router: Router
  ) {
    this.registerForm = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      rut: new FormControl(null, Validators.required),
      contrasena: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmar_contrasena: new FormControl(null, Validators.required),
      correo: new FormControl(null, [Validators.required, Validators.email]),
      telefono: new FormControl(null, Validators.required),
    });
  }

  async validarFormulario() {
    // TODO Cambiar logica de esta funcion, para que muestre todos los errores de una vez, en ves de 1 en 1
    const rutExists = await this.firestoreSvc.rutExists(
      this.registerForm.value.rut
    );
    const emailExists = await this.firestoreSvc.emailExists(
      this.registerForm.value.correo
    );
    if (this.registerForm.controls["correo"].invalid) {
      this.mostrarNotificacion("Ingrese un correo válido");
    } else if (this.registerForm.controls["contrasena"].invalid) {
      this.mostrarNotificacion("la contraseña debe ser de minimo 6 digitos");
    } else if (!this.registerForm.valid) {
      this.mostrarNotificacion("Por favor complete todos los campos");
    } else if (
      this.registerForm.value.contrasena !==
      this.registerForm.value.confirmar_contrasena
    ) {
      this.mostrarNotificacion("Las contraseñas no coinciden.");
    } else {
      if (rutExists) {
        this.mostrarNotificacion("El RUT ya está en uso.");
      } else if (emailExists) {
        this.mostrarNotificacion("El correo electrónico ya está en uso.");
      } else {
        const user: User = {
          uid: "",
          nombre: this.registerForm.value.nombre,
          rut: this.registerForm.value.rut,
          password: this.registerForm.value.contrasena,
          email: this.registerForm.value.correo,
          telefono: this.registerForm.value.telefono,
        };
        this.firestoreSvc.signUp(user).then((res) => {
          console.log(res);
          this.mostrarNotificacionBuena("¡Cuenta Registrada con Éxito! :)");
          setTimeout(() => {
            this.router.navigate(["/auth"]);
          }, 3000); // 3000 milisegundos (3 segundos)
        });
      }
    }
  }

  toggleMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  toggleMostrarConfirmarContrasena() {
    this.mostrarConfirmarContrasena = !this.mostrarConfirmarContrasena;
  }

  async mostrarNotificacion(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: "bottom",
      color: "warning",
    });
    toast.present();
  }

  async mostrarNotificacionBuena(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: "bottom",
      color: "success",
    });
    toast.present();
  }
}

/*import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)])
  })

  firebaseSvc = inject(FirestoreService);
  utilsSvc = inject(UtilsService);


  ngOnInit() {
  }

  async submit() {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.singUp(this.form.value as User).then(async res => {

        await this.firebaseSvc.updateUser(this.form.value.name);

        let uid = res.user.uid;
        this.form.controls.uid.setValue(uid);

        this.setUserInfo(uid);


        
      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() => {
        loading.dismiss();
      })

    }
  }



  async setUserInfo(uid: string) {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`
      delete this.form.value.password;

      this.firebaseSvc.setDocument(path, this.form.value).then(async res => {

        this.utilsSvc.saveInLocalStorage('user', this.form.value)
        this.utilsSvc.routerLink('/main/home');
        this.form.reset();

        console.log(res);
        
      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() => {
        loading.dismiss();
      })

    }
  }
}*/
