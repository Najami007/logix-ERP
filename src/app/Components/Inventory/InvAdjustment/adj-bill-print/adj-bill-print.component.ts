import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-adj-bill-print',
  templateUrl: './adj-bill-print.component.html',
  styleUrls: ['./adj-bill-print.component.scss']
})
export class AdjBillPrintComponent {

  

  discFeature = this.global.discFeature;
    BookerFeature = this.global.BookerFeature;
    showCompanyName = this.global.showCmpNameFeature;
    showCompanyLogo = this.global.showCompanyLogo;
    gstFeature = this.global.gstFeature;
    prodDetailFeature = this.global.prodDetailFeature;
  
  
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


    myInvoiceTitle= '';
    myInvoiceNo:any;
    myInvoiceDate:any;
    myLocation:any;
    myLocationTitle:any;
    myLocationTwoTitle:any;
    myInvRemarks:any;
    myIssueType:any;
    mySubTotal:any;
    myTableDataList:any = [];
    myBillTotalQty = 0;
    myCPTotal = 0;
    myAvgCPTotal = 0;
    mySPTotal = 0;
    myBillStatus = false;


    printBill(item:any){
      this.myTableDataList = [];
      this.myInvoiceNo = item.invBillNo;
      this.myInvoiceDate = new Date(item.invDate);
      this.myLocation = item.locationID;
      this.myLocationTitle = item.locationTitle;
      this.myLocationTwoTitle = item.locationTwoTitle;
      this.myIssueType = item.issueType;
      this.myInvRemarks = item.remarks;
      this.mySubTotal = item.billTotal;
      this.myBillStatus = item.approvedStatus;
  
  
      this.getBillDetail(item.invBillNo).subscribe(
        (Response:any)=>{
          this.setInvoiceTitle(Response[0].invType);

          this.myAvgCPTotal = 0;
          this.myBillTotalQty = 0;
          this.myCPTotal = 0;
          this.mySPTotal = 0;  
  
            Response.forEach((e:any) => {
              this.myBillTotalQty += e.quantity;
              this.myCPTotal += e.costPrice * e.quantity;
              this.myAvgCPTotal += e.avgCostPrice * e.quantity;
              this.mySPTotal += e.salePrice * e.quantity;
  
              this.myTableDataList.push({
                ProductID:e.productID,
                ProductTitle:e.productTitle,
                barcode:e.barcode,
                productImage:e.productImage,
                Quantity:e.quantity,
                avgCostPrice:e.avgCostPrice,
                CostPrice:e.costPrice,
                SalePrice:e.salePrice,
                ExpiryDate:this.global.dateFormater(new Date(e.expiryDate),'-'),
                BatchNo:e.batchNo,
                BatchStatus:e.batchStatus,
                UomID:e.uomID,
                Packing:e.packing,
                discInP:e.discInP,
                discInR:e.discInR,
              })
            });
  
            setTimeout(() => {
              this.global.printData('#printDiv')
            }, 200);
          
        }
      )
  
  
  
    }


    setInvoiceTitle(type:any){

      if(type == 'AI' || type == 'AO' || type == 'DL' || type == 'E'){
        this.myInvoiceTitle = 'Stock Adjustment Note';
      }else if(type == 'OS'){
        this.myInvoiceTitle = 'Opening Stock Note';
      }
      else if(type == 'R'){
        this.myInvoiceTitle = 'Stock Return Note';
      }else if(type == 'I'){
        this.myInvoiceTitle = 'Stock Issue Note';
      }
      
    }


     public getBillDetail(billNo:any):Observable<any>{
        return this.http.get(environment.mainApi+this.global.inventoryLink+'GetIssueSingleBillDetail?reqInvBillNo='+billNo).pipe(retry(3));
       }

}
