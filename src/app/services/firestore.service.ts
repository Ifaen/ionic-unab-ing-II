import { Injectable, inject } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import {
  Firestore,
  collectionData,
  collection,
  getFirestore,
  setDoc,
  getDoc,
  doc,
} from "@angular/fire/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  updateEmail,
  updatePassword,
  updatePhoneNumber,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { User } from "../models/user.model";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { UtilsService } from "./utils.service";

@Injectable({
  providedIn: "root",
})
export class FirestoreService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);

  constructor() {}

  // AUTENTICACION
  getAuth() {
    return getAuth();
  }

  // cerrar sesion
  signOut() {
    getAuth().signOut();
    localStorage.removeItem("user");
    this.utilsSvc.routerLink("/auth");
  }

  // ACCEDER
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // Registrarse
  signUp(user: User) {
    return createUserWithEmailAndPassword(
      getAuth(),
      user.email,
      user.password
    ).then((result) => {
      // Almacenar los datos del usuario en Firestore
      return this.firestore.collection("users").doc(result.user.uid).set({
        nombre: user.nombre,
        rut: user.rut,
        email: user.email,
        telefono: user.telefono,
        password: user.password,
      });
    });
  }

  // enviar email para restablecer contraseña
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  // Editar perfil
  editProfile(user: User) {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      // Actualizar el nombre de visualización

      // Actualizar el correo electrónico
      if (user.email !== currentUser.email) {
        updateEmail(currentUser, user.email).then(() =>
          console.log("Correo electrónico actualizado")
        );
      }

      // Actualizar la contraseña
      if (user.password) {
        updatePassword(currentUser, user.password).then(() =>
          console.log("Contraseña actualizada")
        );
      }

      // Actualizar los datos del usuario en Firestore
      this.firestore.collection("users").doc(currentUser.uid).update({
        nombre: user.nombre,
        rut: user.rut,
        email: user.email,
        telefono: user.telefono,
        password: user.password,
      });
    }
  }

  // setear un documento
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  // obtener documentos

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }
}

/*import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { getFirestore, setDoc, doc, getDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';


//import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
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
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password );
  }

  //========= ACTUALIZAR USUARIO==========

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }


  //==========enviar email para restablecer contraseña=======

  sendRecoveryEmail(email: string){ 
    return sendPasswordResetEmail(getAuth(), email)
  }

  //==========cerrar sesion==============

  signOut(){
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

  async getDocument(path: string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }



}
*/
