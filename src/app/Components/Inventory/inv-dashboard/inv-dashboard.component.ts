import { Component } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-inv-dashboard',
  templateUrl: './inv-dashboard.component.html',
  styleUrls: ['./inv-dashboard.component.scss']
})
export class InvDashboardComponent {

  constructor(
    private app:AppComponent,
  ){
    // this.app.startLoaderDark()

  }

}
