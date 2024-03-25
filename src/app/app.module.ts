import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ReactiveFormsModule } from '@angular/forms';

// ============ FireBase ============
import { initializeApp } from 'firebase/app';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';
// ==================================
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, ReactiveFormsModule, 
    AngularFireAuthModule, AngularFireModule.initializeApp(environment.firebaseConfig)],
  
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  
  bootstrap: [AppComponent],
})
export class AppModule {}

