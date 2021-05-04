import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  topScorersList: any[] = [
    { fullName: 'John Doe', totalPoints: 20, scans: 12 },
    { fullName: 'Sam Doe', totalPoints: 18, scans: 11 },
    { fullName: 'Marrie Doe', totalPoints: 17, scans: 9 },
    { fullName: 'Anna Doe', totalPoints: 17, scans: 8 },
    { fullName: 'Darren Doe', totalPoints: 16, scans: 7 },
    { fullName: 'Sammy Doe', totalPoints: 15, scans: 7 },
    { fullName: 'Sam Doe', totalPoints: 12, scans: 6 },
    { fullName: 'Marrie Doe', totalPoints: 10, scans: 6 },
    { fullName: 'Anna Doe', totalPoints: 7, scans: 5 },
    { fullName: 'Darren Doe', totalPoints: 6, scans: 3 },
  ]

  constructor() { }

}
