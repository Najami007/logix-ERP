import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-chart-of-account',
  templateUrl: './add-chart-of-account.component.html',
  styleUrls: ['./add-chart-of-account.component.scss']
})
export class AddChartOfAccountComponent implements OnInit  {


  @Input()  notesList:any = [];

  constructor(
    private http: HttpClient,
    public global: GlobalDataModule,
    private msg: NotificationService,
    private dialogue: MatDialog
  ) { }
  ngOnInit(): void {
  }


  hideLevel1 = false;
  hideLevel2 = false;
  hideLevel3 = false;
  hideLevel4 = false;

  

  CoaType = 0;
  coaLevel: any;
  level1 = '';
  level2 = '';
  level3 = '';
  level4 = '';
  CoaTitle = '';
  NoteID: any = 0;
  TransactionAllowed: any = false;
  alias: any = 'other';
  // getNotes() {
  //   this.http.get(environment.mainApi + this.global.accountLink + 'GetNote').subscribe(
  //     (Response) => {
  //       this.notesList = Response;
  //     }

  //   )
  // }

  


  Allow = [
    { value: true, text: 'Yes' },

  ]

}
