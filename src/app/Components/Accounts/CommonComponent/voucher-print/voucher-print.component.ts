import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-voucher-print',
  templateUrl: './voucher-print.component.html',
  styleUrls: ['./voucher-print.component.scss']
})
export class VoucherPrintComponent {


  crudList: any = { c: true, r: true, u: true, d: true };
  companyProfile: any;

  constructor(private msg: NotificationService,
    private globalData: GlobalDataModule,
    private http: HttpClient,
    private route: Router
  ) {


    //this.http.get(environment.mainApi+'cmp/getcompanyprofile').subscribe((Response:any)=>{this.companyProfile = Response;})

    this.globalData.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    this.globalData.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })


  }

  ngOnInit(): void { }

  lblInvoiceNo: any;
  lblInvoiceDate: any;
  lblRemarks: any;
  lblVoucherType: any;
  lblProjectName: any;
  lblVoucherTable: any;
  lblDebitTotal: any;
  lblCreditTotal: any;
  lblVoucherPrintDate = new Date();


  invoiceDetails: any = [];







  printBill(row: any) {


    this.lblInvoiceNo = row.invoiceNo;
    this.lblInvoiceDate = row.invoiceDate;
    this.lblRemarks = row.invoiceRemarks;
    this.lblVoucherType = row.type;
    this.lblProjectName = row.projectTitle;
    this.getInvoiceDetail(row.invoiceNo);


  }





  getInvoiceDetail(invoiceNo: any) {

    this.lblDebitTotal = 0;
    this.lblCreditTotal = 0;
    this.invoiceDetails = [];


    this.http.get(environment.mainApi + this.globalData.accountLink + 'GetSpecificVocherDetail?InvoiceNo=' + invoiceNo).subscribe(
      (Response: any) => {
        this.invoiceDetails = Response;
   
        this.lblRemarks = Response[0].invoiceRemarks;
        // this.lblInvoiceNo = Response[0].invoiceNo;
        // this.lblInvoiceDate = Response[0].invoiceDate;
        // this.lblVoucherType = Response[0].type;
        // this.lblProjectName = Response[0].projectTitle; 
        // this.invoiceDetails = Response;
        if (Response != '') {

          Response.forEach((e: any) => {
            this.lblDebitTotal += e.debit;
            this.lblCreditTotal += e.credit;
          });
        }

        setTimeout(() => {

          this.globalData.printData('#InvociePrint');

        }, 200);
      },
      (error: any) => {
        console.log(error);
        this.msg.WarnNotify('Error Occured While Printing');
      }
    )
  }


}
