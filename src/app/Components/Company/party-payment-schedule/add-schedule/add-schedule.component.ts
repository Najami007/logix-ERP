import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-schedule',
  templateUrl: './add-schedule.component.html',
  styleUrls: ['./add-schedule.component.scss']
})
export class AddScheduleComponent implements OnInit {


  @Output() updateEmitter = new EventEmitter();


  crudList: any = []

  constructor(private http: HttpClient,
    private msg: NotificationService,
    private global: GlobalDataModule,
    private app: AppComponent,
    private route: Router

  ) {


    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    });

  }
  ngOnInit(): void {
    this.getPartyList();
  }


  btnType = 'Save';

  autoClose = true;
  psID = 0;
  partyID: any = 0;
  amount: any = 0;
  paymentDate = new Date();
  remarks = '';
  paymentScheduleType: any = '';
  PaymentDay: any = '';


  partyList: any = [];
  partyBalance: any = [];
  getPartyList() {
    this.global.getPartyList().subscribe(
      (Response) => {
        this.partyList = Response;
      }
    )
  }


  getSupplierBalance() {
    var partyType = this.partyList.find((e: any) => e.partyID == this.partyID).partyType;
    var reqType = partyType == 'Supplier' ? 'sup' : 'cus';
    this.http.get(environment.mainApi + this.global.accountLink + 'getcussupbalance?reqtype=' + reqType + '&reqpartyid=' + this.partyID).subscribe(
      (Response: any) => {
        this.partyBalance = Response[0].amount;
      }
    )
  }



  save() {

    if (this.partyID == 0) {
      this.msg.WarnNotify('Select Party');
      return;
    }

    if (this.amount == 0 || this.amount == '' || this.amount == null) {
      this.msg.WarnNotify('Enter Amount');
      return;
    }

    var postData = {
      PsID: this.psID,
      PaymentScheduleType: 'Datewise',
      PartyID: this.partyID,
      PaymentDate: this.global.dateFormater(this.paymentDate, '-'),
      PaymentDay: '-',
      Amount: this.amount,
      PinCode: '',
      UserID: this.global.getUserID(),


    }


    if (this.btnType == 'Save') {
      this.insert(postData, 'insert')
    }

    if (this.btnType == 'Update') {
      this.global.openPinCode().subscribe(pin => {
        if (pin != '') {
          postData['PinCode'] = pin;
          this.insert(postData, 'Update');
        }
      })
    }




  }

  insert(postData: any, type: any) {

    var urlType = type == 'insert' ? 'InsertPaymentSchedule' : 'UpdatePaymentSchedule'

    var url = `${environment.mainApi + this.global.accountLink + urlType}`;
    this.app.startLoaderDark();
    this.http.post(url, postData).subscribe(
      {
        next: (Response: any) => {
          if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.closeEmitter(this.autoClose);
          } else {
            this.msg.WarnNotify(Response.msg);
          }

          this.app.stopLoaderDark();
        },
        error: (error: any) => {
          console.log(error);
          this.app.stopLoaderDark();

        }
      }
    )
  }

  closeEmitter(closeCheck:any) {
    this.reset();
    this.updateEmitter.emit(closeCheck);

  }

  

  reset() {
    this.psID = 0;
    this.partyID = 0;
    this.partyBalance = 0;
    this.paymentDate = new Date();
    this.amount = 0;
    this.remarks = '';
    this.btnType = 'Save';
  }

}
