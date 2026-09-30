import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

import * as $ from 'jquery';

@Component({
  selector: 'app-add-sales',
  templateUrl: './add-sales.component.html',
  styleUrls: ['./add-sales.component.scss']
})
export class AddSalesComponent implements OnInit {



  constructor(
    private http: HttpClient,

    public global: GlobalDataModule,
    private msg: NotificationService,
    private dialogRef: MatDialogRef<AddSalesComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,
  ) { }
  ngOnInit(): void {
    this.GetChartOfAccount()

    if (this.editData) {
      this.invoiceNo = this.editData.invoiceNo;
      this.invoiceDate = new Date(this.editData.invoiceDate);
      this.remarks = this.editData.invoiceRemarks;

      this.extractEditDetail(this.invoiceNo);
      this.btnType = 'Update';
    }

  }



  extractEditDetail(invoiceNo: string): void {
    this.http.get(
      `${environment.mainApi}${this.global.accountLink}GetSpecificVocherDetail?InvoiceNo=${invoiceNo}`
    ).subscribe({
      next: (response: any) => {
        if (!response?.length) {
          return;
        }

        const creditMap = new Map(response.map(e => [e.coaid, e.credit]));
        const debitMap = new Map(response.map(e => [e.coaid, e.debit]));

        this.applyAmount(this.salesList, creditMap, 'creditAmount');
        this.applyAmount(this.CashBankList, debitMap, 'debitAmount');
        this.applyAmount(this.inventoryList, creditMap, 'creditAmount');
        this.applyAmount(this.CGSList, debitMap, 'debitAmount');

        this.netSales = this.salesList.reduce((sum, e) => sum + (+e.creditAmount || 0), 0);

        this.getTotal();
      },
      error: (error) => {
        console.error(error);
        this.msg.WarnNotify('Error occurred while loading voucher detail.');
      }
    });
  }

  private applyAmount(list: any[], amountMap: any, field: 'creditAmount' | 'debitAmount'): void {
    list.forEach(item => {
      if (amountMap.has(item.coaID)) {
        item[field] = amountMap.get(item.coaID);
      }
    });
  }





  btnType = 'Save';

  invoiceNo = '';
  invoiceDate = new Date();
  remarks: any = '';

  netSales = 0;


  inventoryList: any = [];
  CGSList: any = [];
  CashBankList: any = [];
  salesList: any = [];
  GetChartOfAccount() {
    this.http.get(environment.mainApi + this.global.accountLink + 'GetChartOfAccount').subscribe({
      next: (value: any) => {
        const mapCoa = (list: any[]) =>
          list.map((e: any) => ({
            coaID: e.coaID,
            coaTitle: e.coaTitle,
            debitAmount: 0,
            creditAmount: 0,
            detailNarration: ''
          }));

        this.inventoryList = mapCoa(value.filter((e: any) => e.alias == 'inv'));
        this.CGSList = mapCoa(value.filter((e: any) => e.alias == 'cgs'));
        this.CashBankList = mapCoa(value.filter((e: any) => e.alias == 'cash' || e.alias == 'bank'));
        this.salesList = mapCoa(value.filter((e: any) => e.alias == 'sales'));


        this.btnType == 'Update' ? this.extractEditDetail(this.invoiceNo) : ''

      },
      error: error => {
        console.log(error);
        this.msg.WarnNotify('Failed to load chart of accounts');
      }
    });
  }


  isSubmitting = false;

  save() {

    if (this.isSubmitting) {
      return; // guard against double-clicks
    }

    if (!this.netSales || this.netSales <= 0) {
      this.msg.WarnNotify('Please enter Net Sales amount');
      return;
    }

    if (this.salesTotal != this.netSales) {
      this.msg.WarnNotify('Sales Amount are not Equal');
      return;
    }

    if (this.cashBankTotal <= 0) {
      this.msg.WarnNotify('Enter Cash or Bank');
      return;
    }

    if (this.cashBankTotal != this.netSales) {
      this.msg.WarnNotify('Cash/Bank And Net Sales are not Equal');
      return;
    }

    if (this.inventoryList[0].creditAmount <= 0 || this.inventoryList[0].creditAmount == '' || this.inventoryList[0].creditAmount == null) {
      this.msg.WarnNotify('Enter Inventory Value');
      return;
    }

    const allEntries = [
      ...this.salesList,
      ...this.inventoryList,
      ...this.CGSList,
      ...this.CashBankList
    ].filter(e => e.debitAmount || e.creditAmount); // only lines the user actually filled in

    // if (!allEntries.length) {
    //   return;
    // }



    var PostData = {
      InvoiceDate: this.global.dateFormater(this.invoiceDate, '-'),
      transactionType: this.btnType == 'Save' ? 'Insert' : 'Update',
      InvoiceNo: this.invoiceNo,
      RefCOAID: 0,
      Type: 'JV',
      InvoiceRemarks: this.remarks || '-',
      ProjectID: this.global.getProjectID(),
      BankReceiptNo: '',
      VoucherDocument: '-',
      InvoiceDetail: JSON.stringify(allEntries.map(e => ({
        COAID: e.coaID,
        coaTitle: e.coaTitle,
        Debit: +e.debitAmount,
        Credit: +e.creditAmount,
        DetailNarration: +e.detailNarration,
      }))),
      UserID: this.global.getUserID(),
      PinCode: '',
    };


    if (this.isSubmitting) {
      return; // guard against double-clicks
    }
    this.isSubmitting = true;


    if (this.btnType == 'Save') {

      this.insert(PostData)
    }
    if (this.btnType == 'Update') {

      this.global.openPinCode().subscribe(pin => {
        if (pin) {

          PostData.PinCode = pin;
          this.insert(PostData);
        } else {
          this.isSubmitting = false;
        }
      });
    }


  }

  insert(PostData: any) {
    $('.loaderDark').show();
    this.http.post(environment.mainApi + this.global.accountLink + 'InsertBtpClosingJV', PostData)
      .subscribe({
        next: (Response: any) => {

          if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.dialogRef.close(true);
          } else {
            this.msg.WarnNotify(Response.msg);
            this.isSubmitting = false;

          }

          $('.loaderDark').fadeOut(500);
        },
        error: (error) => {
          console.log(error);
          $('.loaderDark').fadeOut(500);
          this.isSubmitting = false;
        }
      });

  }


  salesTotal = 0;
  cashBankTotal = 0;

  getTotal() {
    const sales = [...this.salesList];
    const cashBank = [...this.CashBankList];


    this.salesTotal = sales.reduce((sum, e) => sum + (+e.creditAmount || 0), 0);
    this.cashBankTotal = cashBank.reduce((sum, e) => sum + (+e.debitAmount || 0), 0);

    this.CGSList[0].debitAmount = this.inventoryList[0].creditAmount;


  }




  closeDialog() {
    this.dialogRef.close();
  }

}
