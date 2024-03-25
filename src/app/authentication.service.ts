import { Injectable } from '@angular/core';
import firebase from 'firebase/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http'


@Injectable({
  providedIn: 'root'
})
export class AutheticationService {

  constructor(public ngFireAuth: AngularFireAuth) { }


  async loginUser(email:string,password:string){
    return await this.ngFireAuth.signInWithEmailAndPassword(email,password)
  }

  async resetPassword(email:string){
    return await this.ngFireAuth.sendPasswordResetEmail(email)
  }

  async signOut(){
    return await this.ngFireAuth.signOut()

  }

  async getProfile(){
    return await this.ngFireAuth.currentUser
  }
}
