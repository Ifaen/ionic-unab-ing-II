import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage{
  registerForm: FormGroup;

  constructor(private toastController: ToastController, private firebaseSvc: FirebaseService) {
    this.registerForm = new FormGroup({
      'nombre': new FormControl(null, Validators.required),
      'rut': new FormControl(null, Validators.required),
      'contrasena': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'confirmar_contrasena': new FormControl(null, Validators.required),
      'correo': new FormControl(null, [Validators.required, Validators.email]),
      'telefono': new FormControl(null, Validators.required)
    });
  }

  validarFormulario() {
    if (this.registerForm.controls['correo'].invalid) {
      this.mostrarNotificacion('Ingrese un correo válido');
    } else if (this.registerForm.controls['contrasena'].invalid){
      this.mostrarNotificacion('la contraseña debe ser de minimo 6 digitos');
    } else if (!this.registerForm.valid) {
      this.mostrarNotificacion('Por favor complete todos los campos');
    } else if (this.registerForm.value.contrasena !== this.registerForm.value.confirmar_contrasena) {
      this.mostrarNotificacion('Las contraseñas no coinciden.');
    } 
    else {
      const user: User = {
        uid: '',
        nombre: this.registerForm.value.nombre,
        rut: this.registerForm.value.rut,
        password: this.registerForm.value.contrasena,
        email: this.registerForm.value.correo,
        telefono: this.registerForm.value.telefono
      };
      this.firebaseSvc.signUp(user).then(res => {
        console.log(res);
        this.mostrarNotificacionBuena('¡Cuenta Registrada con Exito! :)');
      });
    }
  }
  
  
  async mostrarNotificacion(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom',
      color: 'warning'
    });
    toast.present();
  }

  async mostrarNotificacionBuena(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }
}