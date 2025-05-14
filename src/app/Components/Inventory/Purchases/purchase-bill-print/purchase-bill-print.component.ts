import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, retry } from 'rxjs';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-purchase-bill-print',
  templateUrl: './purchase-bill-print.component.html',
  styleUrls: ['./purchase-bill-print.component.scss']
})
export class PurchaseBillPrintComponent {


discFeature = this.global.getFeature('Discount');
  BookerFeature = this.global.getFeature('Booker');
  showCompanyName = this.global.getFeature('CmpName');
  showCompanyLogo = this.global.getFeature('CmpLogo');
  gstFeature = this.global.getFeature('GST');
  prodDetailFeature = this.global.getFeature('ProdDetail');


  billPrintType:any = '';;
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
  myRefInvNo: any;
  mydiscount: any;
  myOverHeadAmount: any;
  myInvRemarks: any;
  myBookerName: any;
  myPartyName: any;
  mySubTotal: any;
  myTableDataList: any = [];
  myBillTotalQty = 0;
  mywohCPTotal = 0;
  myCPTotal = 0;
  mySPTotal = 0;
  myBillStatus = false;
  myInvType = '';

  printBill(item: any) {
    
    this.myTableDataList = [];
    this.myInvoiceNo = item.invBillNo;
    this.myInvoiceDate = new Date(item.invDate);
    this.myLocation = item.locationTitle;
    this.myRefInvNo = item.refInvoiceNo;
    this.mydiscount = item.billDiscount;
    this.myOverHeadAmount = item.overHeadAmount;
    this.myInvRemarks = item.remarks;
    this.myBookerName = item.bookerName;
    this.myPartyName = item.partyName;
    this.mySubTotal = item.billTotal;
    this.myBillStatus = item.approvedStatus;

    this.getBillDetail(item.invBillNo).subscribe(
      (Response: any) => {
        this.setInvoiceTitle(Response[0].invType);
        this.myInvType = Response[0].invType;
        var totalQty = 0;
        var overhead = 0
        this.myBillTotalQty = 0;
        this.mywohCPTotal = 0;
        this.myCPTotal = 0;
        this.mySPTotal = 0;

        if (item.overHeadAmount > 0) {
          Response.forEach((j: any) => {
            totalQty += j.quantity;
          });

          overhead = item.overHeadAmount / totalQty;

        }

       

        Response.forEach((e: any) => {
          this.myBillTotalQty += e.quantity;
          this.mywohCPTotal += (e.costPrice - overhead) * e.quantity;
          this.myCPTotal += e.costPrice * e.quantity;
          this.mySPTotal += e.salePrice * e.quantity;

          this.myTableDataList.push({
            ProductID: e.productID,
            ProductTitle: e.productTitle,
            barcode: e.barcode,
            productImage: e.productImage,
            Quantity: e.quantity,
            wohCP: (e.costPrice - overhead),
            CostPrice: e.costPrice,
            SalePrice: e.salePrice,
            ExpiryDate: this.global.dateFormater(new Date(e.expiryDate), '-'),
            BatchNo: e.batchNo,
            BatchStatus: e.batchStatus,
            UomID: e.uomID,
            Packing: e.packing,
            discInP: e.discInP,
            discInR: e.discInR,

          })
        });


        setTimeout(() => {
          this.global.printData('#printDiv')
        }, 200);

      }
    )
  }


  setInvoiceTitle(type:any){

    if(type == 'HP'){
      this.myInvoiceTitle = 'Goods Receive Note';
    }else if(type == 'HPR'){
      this.myInvoiceTitle = 'Goods Return Note';
    }
    if(type == 'HP'){
      this.myInvoiceTitle = 'Goods Receive Note';
    }else if(type == 'PO'){
      this.myInvoiceTitle = 'Purchase Order';
    }
    
  }


    public getBillDetail(billNo: any): Observable<any> {
      return this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSingleBillDetail?reqInvBillNo=' + billNo).pipe(retry(3));
    }
  

}
