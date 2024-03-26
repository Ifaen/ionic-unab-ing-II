import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';

import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { getFirestore, setDoc, doc, getDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';

//import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  auth = inject(AngularFireAuth);

  firestore = inject(AngularFirestore);

  utilsSvc = inject(UtilsService);

  //==============AUTENTICACION==============//

  getAuth() {
    return getAuth();
  }

  //==========ACCEDER==========//

  singIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //============== CREAR USUARIO=============
  singUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //========= ACTUALIZAR USUARIO==========

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  //==========enviar email para restablecer contraseña=======

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  //==========cerrar sesion==============

  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  //==================BASE DE DATOS===============================

  //=======setear un documento=========
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  //====== obtener documentos=========

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }
}
