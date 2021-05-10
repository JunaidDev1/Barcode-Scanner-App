import { Component, OnInit } from '@angular/core';
import { DataHelperService } from '../services/data-helper.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { UtilsProviderService } from '../services/utils-provider.service';
import { UserAuthService } from '../services/user-auth.service';
import firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public onLoginForm: FormGroup;
  public loginProcessing: boolean;

  constructor(
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService,
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public utils: UtilsProviderService
  ) { }


  ngOnInit() {
    this.onLoginForm = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
      ])],
      password: ['', Validators.compose([
        Validators.required,
      ])]
    });
  }

  loginAccount(data) {
    const self = this;
    self.loginProcessing = true;
    firebase.auth().signInWithEmailAndPassword(data.email, data.password).then((user) => {
      if (user) {
        self.getUserData(user.user.uid);
      }
    }).catch((e) => {
      self.loginProcessing = false;
      self.utils.createToast(e.message);
    });
  }

  getUserData(uid: string) {
    const self = this;
    firebase.database().ref().child('users/' + uid)
      .once('value', (snapshot) => {
        const user = snapshot.val();
        if (user) {
          self.loginProcessing = false;
          self.userAuth.setUser(user);
          self.navCtrl.navigateRoot(['/tabs']);
        } else {
          self.loginProcessing = false;
          self.utils.createToast('User does not exist!');
        }
      })
      .catch((e) => {
        self.loginProcessing = false;
        self.utils.createToast(e.message);
      });
  }

}
