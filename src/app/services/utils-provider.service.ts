import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UtilsProviderService {

  public loader: any;

  constructor(
    public camera: Camera,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertController: AlertController) {
  }

  async presentLoading(message?) {
    if (!this.loader) {
      this.loader = await this.loadingCtrl.create({
        message: message || ''
      });
      await this.loader.present();
    }
  }

  stopLoading() {
    if (this.loader) {
      this.loader.dismiss();
      this.loader = null;
    }
  }

  async createToast(mess) {
    const toast = await this.toastCtrl.create({
      message: mess,
      duration: 3000,
      color: 'primary'
    });
    toast.present();
  }

  async openCameraOptions() {
    let clickAction: string;
    const alert = await this.alertController.create({
      header: 'Update Picture!',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
            clickAction = 'gallery';
          }
        }, {
          text: 'Camera',
          handler: () => {
            clickAction = 'camera';
          }
        }
      ]
    });
    await alert.present();
    await alert.onWillDismiss();
    return clickAction && (clickAction === 'camera' ? this.openPhotoPicker(100, 1) : this.openPhotoPicker(50, 2));
  }

  openPhotoPicker(quality: number, sourceType: number) {
    const self = this;
    const options: CameraOptions = {
      destinationType: self.camera.DestinationType.DATA_URL,
      encodingType: self.camera.EncodingType.JPEG,
      mediaType: self.camera.MediaType.PICTURE,
      correctOrientation: true,
      allowEdit: true,
      quality: quality,
      sourceType: sourceType,
    };

    return self.camera.getPicture(options).then((imageData: string) => {
      return `data:image/jpeg;base64,${imageData}`;
    }, (err) => {
      self.createToast(err);
    });
  }

  async uploadImageOnFirebase(imageData: string, storagePath: string): Promise<string> {
    const self = this;
    self.presentLoading();
    const storageRef = firebase.storage().ref();
    const filename = Math.floor(Date.now() / 1000);
    const imageRef = storageRef.child(`${storagePath}/${filename}.jpg`);

    try {
      const snapshot = await imageRef.putString(imageData, firebase.storage.StringFormat.DATA_URL);
      const url: string = await firebase.storage().ref(`${storagePath}/` + snapshot.metadata.name).getDownloadURL();
      self.stopLoading();
      return url;
    } catch (e) {
      self.stopLoading();
      self.createToast('Error! try again later!');
    }
  }

}
