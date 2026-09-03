import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import { AddScheduleComponent } from './add-schedule/add-schedule.component';

@Component({
  selector: 'app-party-payment-schedule',
  templateUrl: './party-payment-schedule.component.html',
  styleUrls: ['./party-payment-schedule.component.scss']
})
export class PartyPaymentScheduleComponent {

  @ViewChild(AddScheduleComponent) addSchedule: any;

  page: number = 1;
  count: number = 0;

  tableSize: number = 0;
  tableSizes: any = [];

  onTableDataChange(event: any) {

    this.page = event;
    this.getSavedData();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getSavedData();
  }


  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };

  constructor(private http: HttpClient,
    private msg: NotificationService,
    private dialogue: MatDialog,
    private globaldata: GlobalDataModule,
    private app: AppComponent,
    private route: Router

  ) {


    this.globaldata.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    });

    this.globaldata.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

  }
  ngOnInit(): void {
    this.globaldata.setHeaderTitle('Payment Schedule');
    this.getSavedData();
    this.getPartyNatureList();

    this.tableSize = this.globaldata.paginationDefaultTalbeSize;
    this.tableSizes = this.globaldata.paginationTableSizes;


  }

  fromDate: any = new Date();
  toDate: any = new Date();
  savedDataList: any = [];
  tmpSavedDataList:any = [];


  partyNatureID = 0;
  partyNatureList: any = [];
  getPartyNatureList() {
    this.http.get(environment.mainApi + this.globaldata.companyLink + 'GetPartyNature').subscribe(
      (Response) => {
        this.partyNatureList = Response;
      },
      (Error) => {
        console.log(Error);
        this.msg.WarnNotify('Error Occured')
      }
    )
  }




  add() {

    this.globaldata.openBootstrapModal('#addScheduleModal', true);

  }


  closeModal(check: any) {
    if (check) this.globaldata.closeBootstrapModal('#addScheduleModal', true);
    this.getSavedData();
  }



  edit(item: any) {

    this.addSchedule.psID = item.psID;
    this.addSchedule.partyID = item.partyID;
    this.addSchedule.paymentDate = new Date(item.paymentDate);
    this.addSchedule.amount = item.amount;
    this.addSchedule.remarks = item.remarks;
    this.addSchedule.btnType = 'Update';
    this.globaldata.openBootstrapModal('#addScheduleModal', true);


  }

  getSavedData() {

    var fromDate = this.globaldata.dateFormater(this.fromDate, '');
    var toDate = this.globaldata.dateFormater(this.toDate, '');

    this.http.get(`${environment.mainApi + this.globaldata.accountLink}GetPsData?FromDate=${fromDate}&ToDate=${toDate}`).subscribe(
      (Response: any) => {
        this.tmpSavedDataList = Response;
        this.savedDataList = Response;
        this.filterByNature();
      },
      (Error: any) => {
        console.log(Error);
      }
    )
  }


  filterByNature(){
    if(this.partyNatureID == 0){
      this.savedDataList = this.tmpSavedDataList;
    }
    if(this.partyNatureID > 0){
      this.savedDataList = this.tmpSavedDataList.filter((e:any)=> e.partyNatureID == this.partyNatureID)
    }
  }




  delete(row: any) {


    this.globaldata.openPinCode().subscribe(pin => {
      if (pin != '') {

        //////on confirm button pressed the api will run
        this.http.post(environment.mainApi + this.globaldata.accountLink + 'DeletePaymentSchedule', {
          PsID: row.psID,
          PinCode: pin,
          UserID: this.globaldata.getUserID(),
        }).subscribe(
          (Response: any) => {
            if (Response.msg == 'Data Deleted Successfully') {
              this.msg.SuccessNotify(Response.msg);
              this.getSavedData();
            } else {
              this.msg.WarnNotify(Response.msg);
            }
          }
        )

      }
    })


  }


  print() {
    this.globaldata.printData('#printRpt');

  }



}

