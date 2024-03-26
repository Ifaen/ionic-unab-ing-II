import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {
  user: User;

  @ViewChild('nombreInput') nombreInput: IonInput | undefined;
  @ViewChild('rutInput') rutInput: IonInput | undefined;
  @ViewChild('contrasenaInput') contrasenaInput: IonInput | undefined;
  @ViewChild('correoInput') correoInput: IonInput | undefined;
  @ViewChild('telefonoInput') telefonoInput: IonInput | undefined;

  nombre: string = '';
  rut: string = '';
  password: string = '';
  correo: string = '';
  telefono: string = '';
  isEditable = true;

  constructor(
    private firebaseSvc: FirebaseService,
    private firestore: AngularFirestore,
  ) {}

  ngOnInit() {
    this.firebaseSvc.auth.onAuthStateChanged((user) => {
      if (user) {
        this.firestore
          .collection('users')
          .doc(user.uid)
          .get()
          .subscribe((snapshot) => {
            let userData = snapshot.data() as any; // Afirmación de tipo
            this.nombre = userData.nombre;
            this.rut = userData.rut;
            this.password = userData.password;
            this.correo = userData.email;
            this.telefono = userData.telefono;
          });
      }
    });
  }

  toggleEdit() {
    this.isEditable = !this.isEditable;
  }
}
