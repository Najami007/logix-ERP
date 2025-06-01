import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { error } from 'jquery';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-withdrawal',
  templateUrl: './add-withdrawal.component.html',
  styleUrls: ['./add-withdrawal.component.scss']
})
export class AddWithdrawalComponent {

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<AddWithdrawalComponent>,
    public global: GlobalDataModule,
    private msg: NotificationService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      $('#supplier').trigger('focus');
    }, 500);
    this.getCoaList();
    if (this.editData) {
      this.invoiceNo = this.editData.invoiceNo;
      this.invoiceDate = new Date(this.editData.invoiceDate);
      this.paymentType = this.editData.type;
      this.coaID = this.editData.coaid;
      this.amount = this.editData.amount;
      this.discount = this.editData.discount;
      this.remarks = this.editData.invoiceRemarks;
      this.bankReceiptNo = this.editData.bankReceiptNo;
      this.projectID = this.editData.projectID;
      setTimeout(() => {
        this.getCoaList();
      }, 200);
      this.btnType = 'Update';
    }
    this.getCoaList();
  }


  btnType = 'Save';
  invoiceNo = '';
  invoiceDate = new Date();
  bankReceiptNo = '';
  supplierBalance = 0;
  amount = 0;
  discount: any = 0;
  supplierList: any = [];
  coaList: any = [];
  coaID = 0;
  remarks = '';
  projectID = this.global.getProjectID();
  paymentTypeList = [{ value: 'CPV', title: 'Cash' }, { value: 'BPV', title: 'Bank' },];

  paymentType = 'CPV';





  ////////////////////////////////////////////

  getCoaList() {


    this.global.getCashBankCoa(this.paymentType).subscribe(
      (Response: any) => {
        this.coaList = Response;
        if (this.invoiceNo == '' && Response.length > 0) {
          this.coaID = Response[0].coaID;
        }
      },
      (Error) => {

      }
    )
  }


  //////////////////////////////////////////

  Save() {
    if (this.paymentType == '' || this.paymentType == undefined) {
      this.msg.WarnNotify('Select Payment Type')
      return;
    }
    if (this.coaID == 0 || this.coaID == undefined) {
      this.msg.WarnNotify('Select COA');
      return;
    }
    if (this.amount == 0 || this.amount == undefined || this.amount == null) {
      this.msg.WarnNotify('Enter Amount');
      return;
    }


    var postData = {
      InvoiceNo: this.invoiceNo,
      InvoiceDate: this.global.dateFormater(this.invoiceDate, '-'),
      Type: this.paymentType,
      InvoiceRemarks: this.remarks || '-',
      BankReceiptNo: this.bankReceiptNo || '-',
      COAID: this.coaID,
      Amount: this.amount,
      ProjectID: this.projectID,
      UserID: this.global.getUserID()
    }

    if (this.btnType == 'Save') {
      this.insert(postData)
    }

    if (this.btnType == 'Update') {
      this.Update(postData);
    }



  }


  insert(postData:any) {
    $('.loaderDark').show();
    this.http.post(environment.mainApi + this.global.accountLink + 'InsertProfitWithdrawal', postData).subscribe(
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

  Update(postData:any) {

    this.global.openPinCode().subscribe(pin => {
      if (pin != '') {
        $('.loaderDark').show();
        postData['PinCode'] = pin;
        this.http.post(environment.mainApi + this.global.accountLink + 'UpdateProfitWithdrawal', postData).subscribe(
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
    this.invoiceNo = '';
    this.invoiceDate = new Date();
    this.paymentType = '';
    this.coaID = 0;
    this.amount = 0;
    this.discount = 0;
    this.remarks = '';
    this.btnType = 'Save';

  }


}

