import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-balance',
  templateUrl: './add-balance.component.html',
  styleUrls: ['./add-balance.component.scss']
})
export class AddBalanceComponent {


  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<AddBalanceComponent>,
    public global: GlobalDataModule,
    private msg: NotificationService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
  ) { }

  ngOnInit(): void {
    this.getParty();
    setTimeout(() => {
      $('#supplier').trigger('focus');
    }, 500);

    if (this.editData) {
      this.invoiceNo = this.editData.invoiceNo;
      this.invoiceDate = new Date(this.editData.invoiceDate);
      this.partyType = this.editData.type;

      this.amount = this.editData.amount;

      this.remarks = this.editData.invoiceRemarks;
      this.projectID = this.editData.projectID;
      setTimeout(() => {
        this.getParty();
      }, 200);
      this.partyID = this.editData.partyID
      this.btnType = 'Update';
    }

  }

  partyTypeList: any = [
    { id: 'Customer', title: 'Customer' },
    { id: 'Supplier', title: 'Supplier' },
  ]

  invoiceNo: any = '';
  btnType = 'Save';
  invoiceDate: any = new Date();
  partyID: number = 0;
  partyType = 'Customer';
  amount: any = '';
  remarks: any = '';
  bankReceiptNo: any = '';
  partyList: any = [];
  projectID = this.global.getProjectID();


  getParty() {
    this.http.get(environment.mainApi + this.global.companyLink + 'get' + this.partyType).subscribe(
      (Response) => {
        this.partyList = Response;
      }
    );
  }



  Save() {
    if (this.partyType == '' || this.partyType == undefined) {
      this.msg.WarnNotify('Select Type');
      return;
    }

    if (this.partyID == 0 || this.partyID == undefined) {
      this.msg.WarnNotify('Select Party');
      return;
    }
    if (this.amount == 0 || this.amount == undefined || this.amount == null) {
      this.msg.WarnNotify('Enter Amount');
      return;
    }

    var postData = {
      InvoiceNo: this.invoiceNo,
      InvoiceDate: this.global.dateFormater(this.invoiceDate, '-'),
      Type: this.partyType,
      InvoiceRemarks: this.remarks || '-',
      BankReceiptNo: this.bankReceiptNo || '-',
      PartyID: this.partyID,
      Amount: this.amount,
      ProjectID: this.projectID,
      UserID: this.global.getUserID()
    }

    if (this.btnType == 'Save') {this.insert(postData)}

    if (this.btnType == 'Update') {this.Update(postData);}
  }


  insert(postData:any) {
    $('.loaderDark').show();
    this.http.post(environment.mainApi + this.global.accountLink + 'InsertOpeningBalance', postData).subscribe(
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
        this.http.post(environment.mainApi + this.global.accountLink + 'UpdateOpeningBalance', postData).subscribe(
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
    this.btnType = 'Save';
    this.invoiceDate = new Date();
    this.partyID = 0;
    this.partyType = 'Customer';
    this.amount = '';
    this.remarks = '';
    this.bankReceiptNo = '';
    this.partyList = [];
    this.projectID = 0;
  }

}
