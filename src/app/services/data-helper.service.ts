import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { UtilsProviderService } from '../services/utils-provider.service';
import firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class DataHelperService {

  fooSubject = new Subject<any>();
  allUsers: any = {};

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
        localStorage.setItem('user', JSON.stringify(snapshot.val()));
        this.publishSomeData({ updateLocalUser: true });
      });
  }

  public publishSomeData(data: any) {
    this.fooSubject.next(data);
  }

  public getObservable(): Subject<any> {
    return this.fooSubject;
  }

}
