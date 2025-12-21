import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddpartyComponent } from 'src/app/Components/Company/party/addparty/addparty.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { environment } from 'src/environments/environment.development';
import { VoucherDetailsComponent } from 'src/app/Components/Accounts/CommonComponent/voucher-details/voucher-details.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {



  page: number = 1;
  count: number = 0;

  tableSize: number = 0;
  tableSizes: any = [];

  onTableDataChange(event: any) {

    this.page = event;
    this.getPayments();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getPayments();
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
    this.globaldata.setHeaderTitle('Payment');
    this.getPayments();

    this.tableSize = this.globaldata.paginationDefaultTalbeSize;
    this.tableSizes = this.globaldata.paginationTableSizes;


  }

  paymentList: any = [];


  addPayment() {
    this.dialogue.open(AddPaymentComponent, {
      width: '30%',
    }).afterClosed().subscribe(value => {
      if (value == 'update') {
        this.getPayments();
      }
    })
  }



  getPayments() {
    this.http.get(environment.mainApi + this.globaldata.accountLink + 'GetPayRec?reqType=PAY').subscribe(
      (Response: any) => {
        this.paymentList = Response;
       
      },
      (Error: any) => {
        this.msg.WarnNotify(Error);
      }
    )
  }

  edit(item: any) {
    console.log(item);
    this.dialogue.open(AddPaymentComponent, {
      width: '30%',
      data: item,
    }).afterClosed().subscribe(value => {
      if (value == 'update') {
        this.getPayments();
      }
    })
  }



  delete(row: any) {


    this.globaldata.openPinCode().subscribe(pin => {
      if (pin != '') {

        //////on confirm button pressed the api will run
        this.http.post(environment.mainApi + this.globaldata.accountLink + 'DeleteVoucher', {
          InvoiceNo: row.invoiceNo,
          PinCode: pin,
          UserID: this.globaldata.getUserID(),
        }).subscribe(
          (Response: any) => {
            if (Response.msg == 'Data Deleted Successfully') {
              this.msg.SuccessNotify(Response.msg);
              this.getPayments();
            } else {
              this.msg.WarnNotify(Response.msg);
            }
          }
        )



      }
    })


  }



  VoucherDetails(row: any) {
    this.dialogue.open(VoucherDetailsComponent, {
      width: "40%",
      data: row,
    }).afterClosed().subscribe(val => {

    })
  }



  //////////////// print Variables/////////////////////

  lblInvoiceNo: any;
  lblInvoiceDate: any;
  lblRemarks: any;
  lblVoucherType: any;
  lblProjectName: any;
  lblVoucherTable: any;
  lblDebitTotal: any;
  lblCreditTotal: any;
  lblVoucherPrintDate = new Date();
  lblPartyBalance = 0;
  lblPartyType = '';
  lblInvAmount = 0;
  lblPartyName = '';
  ///////////////////////////////////////////////////

  printBill(row: any) {


    this.lblInvoiceNo = row.invoiceNo;
    this.lblInvoiceDate = row.invoiceDate;
    this.lblRemarks = row.invoiceRemarks;
    this.lblVoucherType = row.type;
    this.lblPartyType = row.partyType;
    this.lblPartyName = row.partyName;
    this.lblInvAmount = row.amount;
    this.lblProjectName = row.projectTitle;
    this.getInvoiceDetail(row.invoiceNo);




    setTimeout(() => {
      if (this.lblInvoiceDetails != '') {
        this.globaldata.printData('#InvociePrint');
      } else {
        this.msg.WarnNotify('Error Occured While Printing');
      }
    }, 500);

  }



  lblInvoiceDetails: any = [];

  /////////////////////////////////////////////

  getInvoiceDetail(invoiceNo: any) {

    this.lblDebitTotal = 0;
    this.lblCreditTotal = 0;
    this.lblPartyBalance = 0;
    this.lblInvoiceDetails = [];


    this.http.get(environment.mainApi + this.globaldata.accountLink + 'GetSpecificVocherDetail?InvoiceNo=' + invoiceNo).subscribe(
      (Response: any) => {
        this.lblInvoiceDetails = Response;
        if (Response != '') {

          Response.forEach((e: any) => {
            this.lblDebitTotal += e.debit;
            this.lblCreditTotal += e.credit;
          });
          this.lblPartyBalance = this.lblPartyType === 'Supplier' ? Response[0].supBalance : Response[0].cusBalance;
        }
      },
      (error: any) => {

        this.msg.WarnNotify('Error Occured While Printing');
      }
    )
  }


  approveBill(row: any) {

    this.globaldata.openPinCode().subscribe(pin => {
      if (pin != '') {


        //////on confirm button pressed the api will run
        this.http.post(environment.mainApi + this.globaldata.accountLink + 'ApproveVoucher', {
          InvoiceNo: row.invoiceNo,
          PinCode: pin,
          UserID: this.globaldata.getUserID(),
        }).subscribe(
          (Response: any) => {

            if (Response.msg == 'Voucher Approved Successfully') {
              this.msg.SuccessNotify(Response.msg);
              this.getPayments();
            } else {
              this.msg.WarnNotify(Response.msg);
            }

          }
        )

      }
    })



  }


}
