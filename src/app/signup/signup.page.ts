import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { UtilsProviderService } from '../services/utils-provider.service';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { Router } from '@angular/router';
import firebase from 'firebase';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  public onRegisterForm: FormGroup;

  constructor(
    public alertController: AlertController,
    public formBuilder: FormBuilder,
    public router: Router,
    public utils: UtilsProviderService,
    public navCtrl: NavController,
    public dataHelper: DataHelperService,
    public userAuth: UserAuthService
  ) { }

  ngOnInit() {
    this.onRegisterForm = this.formBuilder.group({
      fullName: ['', Validators.compose([
        Validators.required
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
      ])],
      password: ['', Validators.compose([
        Validators.required,
      ])],
      cPassword: ['', Validators.compose([
        Validators.required
      ])],
    });
  }

  createAccount(data) {
    const self = this;
    if (data.password !== data.cPassword) {
      self.utils.createToast('Passwords do not match!');
    } else {
      self.utils.presentLoading();
      firebase.auth().createUserWithEmailAndPassword(data.email, data.password).then((user) => {
        if (user) {
          data.uid = firebase.auth().currentUser.uid;
          self.saveDatatoUserTableAfterRegister(data);
        }
      })
        .catch((error) => {
          self.utils.stopLoading();
          self.utils.createToast(error.message);
        });
    }
  }

  saveDatatoUserTableAfterRegister(data) {
    const self = this;
    data.password = null;
    data.cPassword = null;
    data.timestamp = Number(new Date());
    const updates = {};
    updates['/users/' + data.uid] = data;
    firebase.database().ref().update(updates).then(() => {
      self.utils.stopLoading();
      self.userAuth.setUser(data);
      self.navCtrl.navigateRoot(['/tabs']);
    });
  }

}
