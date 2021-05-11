import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { UtilsProviderService } from '../services/utils-provider.service';
import { UserAuthService } from '../services/user-auth.service';
import firebase from 'firebase';
import { iScan } from '../models/user';
import { DataHelperService } from '../services/data-helper.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  pointsPerScan: number = 1;

  constructor(
    public utils: UtilsProviderService,
    public userAuth: UserAuthService,
    public dataHelper: DataHelperService,
    public barcodeScanner: BarcodeScanner
  ) { }

  scanBarcode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.increaseUserPoints();
      this.saveThisScan(barcodeData.text);
      this.dataHelper.getAllScans();
    }).catch(err => {
      this.utils.createToast(err);
    });
  }

  increaseUserPoints() {
    this.userAuth.currentUser.totalPoints += this.pointsPerScan;
    this.userAuth.currentUser.numberOfScans++;
    this.userAuth.currentUser.lastScanTimestamp = Number(new Date());
    firebase.database().ref().child(`/users/${this.userAuth.currentUser.uid}`)
      .set(this.userAuth.currentUser).then(() => {
        this.utils.createToast('You have gained a point!');
      });
  }

  saveThisScan(scanText: string) {
    const postObj: iScan = new iScan();
    postObj.uid = this.userAuth.currentUser.uid;
    postObj.timestamp = Number(new Date());
    postObj.scanItem = scanText;
    postObj.points = this.pointsPerScan;
    firebase.database().ref().child('scans').push(postObj);
  }

}
