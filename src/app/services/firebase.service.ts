import { Injectable, inject } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {getAuth, createUserWithEmailAndPassword, updateProfile, updateEmail, updatePassword, updatePhoneNumber} from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);

  constructor(private firestore: AngularFirestore) { }

  // ============ Registrarse ============
  signUp(user: User){
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
      .then((result) => {
        // Almacenar los datos del usuario en Firestore
        return this.firestore.collection('users').doc(result.user.uid).set({
          nombre: user.nombre,
          rut: user.rut,
          email: user.email,
          telefono: user.telefono,
          password: user.password
        });
      });
  }
  // =================================
  editProfile(user: User){
    const auth = getAuth();
    const currentUser = auth.currentUser;
  
    if (currentUser) {
      // Actualizar el nombre de visualización
  
      // Actualizar el correo electrónico
      if (user.email !== currentUser.email) {
        updateEmail(currentUser, user.email)
          .then(() => console.log('Correo electrónico actualizado'));
      }
  
      // Actualizar la contraseña
      if (user.password) {
        updatePassword(currentUser, user.password)
          .then(() => console.log('Contraseña actualizada'));
      }
  
      // Actualizar los datos del usuario en Firestore
      this.firestore.collection('users').doc(currentUser.uid).update({
        nombre: user.nombre,
        rut: user.rut,
        email: user.email,
        telefono: user.telefono,
        password: user.password
      });
    }
  }
}
