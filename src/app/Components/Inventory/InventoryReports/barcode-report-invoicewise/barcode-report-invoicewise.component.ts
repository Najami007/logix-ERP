import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, retry } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-barcode-report-invoicewise',
  templateUrl: './barcode-report-invoicewise.component.html',
  styleUrls: ['./barcode-report-invoicewise.component.scss']
})
export class BarcodeReportInvoicewiseComponent implements OnInit {

  companyProfile: any = [];
  companyLogo:any = '';
  logoHeight:any = 0;
  logoWidth:any = 0;
  printDate:any = new Date();

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
        this.companyLogo = data[0].companyLogo1;
        this.logoHeight = data[0].logo1Height;
        this.logoWidth = data[0].logo1Width;
      }
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })


  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Barcode Report Invoice');


    this.global.getProducts().subscribe(
      (Response: any) => {
        this.productList = Response;
      }
    )
  }


  productList: any = [];
  showPrice: any = true;
  showTitle: any = true;
  showBarcode:any = true;
  showCompany:any = true;

  PBarcode: any = '';


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
          this.pushProdData(e, false,'bill');
        });
      }
    )

  }

  pushProdData(item: any, isChecked: any,type:any) {

    this.tableDataList.push({
      isChecked: isChecked,
      rowIndex: this.tableDataList.length + 1,
      productID: item.productID,
      productTitle: item.productTitle,
      barcode: item.barcode,
      productImage: item.productImage,
      quantity: item.quantity,
      wohCP: item.costPrice,
      tempCostPrice: item.tempCostPrice,
      margin: ((item.salePrice - item.costPrice) / item.costPrice) * 100,
      costPrice: item.costPrice,
      salePrice: item.salePrice,
      // expiryDate: this.global.dateFormater(new Date(item.expiryDate), '-'),
      BatchNo: item.batchNo,
      BatchStatus: item.batchStatus,
      UomID: item.uomID,
      Packing: item.packing,
      discInP: item.discInP,
      discInR: item.discInR,
      AQ: item.aq,
      gst: item.gst,
      et: item.et,
      type:type

    })
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
    if (value.length == 0) return 1;

    // Ensure a minimum width for short values
    // return Math.max(2, baseWidth); 

    // Or scale dynamically:
    return Math.max(1, value.length < 10 ? 1.5 : 2 / value.length);
  }




  rowFocused = -1;
  prodFocusedRow = 0;
  changeFocus(e: any, cls: any) {

    if (e.target.value == '') {

    } else {
      this.prodFocusedRow = 0;
      /////move down
      if (e.keyCode == 40) {
        if (this.productList.length >= 1) {
          $('.prodRow0').trigger('focus');
        }
      }
    }
  }



  searchByCode(e: any) {

    if (this.PBarcode !== '') {
      if (e.keyCode == 13) {
        ///// check the product in product list by barcode
        this.global.getProdDetail(0, this.PBarcode).subscribe(
          (Response: any) => {
            if (Response.length > 0) {
              this.pushProdData(Response[0], true, 'extra')
            } else {
              this.msg.WarnNotify('Product Not Found!')
            }

          }
        )

        // var row =  this.productList.find((p:any)=> p.barcode == this.PBarcode);

        // /////// check already present in the table or not
        // if(row !== undefined){
        //   this.curProduct = [];
        //   this.curProduct.push(row);
        // }else{
        //   this.msg.WarnNotify('Product Not Found')
        // }


        this.PBarcode = '';
        $('#searchProduct').trigger('focus');

      }
    }


  }



  onProductSelected(item: any) {
    // this.curProduct.push(item);
    this.global.getProdDetail(item.productID, '').subscribe(
      (Response: any) => {
        if (Response.length > 0) {
          this.pushProdData(Response[0], true,'extra')
        } else {
          this.msg.WarnNotify('Product Not Found!')
        }

      }
    )

    this.PBarcode = '';
    $('#searchProduct').trigger('focus');


  }


  handleProdFocus(item: any, e: any, cls: any, endFocus: any, prodList: []) {


    /////// increment in prodfocus on tab click
    if (e.keyCode == 9 && !e.shiftKey) {
      this.prodFocusedRow += 1;

    }
    /////// decrement in prodfocus on shift tab click
    if (e.shiftKey && e.keyCode == 9) {
      this.prodFocusedRow -= 1;

    }
    /////move down
    if (e.keyCode == 40) {


      if (prodList.length > 1) {
        this.prodFocusedRow += 1;
        if (this.prodFocusedRow >= prodList.length) {
          this.prodFocusedRow -= 1
        } else {
          var clsName = cls + this.prodFocusedRow;
          //  alert(clsName);
          $(clsName).trigger('focus');
          e.which = 9;
          $(clsName).trigger(e)
        }
      }
    }


    //Move up
    if (e.keyCode == 38) {

      if (this.prodFocusedRow == 0) {
        $(endFocus).trigger('focus');
        this.prodFocusedRow = 0;

      }

      if (prodList.length > 1) {

        this.prodFocusedRow -= 1;

        var clsName = cls + this.prodFocusedRow;
        //  alert(clsName);
        $(clsName).trigger('focus');


      }

    }

  }


  editQty(item: any) {

    if(item.type == 'bill')return;

        Swal.fire({
          title: "Enter Total Amount",
          input: "text",
          showCancelButton: true,
          confirmButtonText: 'Save',
          showLoaderOnConfirm: true,
          preConfirm: (value) => {
  
            if (!value || isNaN(value) || value <= 0) {
              return Swal.showValidationMessage("Enter Valid Qty");
            }
            const index = this.tableDataList.indexOf(item);
         
  
            this.tableDataList[index].quantity = value;
          }
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Quantity Updated",
              timer: 500,
            });
          }
        })
      }



  tagList:any = [];

  printTags(){

    this.tagList = this.tableDataList.filter((e:any)=> e.isChecked == true);

    console.log(this.tagList);

    setTimeout(() => {
          this.global.printData('#PrintTags');

    }, 200);


  }
    


}
