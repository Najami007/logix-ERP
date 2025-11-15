import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, retry } from 'rxjs';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

import * as $ from 'jquery';

@Component({
  selector: 'app-purchase-bill-print',
  templateUrl: './purchase-bill-print.component.html',
  styleUrls: ['./purchase-bill-print.component.scss']
})
export class PurchaseBillPrintComponent {



  DetailedPurchaseFeature = this.global.DetailedPurchase;


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

  myDiscType = '';
  myGstTotal = 0;
  myEtTotal = 0;
  myDiscTotal = 0;
  myTmpCostTotal = 0;

  printBill(item: any) {

    $('.loaderDark').show();

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
        console.log(Response);
        this.myDiscType = Response[0].discType;
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


        this.myGstTotal = 0;
        this.myEtTotal = 0;
        this.myDiscTotal = 0;
        this.myTmpCostTotal = 0;
        Response.forEach((e: any) => {
          this.myBillTotalQty += e.quantity;
          this.mywohCPTotal += (e.costPrice - overhead) * e.quantity;
          this.myCPTotal += e.costPrice * e.quantity;
          this.mySPTotal += e.salePrice * e.quantity;

          if (this.myDiscType == 'ad') {
            this.myTmpCostTotal += e.tempCostPrice * e.quantity;
            this.myGstTotal += ((e.tempCostPrice * e.gst) / 100) * e.quantity;
            this.myDiscTotal += ((((e.tempCostPrice * e.discInP) / 100) + (e.discInR / e.quantity))) * e.quantity;
            this.myEtTotal += (((Number(e.tempCostPrice) +
              Number(((e.tempCostPrice * e.gst) / 100)) - this.myDiscTotal) * e.et) / 100)
          }

          if (this.myDiscType == 'bd') {
            this.myTmpCostTotal += e.tempCostPrice * e.quantity;
            this.myGstTotal += ((e.tempCostPrice * e.gst) / 100) * e.quantity;
            this.myDiscTotal += (((item.tempCostPrice * item.discInP) / 100) + (item.discInR / item.Quantity)) * e.quantity;
            this.myEtTotal += (((Number(item.tempCostPrice) +
              Number(((e.tempCostPrice * e.gst) / 100)) - this.myDiscTotal) * item.et) / 100)
          }

          console.log(this.myGstTotal, this.myDiscTotal, this.myEtTotal);

          this.myTableDataList.push({
            ProductID: e.productID,
            ProductTitle: e.productTitle,
            barcode: e.barcode,
            productImage: e.productImage,
            Quantity: e.quantity,
            wohCP: (e.costPrice - overhead),
            tempCostPrice: e.tempCostPrice,
            CostPrice: e.costPrice,
            SalePrice: e.salePrice,
            ExpiryDate: this.global.dateFormater(new Date(e.expiryDate), '-'),
            BatchNo: e.batchNo,
            BatchStatus: e.batchStatus,
            UomID: e.uomID,
            Packing: e.packing,
            discInP: e.discInP,
            discInR: e.discInR,
            gst: e.gst,
            et: e.et,
            aq: e.aq,

          })
        });


        setTimeout(() => {
          $('.loaderDark').fadeOut(100);
          this.global.printData('#printDiv')
        }, 200);

      },
      (Error: any) => {
        console.log(Error);
        $('.loaderDark').fadeOut(100);
      }
    )
  }


  setInvoiceTitle(type: any) {

    if (type == 'HP' || type == 'P') {
      this.myInvoiceTitle = 'Goods Receive Note';
    } else if (type == 'HPR' || type == 'PR') {
      this.myInvoiceTitle = 'Goods Return Note';
    }
    if (type == 'PO') {
      this.myInvoiceTitle = 'Purchase Order';
    }

  }


  public getBillDetail(billNo: any): Observable<any> {
    return this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSingleBillDetail?reqInvBillNo=' + billNo).pipe(retry(3));
  }


}
