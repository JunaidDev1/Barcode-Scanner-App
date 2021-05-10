import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { iUser } from '../models/user';
import { DataHelperService } from '../services/data-helper.service';
import { UserAuthService } from '../services/user-auth.service';
import { UtilsProviderService } from '../services/utils-provider.service';
import firebase from 'firebase';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  imageData: string;
  newProfileImage: boolean;
  currentUser: iUser = new iUser();

  constructor(
    public utils: UtilsProviderService,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService,
    public alertController: AlertController,
  ) { }

  ionViewWillEnter() {
    this.currentUser = this.dataHelper.deepCloneData(this.userAuth.currentUser);
    this.imageData = this.currentUser.profileUrl;
  }

  updateProfile() {
    this.newProfileImage ? this.saveImage() : this.updateDataOnFirebase();
  }

  openCameraOptions() {
    this.utils.openCameraOptions().then((res: any) => {
      if (res) {
        this.newProfileImage = true;
        this.imageData = res;
      }
    });
  }

  saveImage() {
    const storagePath: string = 'profileImages';
    this.utils.uploadImageOnFirebase(this.imageData, storagePath)
      .then((fileUrl: string) => {
        this.newProfileImage = false;
        this.currentUser.profileUrl = fileUrl;
        this.updateDataOnFirebase();
      });
  }

  updateDataOnFirebase() {
    firebase.database().ref().child(`/users/${this.currentUser.uid}`)
      .set(this.currentUser).then(() => {
        this.utils.createToast('Profile updated!');
      });
  }

}
