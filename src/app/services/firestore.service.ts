import { Injectable, inject } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { getFirestore, setDoc, getDoc, doc } from "@angular/fire/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { User } from "../models/user.model";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { UtilsService } from "./utils.service";
import { firstValueFrom, lastValueFrom } from "rxjs";
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
    this.utilsSvc.routerLink("/login");
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
        email: user.email,
        password: user.password,
      });
    });
  }

  // Validador si correo existe
  async emailExists(email: string): Promise<boolean> {
    const docRef = this.firestore.collection("users", (ref) =>
      ref.where("email", "==", email)
    );
    const docSnap = await firstValueFrom(docRef.get());
    return docSnap.size > 0;
  }

  // enviar email para restablecer contraseña
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  // setear un documento
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  // obtener documentos
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }
  /* 
  async getDocument(path: string): Promise<User | undefined> {
    const docRef = doc(getFirestore(), path);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as User;
    } else {
      console.error(`No document found at path: ${path}`);
      return undefined;
    }
  } 
    */

  //Funcion que toma el email del usuario
  async getUserEmail(): Promise<string | null> {
    const user = getAuth().currentUser;
    //console.log("Current user:", user);
    return user ? user.email : null;
    //return this.auth.authState.pipe(map((user) => (user ? user.email : null)));
  }
}
