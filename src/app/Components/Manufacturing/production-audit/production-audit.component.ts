import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { Router } from '@angular/router';
import { Observable, retry } from 'rxjs';
import Swal from 'sweetalert2';
import { ProductionAuditInvPrintComponent } from './production-audit-inv-print/production-audit-inv-print.component';

@Component({
  selector: 'app-production-audit',
  templateUrl: './production-audit.component.html',
  styleUrls: ['./production-audit.component.scss']
})
export class ProductionAuditComponent implements OnInit {

  apiReq: any = environment.mainApi + this.global.manufacturingLink;

  @ViewChild(ProductionAuditInvPrintComponent) billPrint: any;

  @HostListener('document:visibilitychange', ['$event'])

  appVisibility() {
    if (document.hidden) { } else { this.importFromLocalStorage(); }
  }

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


  }



  ngOnInit(): void {
    this.global.setHeaderTitle('Stock Audit');
    this.getLocation();
    $('.searchProduct').trigger('focus');
    this.global.getProducts().subscribe(
      (data: any) => { this.productList = data; })

    this.importFromLocalStorage();
    this.getItemList();



  }


  roleTypeID = this.global.getRoleTypeID();

  autoInsert = false;
  autoMerge = true;
  sortType = 'desc';


  projectID = this.global.getProjectID();
  Date: Date = new Date();
  holdInvNo = '-';
  holdBtnType = 'Hold';
  invoiceDate: Date = new Date();
  locationID = 0;
  locationTitle = '';
  locationList: any = [];

  invRemarks: any = '';
  PBarcode: any = '';
  productList: any = [];
  tableDataList: any = [];

  productImage: any = '';
  subTotal: number = 0;
  totalQty: number = 0;
  savedInvoiceList: any = [];
  issueTypeList: any = [];
  avgCostTotal = 0;
  CostTotal = 0;
  tempQty: any = '';
  tempProdRow: any = [];
  tmpQuantity: any = '';
  tmpAvailableQty = 0;
  tmpPreviousEnteredQty = 0;

  BrandList: any = [];



  ///////////////////////////////////////////


  itemList: any = [];

  getItemList() {

    this.http.get(this.apiReq + 'GetAllMnuItems').subscribe(
      {
        next: (Response: any) => {
          if (Response.length > 0) {
            this.itemList = Response.filter((e: any) => e.activeStatus == true && e.approvedStatus == true);
          }
        },
        error: error => {
          console.log(error);
        }
      }
    )

  }




  changeOrder() {
    this.sortType = this.sortType == 'desc' ? 'asc' : 'desc';
    this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);

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


        var barcode = this.PBarcode;
        var qty: number = 0;
        var BType = '';


        var row = this.itemList.filter((e: any) => e.mnuItemCode == barcode);

        if (row.length > 0) { 
          this.tempProdRow = row[0];
          if (this.autoInsert) {
            this.addMenuItem(this.tempProdRow, 1);
          } else {
            $('#qtyInput').trigger('select');
            $('#qtyInput').trigger('focus');
          }
        } else {
          this.msg.WarnNotify('Item Not Found');
          $('#searchProduct').trigger('focus');
          this.PBarcode = '';
        }

      }
    }


  }

  onQtyinsert(event: any) {

    if (this.tempProdRow != '' && event.target.value > 0) {

      if (event.keyCode == 13) {
        this.addMenuItem(this.tempProdRow, event.target.value);
      }
    }

  }



  addMenuItem(item: any, qty: any) {

    var index = this.tableDataList.findIndex((e: any) => e.mnuItemID == item.mnuItemID);

    if (index != -1) {
      this.tableDataList[index].quantity += Number(qty);
      this.PBarcode = '';
      $('.mbsearchProduct').trigger('focus');
      this.getTotal();
      this.insertToLocalStorage();
      this.tmpQuantity = 0;
      return;


    }


    this.tableDataList.push({
      mnuItemID: item.mnuItemID,
      barcode: item.mnuItemCode,
      productTitle: item.mnuItemTitle,
      quantity: Number(qty),
      labourCost: 0,
      costPrice: item.mnuItemCostPrice,
      salePrice: item.mnuItemSalePrice
    })

    this.insertToLocalStorage();
    this.PBarcode = '';
    this.getTotal();
    this.tmpQuantity = 0;
    $('.searchProduct').trigger('focus');


  }



  insertToLocalStorage() {

    var prodData = JSON.stringify(this.tableDataList);
    var locationID = JSON.stringify(this.locationID);
    var AuditInventoryID = JSON.stringify(this.AuditInventoryID);
    var autMerge = JSON.stringify(this.autoMerge);
    var AuditID = JSON.stringify(this.auditID);
    var remarks = JSON.stringify(this.invRemarks);

    localStorage.removeItem('tmpAuditData');
    localStorage.removeItem('tmpAuditLocation');
    localStorage.removeItem('tmpAuditInventoryID');
    localStorage.removeItem('tmpAuditID');
    localStorage.removeItem('tmpAutoMerge');
    localStorage.removeItem('tmpRemarks');

    localStorage.setItem('tmpAuditData', prodData);
    localStorage.setItem('tmpAuditLocation', locationID);
    localStorage.setItem('tmpAuditInventoryID', AuditInventoryID);
    localStorage.setItem('tmpAuditID', AuditID);
    localStorage.setItem('tmpAutoMerge', autMerge);
    localStorage.setItem('tmpRemarks', remarks);



  }

  importFromLocalStorage() {

    var data = JSON.parse(localStorage.getItem('tmpAuditData') || '[]');

    if (this.tableDataList.length > 0) {
      if (data == '0' || data == '') {
        Swal.fire({
          title: "No Data Found",
          text: "Storage Limit Exceed Please Hold the Bill Else Data will be Lost on Reload?",
          icon: "warning"
        });
        // this.msg.WarnNotify('Storage Limit Exceed Please Hold the Bill Else Data will be vanished on Reload?')
        return;
      }
    }

    this.invRemarks = JSON.parse(localStorage.getItem('tmpRemarks') || '');
    this.autoMerge = JSON.parse(localStorage.getItem('tmpAutoMerge') || 'false');
    this.auditID = JSON.parse(localStorage.getItem('tmpAuditID') || '0');
    this.AuditInventoryID = JSON.parse(localStorage.getItem('tmpAuditInventoryID') || '0');
    this.locationID = JSON.parse(localStorage.getItem('tmpAuditLocation') || '0');
    this.tableDataList = data;
    this.getTotal();

    if (this.AuditInventoryID > 0) {
      this.holdBtnType = 'Rehold'
    }



  }



  holdDataFunction(data: any) {

    if (this.locationID == 0 || this.locationID == undefined || this.locationID == null) {
      this.msg.WarnNotify('Select Location');
      return;
    }

    if (this.autoInsert) {
      this.addMenuItem(data, 1);
    } else {
      this.tempProdRow = data;
      $('#qtyInput').trigger('select');
      $('#qtyInput').trigger('focus');
    }



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
      if (this.prodFocusedRow >= 24) {
        return;
      }

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
    if (this.tableDataList.length == 0) return;

    this.global.confirmAlert().subscribe(
      (Response: any) => {
        if (Response == true) {
          this.reset();
          this.insertToLocalStorage();
        }
      })
  }


  changeValue(item: any) {
    this.tmpAvailableQty = item.avlQuantity;
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

    var url = type == 'start' ? 'StartAudit' : 'PostAudit'

    if (type == 'start') {
      this.app.startLoaderDark();
      this.http.post(environment.mainApi + this.global.inventoryLink + url, {
        UserID: this.global.getUserID(),
      }).subscribe(
        (Response: any) => {
          if (Response.msg == 'Data Saved Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.global.closeBootstrapModal('#AuditStart', true);

          } else {
            this.msg.WarnNotify(Response.msg);
          }
          this.app.stopLoaderDark();
        },
        (Error: any) => {
          console.log(Error);
          this.app.stopLoaderDark();
        }
      )
    }

    if (type == 'post') {
      Swal.fire({
        title: "Do you want to post Audit?",
        text: 'After posting all the holded audit invoices will be posted and will not be editable anymore.',
        showCancelButton: true,
        confirmButtonText: "Confirm",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.global.closeBootstrapModal('#AuditStart', true);
          this.global.openPinCode().subscribe(
            (pin: any) => {
              if (pin != '') {


                var postData = {
                  UserID: this.global.getUserID(),
                  PinCode: pin,
                  ProjectID: this.global.getProjectID(),
                  remarks: '-'
                };
                this.app.startLoaderDark();
                this.http.post(environment.mainApi + this.global.inventoryLink + url, postData).subscribe(
                  (Response: any) => {
                    if (Response.msg == 'Data Updated Successfully') {
                      this.msg.SuccessNotify(Response.msg);
                      this.findHoldBills();
                      this.global.closeBootstrapModal('#AuditStart', true);

                    } else {
                      this.msg.WarnNotify(Response.msg);
                    }
                    this.app.stopLoaderDark();
                  },
                  (Error: any) => {
                    console.log(Error);
                    this.app.stopLoaderDark();
                  }
                )
              }
            }
          )
        }
      });
    }




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
    this.http.post(url, postData).subscribe(
      (Response: any) => {
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
    this.tmpAvailableQty = 0;
    this.tmpPreviousEnteredQty = 0;

  }



  findHoldBills() {

    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetAuditExistingInvoices').subscribe(
      (Response: any) => {
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


    this.invRemarks = item.remarks;
    this.auditID = item.auditID;
    this.AuditInventoryID = item.auditInventoryID;


    this.getBillDetail(item.auditInventoryID).subscribe(
      (Response: any) => {



        Response.forEach((e: any) => {

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
            scanTime: e.scanTime,
            subCategoryID: e.subCategoryID,
            brandID: e.brandID,
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
    return this.http.get(url).pipe(retry(3));
  }





}


