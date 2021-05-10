import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { UtilsProviderService } from '../services/utils-provider.service';
import firebase from 'firebase';
import { iUser } from '../models/user';


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
        const currentUser: iUser = snapshot.val();
        this.allUsers[uid] = currentUser;
        localStorage.setItem('user', JSON.stringify(currentUser));
        this.publishSomeData({ updateLocalUser: true });
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
