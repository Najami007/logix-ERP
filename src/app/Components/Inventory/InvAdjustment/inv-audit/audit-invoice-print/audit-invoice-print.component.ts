import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-audit-invoice-print',
  templateUrl: './audit-invoice-print.component.html',
  styleUrls: ['./audit-invoice-print.component.scss']
})
export class AuditInvoicePrintComponent {


  


  discFeature = this.global.discFeature;
  BookerFeature = this.global.BookerFeature;
  showCompanyName = this.global.showCmpNameFeature;
  showCompanyLogo = this.global.showCompanyLogo;
  gstFeature = this.global.gstFeature;
  prodDetailFeature = this.global.prodDetailFeature;
  hidePriceFlag = false;

  billPrintType: any = '';;
  companyProfile: any = [];
  companyLogo: any = '';
  logoHeight: any = 0;
  logoWidth: any = 0;
  companyAddress: any = '';
  CompanyMobile: any = '';
  companyName: any = '';
  crudList: any = { c: true, r: true, u: true, d: true };
  constructor(
    private http: HttpClient,
    public global: GlobalDataModule,
  ) {


    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
      this.companyLogo = data[0].companyLogo1;
      this.CompanyMobile = data[0].companyMobile;
      this.companyAddress = data[0].companyAddress;
      this.companyName = data[0].companyName;
      this.logoHeight = data[0].logo1Height;
      this.logoWidth = data[0].logo1Width;
    });




  }


  myInvoiceTitle = '';
  myInvoiceNo: any;
  myInvoiceDate: any;
  myLocation: any;
  myLocationTitle: any;
  myLocationTwoTitle: any;
  myInvRemarks: any;
  myIssueType: any;
  mySubTotal: any;
  myTableDataList: any = [];
  myBillTotalQty = 0;
  myCPTotal = 0;
  myAvgCPTotal = 0;
  mySPTotal = 0;
  myBillStatus = false;


  myPostedStatus = false;


  printBill(item: any) {
    this.myTableDataList = [];
    this.myInvoiceNo = item.auditInventoryID;
    this.myInvoiceDate = new Date(item.auditInvDate);;
    this.myLocation = item.locationID;
    this.myLocationTitle = item.locationTitle;
    this.myInvRemarks = item.remarks;
    this.mySubTotal = item.billTotal;
    this.myPostedStatus = item.auditActiveStatus;

    this.getBillDetail(item.auditInventoryID).subscribe(
      (Response: any) => {

        this.myAvgCPTotal = 0;
        this.myBillTotalQty = 0;
        this.myCPTotal = 0;
        this.mySPTotal = 0;

        Response.forEach((e: any) => {
          this.myBillTotalQty += e.quantity;
          this.myCPTotal += e.costPrice * (e.quantity - e.avlQuantity) ;
          this.myAvgCPTotal += e.avgCostPrice * (e.quantity - e.avlQuantity) ;
          this.mySPTotal += e.salePrice * (e.quantity - e.avlQuantity) ;

          this.myTableDataList.push({
            productID: e.productID,
            productTitle: e.productTitle,
            barcode: e.barcode,
            // productImage: e.productImage,
            quantity: e.quantity,
            avgCostPrice: e.avgCostPrice,
            costPrice: e.costPrice,
            salePrice: e.salePrice,
            avlQuantity: e.avlQuantity,
            scanTime: e.scanTime,
            subCategoryID: e.subCategoryID,
            brandID: e.brandID,
          })
        });

        setTimeout(() => {
          this.global.printData('#printDiv')
        }, 200);

      }
    )



  }





  public getBillDetail(billNo: any): Observable<any> {
    return this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSingleAuditInvDetail?reqInvID=' + billNo).pipe(retry(3));
  }


  



}
