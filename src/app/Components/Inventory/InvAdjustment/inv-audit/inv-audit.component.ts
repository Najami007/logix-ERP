import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../../../User/pincode/pincode.component';
import { Router } from '@angular/router';
import { Observable, retry } from 'rxjs';
import Swal from 'sweetalert2';
import { AdjBillPrintComponent } from '../adj-bill-print/adj-bill-print.component';

@Component({
  selector: 'app-inv-audit',
  templateUrl: './inv-audit.component.html',
  styleUrls: ['./inv-audit.component.scss']
})
export class InvAuditComponent implements OnInit {

  @ViewChild(AdjBillPrintComponent) billPrint: any;

  @HostListener('document:visibilitychange', ['$event'])

  appVisibility() {
    if (document.hidden) { } else { this.importFromLocalStorage(); }
  }
  os:any = require('os');

  crudList: any = { c: true, r: true, u: true, d: true };
  companyProfile: any = [];
  disableDateFeature = this.global.DisableInvDate;
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    public global: GlobalDataModule,
    private dialog: MatDialog,
    private route: Router
  ) {

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
    });

    

const hostname = this.os.hostname();

console.log("PC Name:", hostname);


  }



  ngOnInit(): void {
    this.global.setHeaderTitle('Stock Audit');
    this.getLocation();
    $('.searchProduct').trigger('focus');
    this.getIssueTypes();
    this.global.getProducts().subscribe(
      (data: any) => { this.productList = data; })

    this.importFromLocalStorage();

  }


  roleTypeID = this.global.getRoleTypeID();

  autoInsert = false;
  autoMerge = false;
  sortType = 'desc';


  projectID = this.global.getProjectID();
  Date: Date = new Date();
  holdInvNo = '-';
  holdBtnType = 'Hold';
  invoiceDate: Date = new Date();
  locationID = 0;
  locationTitle = '';
  locationList: any = [];

  invRemarks: any;
  PBarcode: any;
  productList: any = [];
  tableDataList: any = [];

  productImage: any;
  subTotal: number = 0;
  totalQty: number = 0;
  savedInvoiceList: any = [];
  issueTypeList: any = [];
  avgCostTotal = 0;
  CostTotal = 0;
  tempQty: any = '';
  tempProdRow: any = [];
  tmpQuantity: any = '';


  changeOrder() {
    this.sortType = this.sortType == 'desc' ? 'asc' : 'desc';
    this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);

  }


  getIssueTypes() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetIssueType').subscribe(
      (Response: any) => {
        this.issueTypeList = Response;
      },
      (Error: any) => {
        this.msg.WarnNotify(Error);

      }
    )
  }

  onLocationSelected(type: any) {

    if (type == 'l1') {
      var row = this.locationList.find((e: any) => e.locationID == this.locationID);
      this.locationTitle = row.locationTitle;

    }

  }


  getLocation() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'getlocation').subscribe(
      (Response: any) => {
        this.locationList = Response;
      },
      (Error: any) => {
        this.msg.WarnNotify(Error);

      }
    )
  }


  searchByCode(e: any) {



    if (this.PBarcode !== '') {
      if (e.keyCode == 13) {
        if (this.locationID == 0 || this.locationID == undefined || this.locationID == null) {
          this.msg.WarnNotify('Select Location');
          return;
        }
        ///// check the product in product list by barcode
        var row = this.productList.find((p: any) => p.barcode == this.PBarcode);


        this.global.getProdDetail(0, this.PBarcode, this.locationID).subscribe(
          (Response: any) => {

            if (Response.length > 0) {
              this.tempProdRow = Response;
              if (this.autoInsert) {
                this.InsertToTable(1);
              } else {
                $('#qtyInput').trigger('select');
                $('#qtyInput').trigger('focus');
              }
            } else {
              this.msg.WarnNotify('Product Not Found');
              this.PBarcode = '';
              $('#searchProduct').trigger('focus');
            }


          }
        )


      }
    }


  }

  onQtyinsert(event: any) {

    if (this.tempProdRow != '' && event.target.value > 0) {

      if (event.keyCode == 13) {

        this.InsertToTable(event.target.value);
      }
    }

  }

  InsertToTable(Qty: any) {

    if (this.tempProdRow != '') {
      var condition: any = this.tableDataList.filter((e: any) => e.productID == this.tempProdRow[0].productID);
      var index = this.tableDataList.indexOf(condition[0]);

      if (condition.length == 0 || (condition.length > 0 && !this.autoMerge)) {
        this.tableDataList.push({
          rowIndex: this.tableDataList.length == 0 ? this.tableDataList.length + 1
            : this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1
              : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
          productID: this.tempProdRow[0].productID,
          productTitle: this.tempProdRow[0].productTitle,
          barcode: this.tempProdRow[0].barcode,
          // productImage: this.tempProdRow[0].productImage,
          quantity: Qty,
          avgCostPrice: this.tempProdRow[0].avgCostPrice,
          costPrice: this.tempProdRow[0].costPrice,
          salePrice: this.tempProdRow[0].salePrice,
          avlQuantity: this.tempProdRow[0].aq,
        });
        this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
        // this.productImage = this.tempProdRow[0].productImage;
      }

      if (condition.length > 0 && this.autoMerge) {
        this.tableDataList[index].quantity = parseFloat(this.tableDataList[index].quantity) + parseFloat(Qty);
        this.tableDataList[index].rowIndex = this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1 : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1;
        this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
        // this.productImage = this.tableDataList[index].productImage;
      }


      this.PBarcode = '';
      $('#searchProduct').trigger('focus');
      this.getTotal();
      Qty = '';
      this.tempProdRow = '';
      this.tmpQuantity = '';
      this.insertToLocalStorage();

    }
  }

  insertToLocalStorage() {

    var prodData = JSON.stringify(this.tableDataList);
    var locationID = JSON.stringify(this.locationID);
    var AuditInventoryID = JSON.stringify(this.AuditInventoryID);
    var autMerge = JSON.stringify(this.autoMerge);
    var AuditID = JSON.stringify(this.auditID);

    localStorage.removeItem('tmpAuditData');
    localStorage.removeItem('tmpAuditLocation');
    localStorage.removeItem('tmpAuditInventoryID');
    localStorage.removeItem('tmpAuditID');
    localStorage.removeItem('tmpAutoMerge');

    localStorage.setItem('tmpAuditData', prodData);
    localStorage.setItem('tmpAuditLocation', locationID);
    localStorage.setItem('tmpAuditInventoryID', AuditInventoryID);
    localStorage.setItem('tmpAuditID', AuditID);
    localStorage.setItem('tmpAutoMerge', autMerge);



  }

  importFromLocalStorage() {
    var data = JSON.parse(localStorage.getItem('tmpAuditData') || '0');

    if (data == '0' || data == '') {
      this.msg.WarnNotify('No Data Stored in local Storage')
      return;
    }
    this.autoMerge = JSON.parse(localStorage.getItem('tmpAutoMerge') || '0');
    this.auditID = JSON.parse(localStorage.getItem('tmpAuditID') || '0');
    this.AuditInventoryID = JSON.parse(localStorage.getItem('tmpAuditInventoryID') || '0');
    this.locationID = JSON.parse(localStorage.getItem('tmpAuditLocation') || '0');
    this.tableDataList = data;
    this.getTotal();
  }



  holdDataFunction(data: any) {

    if (this.locationID == 0 || this.locationID == undefined || this.locationID == null) {
      this.msg.WarnNotify('Select Location');
      return;
    }

    var condition = this.tableDataList.find(
      (x: any) => x.productID == data.productID
    );

    this.global.getProdDetail(data.productID, '', this.locationID).subscribe(
      (Response: any) => {

        this.tempProdRow = Response;

        if (this.autoInsert) {
          this.InsertToTable(1);
        } else {
          $('#qtyInput').trigger('select');
          $('#qtyInput').trigger('focus');
        }
      }
    )

  }


  showImg(item: any) {

    // var index = this.tableDataList.findIndex((e: any) => e.productID == item.productID);
    // this.productImage = this.tableDataList[index].productImage;

  }

  getTotal() {
    this.subTotal = 0;
    this.totalQty = 0;
    this.CostTotal = 0;
    this.avgCostTotal = 0;
    for (var i = 0; i < this.tableDataList.length; i++) {

      this.subTotal += (parseFloat(this.tableDataList[i].quantity) * parseFloat(this.tableDataList[i].avgCostPrice));
      this.totalQty += parseFloat(this.tableDataList[i].quantity);
      this.CostTotal += (parseFloat(this.tableDataList[i].quantity) * parseFloat(this.tableDataList[i].costPrice));
      this.avgCostTotal += (parseFloat(this.tableDataList[i].quantity) * parseFloat(this.tableDataList[i].avgCostPrice))

    }
  }

  rowFocused = -1;
  prodFocusedRow = 0;
  changeFocus(e: any, cls: any) {

    if (e.target.value == '') {
      if (e.keyCode == 40) {

        if (this.tableDataList.length >= 1) {
          this.rowFocused = 0;
          e.preventDefault();
          $('.qty0').trigger('select');
          $('.qty0').trigger('focus');

        }
      }
    } else {
      this.prodFocusedRow = 0;
      /////move down
      if (e.keyCode == 40) {
        if (this.productList.length >= 1) {
          e.preventDefault();
          $('.prodRow0').trigger('focus');
        }
      }
    }
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
          e.preventDefault();
          $(clsName).trigger('focus');

        }
      }
    }


    //Move up
    if (e.keyCode == 38) {

      if (this.prodFocusedRow == 0) {
        e.preventDefault();
        $(endFocus).trigger('focus');
        this.prodFocusedRow = 0;

      }

      if (prodList.length > 1) {

        this.prodFocusedRow -= 1;

        var clsName = cls + this.prodFocusedRow;
        //  alert(clsName);
        e.preventDefault();
        $(clsName).trigger('focus');


      }

    }

  }

  handleUpdown(item: any, e: any, cls: string, index: any) {
    const container = $(".table-logix");
    if (e.keyCode == 9) {
      if (cls == '.sp') {
        this.rowFocused = index + 1;
      } else {
        this.rowFocused = index;
      }

    }


    if (e.shiftKey && e.keyCode == 9) {

      if (cls == '.qty') {
        this.rowFocused = index - 1;
      } else {
        this.rowFocused = index;
      }
    }

    /////////// focusing product serach
    if (e.keyCode == 13) {
      $('#searchProduct').trigger('focus');
    }

    if ((e.keyCode == 13 || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 16 || e.keyCode == 46 || e.keyCode == 37 || e.keyCode == 110 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 48 || e.keyCode == 49 || e.keyCode == 50 || e.keyCode == 51 || e.keyCode == 52 || e.keyCode == 53 || e.keyCode == 54 || e.keyCode == 55 || e.keyCode == 56 || e.keyCode == 57 || e.keyCode == 96 || e.keyCode == 97 || e.keyCode == 98 || e.keyCode == 99 || e.keyCode == 100 || e.keyCode == 101 || e.keyCode == 102 || e.keyCode == 103 || e.keyCode == 104 || e.keyCode == 105)) {
      // 13 Enter ///////// 8 Back/remve ////////9 tab ////////////16 shift ///////////46 del  /////////37 left //////////////110 dot
    }
    else {
      e.preventDefault();
    }

    /////move down
    if (e.keyCode === 40) {
      if (this.tableDataList.length > 1) {
        this.rowFocused = Math.min(this.rowFocused + 1, this.tableDataList.length - 1);
        const clsName = cls + this.rowFocused;
        this.global.scrollToRow(clsName, container);
        e.preventDefault();
        $(clsName).trigger('select');
        $(clsName).trigger('focus');

      }
    }


    //Move up
    if (e.keyCode === 38) {
      if (this.rowFocused > 0) {

        this.rowFocused -= 1;
        const clsName = cls + this.rowFocused;
        this.global.scrollToRow(clsName, container);
        e.preventDefault();
        $(clsName).trigger('select');
        $(clsName).trigger('focus');

      } else {
        e.preventDefault();
        $(".searchProduct").trigger('select');
        $(".searchProduct").trigger('focus');
      }
    }

    ////removeing row
    if (e.keyCode == 46) {

      this.delRow(item);
      this.rowFocused = 0;
    }

  }


  handleNumKeys(item: any, e: any, cls: string, index: any) {
    const container = $(".table-logix");

    if (e.keyCode == 9) {
      this.rowFocused = index + 1;
    }

    if (e.shiftKey && e.keyCode == 9) {

      this.rowFocused = index - 1;
    }

    if ((e.keyCode == 13 || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 16 || e.keyCode == 46 || e.keyCode == 37 || e.keyCode == 110 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 48 || e.keyCode == 49 || e.keyCode == 50 || e.keyCode == 51 || e.keyCode == 52 || e.keyCode == 53 || e.keyCode == 54 || e.keyCode == 55 || e.keyCode == 56 || e.keyCode == 57 || e.keyCode == 96 || e.keyCode == 97 || e.keyCode == 98 || e.keyCode == 99 || e.keyCode == 100 || e.keyCode == 101 || e.keyCode == 102 || e.keyCode == 103 || e.keyCode == 104 || e.keyCode == 105)) {
      // 13 Enter ///////// 8 Back/remve ////////9 tab ////////////16 shift ///////////46 del  /////////37 left //////////////110 dot
    }
    else {
      e.preventDefault();
    }

    /////move down
    if (e.keyCode === 40) {
      if (this.tableDataList.length > 1) {
        this.rowFocused = Math.min(this.rowFocused + 1, this.tableDataList.length - 1);
        const clsName = cls + this.rowFocused;
        this.global.scrollToRow(clsName, container);
        e.preventDefault();
        $(clsName).trigger('select');
        $(clsName).trigger('focus');

      }
    }
    //Move up
    if (e.keyCode === 38) {
      if (this.rowFocused > 0) {

        this.rowFocused -= 1;
        const clsName = cls + this.rowFocused;
        this.global.scrollToRow(clsName, container);
        e.preventDefault();
        $(clsName).trigger('select');
        $(clsName).trigger('focus');

      } else {
        e.preventDefault();
        $(".searchProduct").trigger('select');
        $(".searchProduct").trigger('focus');
      }
    }

    ////removeing row
    if (e.keyCode == 46) {

      this.delRow(item);
      this.rowFocused = 0;
    }

  }




  delRow(item: any) {
    this.global.confirmAlert().subscribe(
      (Response: any) => {
        if (Response == true) {

          var index = this.tableDataList.indexOf(item);
          this.tableDataList.splice(index, 1);
          this.getTotal();
          if (index == 0) {
            $('#searchProduct').trigger('select');
            $('#searchProduct').trigger('focus');
          } else {
            this.rowFocused = index - 1;
            $('.qty' + this.rowFocused).trigger('select');
            $('.qty' + this.rowFocused).trigger('focus');
          }

          this.insertToLocalStorage();
        }
      }
    )



  }

  EmptyData() {
    this.global.confirmAlert().subscribe(
      (Response: any) => {
        if (Response == true) {
          this.reset();
          this.insertToLocalStorage();
        }
      })
  }


  changeValue(item: any) {
    var myIndex = this.tableDataList.indexOf(item);

    var myQty = this.tableDataList[myIndex].quantity;
    var myCP = this.tableDataList[myIndex].costPrice;
    var mySP = this.tableDataList[myIndex].salePrice;
    if (myCP == null || myCP == '' || myCP == undefined) {

      this.tableDataList[myIndex].costPrice = 0;
    } else if (myQty == null || myQty == '' || myQty == undefined) {
      this.tableDataList[myIndex].quantity = 0;
    } else if (mySP == null || mySP == '' || mySP == undefined) {
      this.tableDataList[myIndex].salePrice = 0;
    }
  }


  startAudit(type: any) {

    var url = type == 'start' ? 'StartAudit' : 'EndAudit'

    this.http.post(environment.mainApi + this.global.inventoryLink + url, {
      UserID: this.global.getUserID()
    }).subscribe(
      (Response: any) => {
        console.log(Response);
        if (Response.msg == 'Data Saved Successfully') {
          this.msg.SuccessNotify(Response.msg);

        } else {
          this.msg.WarnNotify(Response.msg);
        }
      }
    )

  }

  SaveBill(type: any) {
    var isValidFlag = true;
    this.tableDataList.forEach((p: any) => {

      p.quantity = parseFloat(p.quantity);
      p.salePrice = parseFloat(p.salePrice);
      p.costPrice = parseFloat(p.costPrice);

      if (p.quantity == 0 || p.quantity == '0' || p.quantity == '' || p.quantity == undefined || p.quantity == null) {
        this.msg.WarnNotify('(' + p.productTitle + ') Quantity is not Valid');
        isValidFlag = false;
        return;
      }
    });

    if (this.tableDataList == '') {
      this.msg.WarnNotify('Atleast One Product Must Be Selected')
    } else if (this.locationID == undefined || this.locationID == 0) {
      this.msg.WarnNotify('Select Location')
    }
    else {

      this.tableDataList = this.tableDataList.map((e: any) => {
        (e.Difference = e.quantity - e.avlQuantity,
          e.ScanQuantity = e.quantity,
          e.productImage = ''
        )

        return e;
      }
      )
      var postData = {
        AuditInventoryID: this.AuditInventoryID,
        AuditID: this.auditID,
        AuditInvDate: this.global.dateFormater(this.invoiceDate, ''),
        Remarks: this.invRemarks || '-',
        LocationID: this.locationID,
        HoldInvNo: this.holdInvNo,
        InvDetail: JSON.stringify(this.tableDataList),
        UserID: this.global.getUserID()
      }
      console.log(this.tableDataList);
      console.log(postData);
      if (isValidFlag == true) {

        if (type == 'hold') {
          if (this.AuditInventoryID > 0) {
            this.global.openPinCode().subscribe(
              (pin: any) => {

                if (pin !== '') {
                  postData['PinCode'] = pin;
                  this.holdBill(postData);
                }
              }
            )
          } else {
            this.holdBill(postData);
          }


        }
      }
    }
  }


  holdBill(postData: any) {
    var urlEnd = this.AuditInventoryID > 0 ? 'UpdateAudit' : 'InsertHoldAudit'
    this.app.startLoaderDark();
    var url = environment.mainApi + this.global.inventoryLink + urlEnd;

    console.log(url);




    this.http.post(url, postData).subscribe(
      (Response: any) => {
        console.log(Response);
        if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.reset();
          this.insertToLocalStorage();
        } else {
          this.msg.WarnNotify(Response.msg);
        }

        this.app.stopLoaderDark()
      },
      (Error: any) => {
        console.log(Error);
        this.app.stopLoaderDark();
      }
    )
  }


  reset() {
    this.invoiceDate = new Date();
    this.locationID = 0;
    this.locationTitle = '';

    this.invRemarks = '';
    this.tableDataList = [];
    this.totalQty = 0;
    this.subTotal = 0;
    this.holdBtnType = 'Hold';
    this.productImage = '';
    this.holdInvNo = '-';
    this.savedInvoiceList = [];
    this.avgCostTotal = 0;
    this.CostTotal = 0;
    this.AuditInventoryID = 0;
    this.auditID = 0;

  }



  findHoldBills(type: any) {

    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetAuditExistingInvoices').subscribe(
      (Response: any) => {
        console.log(Response);
        this.savedInvoiceList = Response;

      },
      (Error: any) => {
        console.log(Error);
        this.msg.WarnNotify(Error);
      }
    )
  }



  printBill(item: any) {
    this.billPrint.printBill(item);

  }

  auditID: any = 0;
  AuditInventoryID: any = 0;

  retriveBill(item: any) {

    this.tableDataList = [];
    this.holdBtnType = 'ReHold'
    this.invoiceDate = new Date(item.auditInvDate);
    this.locationID = item.locationID;
    // this.locationTitle = item.locationTitle;

    this.invRemarks = item.remarks;
    this.auditID = item.auditID;
    this.AuditInventoryID = item.auditInventoryID;
    // this.holdInvNo = item.invBillNo;
    // this.subTotal = item.auditInventoryID;

    this.getBillDetail(item.auditInventoryID).subscribe(
      (Response: any) => {
        console.log(Response)

        // this.totalQty = 0;
        // this.CostTotal = 0;
        // this.avgCostTotal = 0;
        // this.productImage = Response[Response.length - 1].productImage;


        Response.forEach((e: any) => {

          // this.totalQty += e.quantity;
          // this.CostTotal += e.quantity * e.costPrice;
          // this.avgCostTotal += e.quantity * e.avgCostPrice;
          this.tableDataList.push({
            rowIndex: this.tableDataList.length + 1,
            productID: e.productID,
            productTitle: e.productTitle,
            barcode: e.barcode,
            // productImage: e.productImage,
            quantity: e.quantity,
            avgCostPrice: e.avgCostPrice,
            costPrice: e.costPrice,
            salePrice: e.salePrice,
            avlQuantity: e.avlQuantity,
          })
        });

        //////////sorting data table base on sort type
        this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex)
          : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);

        this.getTotal();

        this.insertToLocalStorage();

      }
    )


  }


  public getBillDetail(billNo: any): Observable<any> {
    var url = environment.mainApi + this.global.inventoryLink + 'GetSingleAuditInvDetail?reqInvID=' + billNo;
    console.log(url);
    return this.http.get(url).pipe(retry(3));
  }





}

