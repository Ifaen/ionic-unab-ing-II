// Importa los módulos necesarios
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ mode: 'md' }),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    ReactiveFormsModule,
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'ing-sw2-c481e',
        appId: '1:824081761057:web:757b147f1593de0d817460',
        storageBucket: 'ing-sw2-c481e.appspot.com',
        apiKey: 'AIzaSyBm_KQeFUa_1_QRPp-S5iQAO4Uc3cA9bs8',
        authDomain: 'ing-sw2-c481e.firebaseapp.com',
        messagingSenderId: '824081761057',
      }),
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()), // Importa AngularFireAuthModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
