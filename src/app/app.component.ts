import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private platform: Platform,
    public navCtrl: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (localStorage.getItem('userLoggedIn')) {
        this.navCtrl.navigateRoot(['/tabs']);
      }
    });
  }

}
