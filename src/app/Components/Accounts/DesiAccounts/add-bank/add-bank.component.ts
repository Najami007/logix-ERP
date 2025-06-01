import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-bank',
  templateUrl: './add-bank.component.html',
  styleUrls: ['./add-bank.component.scss']
})
export class AddBankComponent implements OnInit {

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

  }
  ngOnInit(): void {
    this.globaldata.setHeaderTitle('ADD BANK');
    this.getBankList();



  }

  txtSearch: any;
  coaTitle: any;
  coaID: number = 0;
  btnType: any = 'Save';
  description: any;
  noteID: any = 0;

  bankList: any = [];





  getBankList() {
    this.http.get(environment.mainApi + this.globaldata.accountLink + 'getvouchercbcoa?type=BPV').subscribe(
      (Response: any) => {
        this.bankList = Response;

      }
    )
  }




  save() {
    if (this.coaTitle == '' || this.coaTitle == undefined) {
      this.msg.WarnNotify('Enter Bank Title');
      return;
    }

    var postData: any = {
      CoaID: this.coaID,
      CoaTitle: this.coaTitle,
      NoteID: this.noteID,
      Alias: 'Bank',
      UserID: this.globaldata.getUserID()
    }

    if (this.btnType == 'Save') {
      this.insert(postData);
    } else if (this.btnType == 'Update') {
      this.update(postData);
    }
  }




  insert(postData: any) {
    this.app.startLoaderDark();
    this.http.post(environment.mainApi + this.globaldata.accountLink + 'InsertBank', postData).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.getBankList();
          this.reset();
          this.app.stopLoaderDark();

        } else {
          this.msg.WarnNotify(Response.msg);
          this.app.stopLoaderDark();
        }
      },
      (error: any) => {
        this.app.stopLoaderDark();
      }
    )
  }

  update(postData: any) {

    this.globaldata.openPinCode().subscribe(pin => {
      if (pin != '') {

        this.app.startLoaderDark();
        postData['PinCode'] = pin;
        this.http.post(environment.mainApi + this.globaldata.accountLink + 'UpdateChartofAccount', postData).subscribe(
          (Response: any) => {
            if (Response.msg == 'Data Updated Successfully') {
              this.msg.SuccessNotify(Response.msg);
              this.getBankList();
              this.reset();
              this.app.stopLoaderDark();
            } else {
              this.msg.WarnNotify(Response.msg);
              this.app.stopLoaderDark();
            }
          }
        )
      }
    })

  }



  reset() {
    this.coaTitle = '';
    this.coaID = 0;
    this.description = '';
    this.btnType = 'Save';

  }


  edit(row: any) {
    this.coaID = row.coaID;
    this.noteID = row.noteID;
    this.coaTitle = row.coaTitle;
    this.btnType = 'Update';
  }


  ///////////////////////////////////////////////////////////////////////////////
  delete(row: any) {
    this.globaldata.openPinCode().subscribe(pin => {
      if (pin != '') {

        this.app.startLoaderDark();
        this.http.post(environment.mainApi + this.globaldata.accountLink + 'DeleteChartOfAccount', {
          CoaID: row.coaID,
          PinCode: pin,
          AccountCode: row.accountCode,
          UserID: this.globaldata.getUserID(),
        }).subscribe(
          (Response: any) => {
            if (Response.msg == "Data Deleted Successfully") {
              this.msg.SuccessNotify(Response.msg);
              this.getBankList();
            } else {
              this.msg.WarnNotify(Response.msg);
            }
            this.app.stopLoaderDark();
          },
          (error: any) => {
            this.app.stopLoaderDark();
          }
        )

      }
    })

  }

}
