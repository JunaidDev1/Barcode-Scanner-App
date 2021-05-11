import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { UtilsProviderService } from '../services/utils-provider.service';
import firebase from 'firebase';
import { iScan, iUser } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class DataHelperService {

  fooSubject = new Subject<any>();
  allUsers: any = {};
  allScans: iScan[] = [];

  constructor(
    public zone: NgZone,
    public utils: UtilsProviderService,
  ) {
    if (localStorage.getItem('userLoggedIn')) {
      this.fetchAllData();
    }
  }

  fetchAllData() {
    this.getAllUsers();
    this.getAllScans();
  }

  getAllUsers() {
    const self = this;
    firebase.database().ref().child('users')
      .once('value', (snapshot) => {
        self.allUsers = snapshot.val();
        self.getCurrentUser();
      });
  }

  getCurrentUser() {
    const uid = localStorage.getItem('uid');
    firebase.database().ref().child(`/users/${uid}`)
      .on('value', (snapshot) => {
        const currentUser: iUser = snapshot.val();
        this.allUsers[uid] = currentUser;
        localStorage.setItem('user', JSON.stringify(currentUser));
        this.publishSomeData({ updateLocalUser: true });
      });
  }

  getAllScans() {
    const self = this;
    self.allScans = [];
    firebase.database().ref().child('scans')
      .once('value', (snapshot) => {
        const allScans = snapshot.val();
        for (const key in allScans) {
          self.allScans.push(allScans[key]);
        }
      });
  }

  public deepCloneData(data: any): any {
    if (data) {
      return JSON.parse(JSON.stringify(data));
    }
  }

  public publishSomeData(data: any) {
    this.fooSubject.next(data);
  }

  public getObservable(): Subject<any> {
    return this.fooSubject;
  }

}
