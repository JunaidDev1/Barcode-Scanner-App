import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Camera } from '@ionic-native/camera/ngx';
import firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyAZVBGB1C0jOY6g1s2A6n48NAjmF1D_HQA",
  authDomain: "my-leadership.firebaseapp.com",
  databaseURL: "https://my-leadership-default-rtdb.firebaseio.com",
  projectId: "my-leadership",
  storageBucket: "my-leadership.appspot.com",
  messagingSenderId: "600879322209",
  appId: "1:600879322209:web:325c7bfb0d9cf810670620",
  measurementId: "G-HM39SREYT5"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    Camera,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
