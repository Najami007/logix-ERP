import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, retry } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-barcode-report-invoicewise',
  templateUrl: './barcode-report-invoicewise.component.html',
  styleUrls: ['./barcode-report-invoicewise.component.scss']
})
export class BarcodeReportInvoicewiseComponent implements OnInit {

  companyProfile: any = [];

  companyName = '';
  crudList: any = { c: true, r: true, u: true, d: true };

  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    private global: GlobalDataModule,
    private route: Router,
    private dialog: MatDialog

  ) {

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
      if (data != '') {
        this.companyName = data[0].companyName;
      }
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })


  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Barcode Report Invoice')
  }



  showPrice: any = true;
  showTitle: any = true;


  SearchDate: any = new Date();
  searchBillType: any = 'Date';
  invoiceList: any = []


  findHoldBills(type: any) {
    if (type == 'hp') {
      $('#edit').show();
    }

    if (type == 'p') {
      $('#edit').hide()
    }

    var date = this.searchBillType == 'Date' ? this.global.dateFormater(this.SearchDate, '-') : '';

    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetInventoryBillSingleDate?Type=' + type + '&creationdate=' + date).subscribe(
      (Response: any) => {

        this.invoiceList = [];
        if (type == 'hp') {
          Response.forEach((e: any) => {
            if (e.approvedStatus == false) {
              this.invoiceList.push(e);
            }
          });
        }
        if (type == 'p') {
          this.invoiceList = Response;
        }
      }
    )
  }


  tableDataList: any = [];
  myTotalQty: any = 0;
  selectBill(item: any) {

    this.getBillDetail(item.invBillNo).subscribe(
      (Response: any) => {
        this.myTotalQty = 0;
        this.tableDataList = [];
        Response.forEach((e: any) => {

          this.myTotalQty += e.quantity;
          this.tableDataList.push({
            isChecked: false,
            rowIndex: this.tableDataList.length + 1,
            productID: e.productID,
            productTitle: e.productTitle,
            barcode: e.barcode,
            productImage: e.productImage,
            quantity: e.quantity,
            wohCP: e.costPrice,
            tempCostPrice: e.tempCostPrice,
            margin: ((e.salePrice - e.costPrice) / e.costPrice) * 100,
            costPrice: e.costPrice,
            salePrice: e.salePrice,
            expiryDate: this.global.dateFormater(new Date(e.expiryDate), '-'),
            BatchNo: e.batchNo,
            BatchStatus: e.batchStatus,
            UomID: e.uomID,
            Packing: e.packing,
            discInP: e.discInP,
            discInR: e.discInR,
            AQ: e.aq,
            gst: e.gst,
            et: e.et,
          })
        });
      }
    )

  }





  public getBillDetail(billNo: any): Observable<any> {
    return this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSingleBillDetail?reqInvBillNo=' + billNo).pipe(retry(3));
  }



  printDataList: any = [];

  tmpProductTitle: any = '';
  tmpBarcode: any = '';
  tmpSalePrice: any = 0;
  curProductRow: any = [];


  onCheckedAll(e: any) {

    if (this.tableDataList.length == 0) return;

    if (e.checked) {
      this.tableDataList.forEach((e: any) => {
        e.isChecked = true;
      });
    }

    if (!e.checked) {
      this.tableDataList.forEach((e: any) => {
        e.isChecked = false;
      });
    }
  }


  async startPrinting() {
    if (this.tableDataList.length == 0) return;

    this.printDataList = [];
    let dataRows = this.tableDataList.filter((e: any) => e.isChecked);


    const printSequentially = async () => {
      for (const e of dataRows) {
        for (let i = 0; i < e.quantity; i++) {
          this.curProductRow = e;
          // this.curProductRow.push({ ...e });
          this.printDataList.push({ ...e });

          // Wait for print to finish before going next
          await new Promise((res) => setTimeout(res));
          await this.printBarcode();
        }
      }

    }
    await printSequentially();
  }


  printBarcode(): Promise<void> {
    return new Promise((resolve) => {
      var printWindow: any = this.global.printBarcode('#PrintDiv');
      // make sure printBarcode returns the window it opened

      if (printWindow) {
        printWindow.onafterprint = () => {
          printWindow.close();
          resolve();
        };
      } else {
        // fallback: wait a bit then continue
        setTimeout(() => resolve(), 1000);
      }
    });
  }


  getBarcodeWidth(value: string): number {
    // Base width (e.g., 2px per character, adjust as needed)
    const baseWidth = 1.5
    if(value.length == 0) return 1;

    // Ensure a minimum width for short values
    // return Math.max(2, baseWidth); 

    // Or scale dynamically:
    return Math.max(1, value.length < 10 ? 1.5 : 2 / value.length);
  }



}
