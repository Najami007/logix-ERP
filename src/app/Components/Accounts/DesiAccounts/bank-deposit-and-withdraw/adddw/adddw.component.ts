import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-adddw',
  templateUrl: './adddw.component.html',
  styleUrls: ['./adddw.component.scss']
})
export class AdddwComponent implements OnInit {


  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<AdddwComponent>,
    public global: GlobalDataModule,
    private msg: NotificationService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
  ) { }

  ngOnInit(): void {
    this.getSupplier();
    setTimeout(() => {
      $('#type').trigger('focus');
    }, 500);
    this.getCashList();
    this.getBankList();
    this.getRefCoaList();

    if (this.editData) {
      this.invoiceNo = this.editData.invoiceNo;
      this.invoiceDate = new Date(this.editData.invoiceDate);
      this.subType = this.editData.subType;
      this.bankCoaID = this.subType == 'Deposit' ? this.editData.coaid : this.editData.refCOAID;
      this.cashCoaID = this.subType == 'Deposit' ? this.editData.refCOAID : this.editData.coaid;
      this.amount = this.editData.amount;
      this.discount = this.editData.discount;
      this.remarks = this.editData.invoiceRemarks;
      this.bankReceiptNo = this.editData.bankReceiptNo;
      this.projectID = this.editData.projectID;
      this.btnType = 'Update';
    }
  }

  btnType = 'Save';

  invoiceNo = '';
  invoiceDate = new Date();
  supplierBalance = 0;
  amount = 0;
  discount = 0;
  customerList: any = [];
  coaList: any = [];
  coaID = 0;
  refCoaID = 0;
  refCoaList: any = [];
  bankReceiptNo = '-';
  remarks = '';
  partyID = 0;
  projectID = this.global.getProjectID();

  subType = '';
  subTypeList = [{ title: 'Deposit' }, { title: 'Withdrawal' }]


  getSupplier() {
    this.global.getCustomerList().subscribe(
      (Response) => {
        this.customerList = Response;
      }
    )
  }

  bankCoaID = 0;
  cashCoaID = 0;
  cashHeadList: any = [];
  BankList: any = []
  ////////////////////////////////////////////


  getRefCoaList() {



    this.global.getCashBankCoa('CRV').subscribe(
      (Response: any) => {
        Response.forEach((e: any) => {
          this.refCoaList.push(e);
        });
        if (this.invoiceNo == '' && Response.length > 0) {
          this.coaID = this.refCoaList[0].coaID;
        }
      }
    )

    this.global.getCashBankCoa('BRV').subscribe(
      (Response: any) => {
        Response.forEach((e: any) => {
          this.refCoaList.push(e);
        });

      }
    )


  }

  getBankList() {
    this.global.getCashBankCoa('BRV').subscribe(
      (Response: any) => {
        this.BankList = Response;
      }
    )
  }

  getCashList() {
    this.global.getCashBankCoa('CRV').subscribe(
      (Response: any) => {

        this.cashHeadList = Response;
      }
    )




  }


  save() {

    if (this.subType == '' || this.subType == undefined || this.subType == null) {
      this.msg.WarnNotify('Select Transaction Type');
      return;
    } 
     if (this.bankCoaID == 0 || this.bankCoaID == undefined || this.bankCoaID == null) {
      this.msg.WarnNotify('Select Bank Head');
      return;
    } 
     if (this.cashCoaID == 0 || this.cashCoaID == undefined || this.cashCoaID == null) {
      this.msg.WarnNotify('Select Cash Head');
      return;
    } 
     if (this.amount == 0 || this.amount == undefined || this.amount == null) {
      this.msg.WarnNotify('Enter Amount');
      return;
    }

      var postData = {
         InvoiceNo: this.invoiceNo,
        InvoiceDate: this.global.dateFormater(this.invoiceDate, '-'),
        Type: "JV",
        SubType: this.subType,
        InvoiceRemarks: this.remarks || '-',
        BankReceiptNo: this.bankReceiptNo || '-',
        COAID: this.subType == 'Deposit' ? this.bankCoaID : this.cashCoaID,
        RefCOAID: this.subType == 'Deposit' ? this.cashCoaID : this.bankCoaID,
        ProjectID: this.projectID,
        Amount: this.amount,
        UserID: this.global.getUserID()
      }

      if (this.btnType == 'Save') {
        this.insert(postData);
      }

      if (this.btnType == 'Update') {
        this.update(postData);
      }

      console.log(postData);
  }


  insert(postData:any) {
    $('.loaderDark').show();
    this.http.post(environment.mainApi + this.global.accountLink + 'InsertDepositWithdrawal', postData).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.reset();
          this.dialogRef.close('update');

        } else {
          this.msg.WarnNotify(Response.msg);
        }

        $('.loaderDark').fadeOut(500);
      },
      (Error: any) => {
        $('.loaderDark').fadeOut(500);
      }
    )
  }

  update(postData:any) {

    this.global.openPinCode().subscribe(pin => {

      if (pin != '') {
        $('.loaderDark').show();
        postData['PinCode'] = pin;
        this.http.post(environment.mainApi + this.global.accountLink + 'UpdateDepositWithdrawal', postData).subscribe(
          (Response: any) => {
            if (Response.msg == 'Data Updated Successfully') {
              this.msg.SuccessNotify(Response.msg);
              this.reset();
              this.dialogRef.close('update');

            } else {
              this.msg.WarnNotify(Response.msg);
            }

            $('.loaderDark').fadeOut(500);
          },
          (Error: any) => {
            $('.loaderDark').fadeOut(500);
          }
        )
      }
    })

  }



  closeDialog() {
    this.dialogRef.close();
  }


  reset() {
    this.invoiceDate = new Date();
    this.invoiceNo = '';
    this.coaID = 0;
    this.refCoaID = 0;
    this.amount = 0;
    this.discount = 0;
    this.btnType = 'Save';
    this.bankCoaID = 0;
    this.cashCoaID = 0;
    this.subType = '';

  }

}

