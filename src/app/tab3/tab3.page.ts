import { Component } from '@angular/core';
import { iLeaderboard } from '../models/user';
import { DataHelperService } from '../services/data-helper.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  topScorersList: iLeaderboard[] = [];

  constructor(
    public dataHelper: DataHelperService
  ) { }

  ionViewWillEnter() {
    this.getLastWeekTopScorers();
  }

  getLastWeekTopScorers() {
    this.topScorersList = [];
    const allScansOfLastWeek = this.dataHelper.allScans.filter(x => this.isScannedInLastWeek(x.timestamp));
    allScansOfLastWeek.forEach(x => {
      if (this.isAlreadyInList(x.uid) >= 0) {
        const index = this.isAlreadyInList(x.uid);
        this.topScorersList[index].numberOfScans++;
        this.topScorersList[index].totalPoints += x.points;
      } else {
        const temp: iLeaderboard = new iLeaderboard();
        temp.user = this.dataHelper.allUsers[x.uid];
        temp.numberOfScans = 1;
        temp.totalPoints = x.points;
        this.topScorersList.push(temp);
      }
    });
    this.topScorersList.sort((a, b) => b.totalPoints - a.totalPoints);
  }

  isScannedInLastWeek(scanTimestamp: number): boolean {
    const oneDayTimestamp: number = 86400000;
    const startTimestampOfLastWeek: number = Number(new Date()) - (oneDayTimestamp * 7);
    return scanTimestamp >= startTimestampOfLastWeek;
  }

  isAlreadyInList(uid: string): number {
    return this.topScorersList.findIndex(item => item.user.uid === uid);
  }

}
