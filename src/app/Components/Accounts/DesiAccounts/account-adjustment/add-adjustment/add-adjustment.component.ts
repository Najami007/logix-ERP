import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-adjustment',
  templateUrl: './add-adjustment.component.html',
  styleUrls: ['./add-adjustment.component.scss']
})
export class AddAdjustmentComponent implements OnInit {


    @Output() updateEmitter = new EventEmitter();


  constructor(
    private http: HttpClient,
    public global: GlobalDataModule,
    private msg: NotificationService,
    private app:AppComponent

  ) { }
  ngOnInit(): void {
    this.getCoa();
  }


  invoiceDate = new Date();

  btnType: any = 'Save';
  projectID: any = this.global.getProjectID();

  debitCoaID: any = 0;
  creditCoaID: any = 0;
  amount: any = 0;
  remarks: any = '';
  debitCoaList: any = [];
  creditCoaList: any = [];

  invoiceDetail: any = [];

  getCoa() {
    this.http.get(environment.mainApi + this.global.accountLink + 'GetVoucherCOA').subscribe(
      (Response: any) => {

        this.debitCoaList = [];
        this.creditCoaList = [];
        if (Response.length > 0) {
          this.debitCoaList = Response.map((e: any, index: any) => {
            (e.indexNo = index + 1);
            return e;
          })
          this.creditCoaList = Response.map((e: any, index: any) => {
            (e.indexNo = index + 1);
            return e;
          })

          this.debitCoaList.sort((a: any, b: any) => b.indexNo - a.indexNo);
          this.creditCoaList.sort((a: any, b: any) => b.indexNo - a.indexNo);


        }
      }
    )
  }


  onCoaChange(type: any) {
    //  this.CoaList[this.CoaList.length].index + 1;

    if (type == 'debit') {
      var index = this.debitCoaList.findIndex((e: any) => e.coaID == this.debitCoaID);
      this.debitCoaList[index].indexNo = this.debitCoaList[0].indexNo + 1;
      this.debitCoaList.sort((a: any, b: any) => b.indexNo - a.indexNo);
    }
      if (type == 'credit') {
      var index = this.creditCoaList.findIndex((e: any) => e.coaID == this.creditCoaID);
      this.creditCoaList[index].indexNo = this.creditCoaList[0].indexNo + 1;
      this.creditCoaList.sort((a: any, b: any) => b.indexNo - a.indexNo);
    }

  }



  invoiceNo: any = '';

  save() {

    if (this.debitCoaID == 0 || this.debitCoaID == null) {
      this.msg.WarnNotify('Select Debit COA');
      return;
    }

    if (this.creditCoaID == 0 || this.creditCoaID == null) {
      this.msg.WarnNotify('Select Credt COA');
      return;
    }

    if (this.amount == 0 || this.amount == '' || this.amount == null || this.amount == undefined) {
      this.msg.WarnNotify('Enter Amount');
      return;
    }





    var postData = {
      InvoiceNo: this.invoiceNo,
      InvoiceDate: this.global.dateFormater(this.invoiceDate, '-'),
      Type: 'JV',
      InvoiceRemarks: this.remarks || '-',
      BankReceiptNo: '-',
      COAID: this.debitCoaID,
      RefCOAID: this.creditCoaID,
      Amount: this.amount,
      ProjectID: this.projectID,
      UserID: this.global.getUserID(),
      PinCode:'',
    }

    if (this.btnType == 'Save') {
      this.insert(postData, 'insert');
    }

    if (this.btnType == 'Update') {
      this.global.openPinCode().subscribe(pin => {
        if (pin != '') {
          postData.PinCode = pin;

          this.insert(postData, 'update');

        }
      })
    }


  }


  insert(postData: any, type: any) {
    var url = '';
    type == 'insert' ? url = 'InsertAccAdjustment' : url = 'UpdateAccAdjustment';


    this.app.startLoaderDark();

    this.http.post(environment.mainApi + this.global.accountLink + url, postData).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.reset();
          this.closeDialog('update');

        } else {
          this.msg.WarnNotify(Response.msg);
        }

        this.app.stopLoaderDark();
      },
      (Error: any) => {
        console.log(Error);
         this.app.stopLoaderDark();
      }
    )
  }








  reset() {

    this.invoiceNo = '';
    this.invoiceDate = new Date();
    this.debitCoaID = 0;
    this.creditCoaID = 0;
    this.amount = 0;
    this.remarks = '';
    this.btnType = 'Save';

  }



  closeDialog(type:any) {
    if(type == 'update'){
      this.updateEmitter.emit('update');
    }else{
      this.updateEmitter.emit('');
    }
  }


}
