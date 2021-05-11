import { Injectable, NgZone } from '@angular/core';
import { iUser } from '../models/user';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DataHelperService } from './data-helper.service';
import { Subject } from 'rxjs';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  public currentUser: iUser = new iUser();
  public fooSubject = new Subject<any>();

  constructor(
    public zone: NgZone,
    public router: Router,
    public navCtrl: NavController,
    public dataHelper: DataHelperService
  ) {
    if (localStorage.getItem('userLoggedIn')) {
      this.getCurrentUser();
    }

    this.dataHelper.getObservable().subscribe((res) => {
      if (res.updateLocalUser) {
        this.getCurrentUser();
      }
    });
  }

  getCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    if (!this.currentUser.totalPoints) {
      this.currentUser.totalPoints = 0;
      this.currentUser.numberOfScans = 0;
    }
  }

  setUser(user: iUser) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('uid', user.uid);
    this.dataHelper.fetchAllData();
  }

  publishSomeData(data: any) {
    this.fooSubject.next(data);
  }

  getObservable(): Subject<any> {
    return this.fooSubject;
  }

  logoutUser() {
    firebase.auth().signOut().then(() => {
      this.navCtrl.navigateRoot(['/login']);
      localStorage.clear();
      this.currentUser = new iUser();
    });
  }

}
