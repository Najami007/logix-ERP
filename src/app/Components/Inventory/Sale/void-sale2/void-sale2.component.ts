import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';

import * as $ from 'jquery';

import { Observable, retry } from 'rxjs';

import { SaleBillPrintComponent } from '../SaleComFiles/sale-bill-print/sale-bill-print.component';
import { PaymentMehtodComponent } from '../SaleComFiles/payment-mehtod/payment-mehtod.component';
import { SaleBillDetailComponent } from 'src/app/Components/Restaurant-Core/Sales/sale1/sale-bill-detail/sale-bill-detail.component';

import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatCheckbox } from '@angular/material/checkbox';
import { VsenterqtyComponent } from '../void-sale/vsenterqty/vsenterqty.component';

@Component({
  selector: 'app-void-sale2',
  templateUrl: './void-sale2.component.html',
  styleUrls: ['./void-sale2.component.scss']
})
export class VoidSale2Component implements OnInit {




  discFeature = this.global.discFeature;
  BookerFeature = this.global.BookerFeature;
  gstFeature = this.global.gstFeature;
  customerFeature = this.global.customerFeature;
  tillOpenFeature = this.global.tillOpenFeature;
  editSpFeature = this.global.editSpFeature;
  editDiscFeature = this.global.editDiscFeature;
  prodDetailFeature = this.global.prodDetailFeature;
  BankShortCutsFeature = this.global.BankShortCutsFeature;
  FBRFeature = this.global.FBRFeature;
  LessToCostFeature = this.global.LessToCostFeature;
  changePaymentMehtodFeature = this.global.changePaymentMehtodFeature;
  onlySaveBillFeature = this.global.onlySaveBillFeature;
  disableDate = this.global.DisableDateSale;
  postBillFeature = this.global.postSale;
  urduBillFeature = this.global.urduBill;
  disablePrintPwd = this.global.DisablePrintPwd;
  VehicleSaleFeature = this.global.VehicleSaleFeature;
  CusDiscFeature = this.global.CusDiscFeature;
  RestBillUserwise = this.global.RestBillUserwise;
  NonFBRFeature = this.global.NonFBRFeature;
  DisableVoidpwdFeature = this.global.DisableVoidpwdFeature;
  disableDiscPwd = this.global.DisableDiscPwd;
  ImageUrlFeature = this.global.ImageUrlFeature;
  DashSlashBarcodeFeature = this.global.dashSlashBarcodeFeature;
  insertLocalStorageFeature = this.global.insertLocalStorageFeature;






  @ViewChild(SaleBillPrintComponent) billPrint: any;

  ////////////////// will give the current tab visible status

  @HostListener('document:visibilitychange', [])


  appVisibility() {
    ////////////// restrict to save in localstorage///////
    if (!this.insertLocalStorageFeature) return;
    if (document.hidden) { } else { this.importFromLocalStorage(); }
  }


  @HostListener('document:keydown', ['$event'])

  handleKeyboardEventSearchByNaem(event: KeyboardEvent) {
    if (event.altKey && event.key.toLowerCase() === 'n') {
      this.byNameSearch = !this.byNameSearch;
      $('#vssearchProduct').trigger('focus');
    }
  }
  companyProfile: any = [];
  companyLogo: any = '';
  companyAddress: any = '';
  CompanyMobile: any = '';
  companyName: any = '';
  crudList: any = { c: true, r: true, u: true, d: true };


  mobileMask = this.global.mobileMask;
  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    public global: GlobalDataModule,
    private dialogue: MatDialog,
    private app: AppComponent,
    private route: Router,
    public bottomSheet: MatBottomSheet
  ) {
    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());

    })

    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
      this.companyLogo = data[0].companyLogo1;
      this.CompanyMobile = data[0].companyMobile;
      this.companyAddress = data[0].companyAddress;
      this.companyName = data[0].companyName;
    });





    ///////////// will Check day is opened or not ///////////////
    this.global.getCurrentOpenDay().subscribe(
      (Response: any) => {
        // alert(Response)
        if (Response == null || Response == '') {
          Swal.fire({
            title: 'Alert!',
            text: 'Day Is Currently Closed',
            position: 'center',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
          })
        }
      }
    )


  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Sale');
    this.getBankList();
    // this.getCurrentBill();
    this.getPartyList();
    this.getBooker();
    this.getDiscCustomerlist();
    setTimeout(() => {
      $('#vssearchProduct').trigger('select');
      $('#vssearchProduct').trigger('focus');
    }, 200);

    this.global.getProducts().subscribe(
      (data: any) => { this.productList = data; })

    this.importFromLocalStorage();

  }


  openBottomSheet(templateRef: TemplateRef<any>) {
    this.bottomSheet.open(templateRef);
  }


  tmpDiscCustomerList: any = [];

  onCodeScan(e: any) {

    if (e.keyCode == 13 && this.cusDiscCode !== '') {

      var dataRow = this.discCustomerList.filter((e: any) => e.disCode == this.cusDiscCode);

      if (dataRow.length > 0) {
        this.tmpDiscCustomerList = dataRow[0];
        this.cusDisc = dataRow[0].cusDisc;

      } else {
        this.msg.WarnNotify('Code not Valid');
        this.tmpDiscCustomerList = [];
        this.cusDisc = 0;

      }
      this.getTotal();
      this.cusDiscCode = '';
    }

  }


  cusDisc: any = 0;
  CusDiscAmount: any = 0;
  cusDiscCode: any = '';

  byNameSearch: any = false;

  billRemarks = '';

  productList: any = [];
  bankCoaList: any = [];
  projectID = this.global.getProjectID();
  InvDate = new Date();
  PBarcode: any = '';
  tableDataList: any = [];
  voidDataList: any = [];
  productImage: any;
  discount: any = 0;
  otherCharges: any = 0;
  change = 0;
  paymentType = 'Cash';
  cash: any = 0;
  bankCash: any = 0;
  bankCoaID = 0;

  subTotal = 0;
  netTotal = 0;
  totalQty = 0;

  customerName = '';
  customerMobileno = '';

  savedBillList: any = [];
  curDate = new Date();

  tempQty = 1;
  tempProdRow: any;
  tempDisc = 0;
  DiscPercent = 0;


  invBillNo = '';
  partyID = 0;
  bookerID = 0;
  qtyTotal: any = 0;
  offerDiscount: any = 0;
  PosFee = this.global.POSFee;

  tempProdData: any = [];


  tmpCash = 0;
  tmpChange = 0;

  productName: any = '';

  //////////////////////////////////////////////////////////////


  discCustomerList: any = [];

  getDiscCustomerlist() {
    this.http.get(environment.mainApi + this.global.companyLink + 'getParty').subscribe(
      {
        next: (Response: any) => {

          if (Response.length > 0) {
            this.discCustomerList = Response.filter((e: any) => e.partyType == 'Customer-Disc');
          }
        },
        error: (error: any) => {
          console.log(error);
        }
      }
    )
  }


  //////////////////////  get List of Banks//////////////////////

  getBankList() {
    this.http.get(environment.mainApi + 'acc/GetVoucherCBCOA?type=BRV').subscribe(
      (Response: any) => {
        this.bankCoaList = Response;
        setTimeout(() => {
          this.bankCoaID = Response[0].coaID;
        }, 200);
      },
      (Error) => {

      }
    )
  }




  ///////////// getting List of Booker///////////////

  bookerList: any = [];
  getBooker() {
    this.global.getBookerList().subscribe((data: any) => { this.bookerList = data; });
  }



  /////////////////// getting List of Customers///////////////
  partyList: any = [];
  getPartyList() {
    this.global.getCustomerList().subscribe((data: any) => { this.partyList = data; });
  }

  partySelect() {
    if (this.partyID > 0) {
      this.paymentType = 'Credit';

    } else {
      this.paymentType = 'Cash';
    }
    this.getTotal();
  }





  searchByCode(e: any) {

    var barcode = this.PBarcode;
    var qty: number = 0;
    var BType = '';

    if (this.PBarcode !== '') {
      if (e.keyCode == 13) {


        if (this.DashSlashBarcodeFeature) {
          /// Seperating by / and coverting to Qty
          if (this.PBarcode.split("/")[1] != undefined) {
            barcode = this.PBarcode.split("/")[0];
            qty = parseFloat(this.PBarcode.split("/")[1]);
            BType = 'price';


          }
          /// Seperating by - and coverting to Qty 
          if (this.PBarcode.split("-")[1] != undefined) {
            barcode = this.PBarcode.split("-")[0];
            qty = parseFloat(this.PBarcode.split("-")[1]);
            BType = 'qty';

          }
        }


        // this.app.startLoaderDark();
        this.global.getProdDetail(0, barcode).subscribe(
          (Response: any) => {
            if (Response == '' || Response == null || Response == undefined) {
              this.searchSpecialBarcode(barcode, qty);
              return;
            } else {

              if (BType == 'price') { qty = qty / parseFloat(Response[0].salePrice); }
              this.pushProdData(Response[0], qty);
            }
          }
        )


        this.PBarcode = '';
        this.getTotal();
        $('#psearchProduct').trigger('focus');

      }
    }
  }

  holdDataFunction(data: any) {
    this.global.getProdDetail(data.productID, '').subscribe(
      (Response: any) => {
        this.pushProdData(Response[0], 1)
      }
    )

    this.app.stopLoaderDark();
    this.productName = '';
    this.getTotal();
    this.global.closeBootstrapModal('#prodModal', true);
    setTimeout(() => {
      $('#psearchProduct').trigger('focus');
    }, 500);

  }

  pushProdData(data: any, qty: any, entryType: any = 'IN') {
    /////// check already present in the table or not
    const targetBarcode = data.barcode2 || data.barcode;
    var condition = this.tableDataList.find(
      (x: any) => x.productID == data.productID && x.barcode == targetBarcode

    );

    var index = this.tableDataList.indexOf(condition);
    //// push the data using index
    if (condition == undefined) {


      var tmpQuantity = 0;
      var discRupee = 0;
      var discPerc = 0;
      var tmpBarcode = '';

      if (data.barcode2) {
        tmpBarcode = data.barcode2;
      } else {
        tmpBarcode = data.barcode;
      }

      if (qty > 0) {
        tmpQuantity = qty * data.quantity;
      } else {
        tmpQuantity = data.quantity;
      }

      if (this.discFeature && data.barcode2) {
        discPerc = data.discInP;
        discRupee = data.discInR / tmpQuantity;
      }
      if (this.discFeature && !data.barcode2) {
        discPerc = data.discPercentage
        discRupee = data.discRupees;
      }

      this.tableDataList.push({
        rowIndex: this.tableDataList.length == 0 ? this.tableDataList.length + 1
          : this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1
            : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
        productID: data.productID,
        productTitle: data.productTitle,
        barcode: tmpBarcode,
        flavourTitle: data.flavourTitle,
        productImage: this.ImageUrlFeature ? data.imagesPath : data.productImage,
        quantity: tmpQuantity,
        wohCP: data.costPrice,
        avgCostPrice: data.avgCostPrice,
        costPrice: data.costPrice,
        salePrice: data.salePrice,
        ovhPercent: 0,
        ovhAmount: 0,
        expiryDate: this.global.dateFormater(new Date(), '-'),
        batchNo: '-',
        batchStatus: '-',
        uomID: data.uomID,
        gst: this.gstFeature ? data.gst : 0,
        et: data.et,
        packing: data.packing,
        multyQty: data.multyQty,
        uomTitle: data.uomTitle,
        discInP: this.discFeature ? discPerc : 0,
        discInR: this.discFeature ? discRupee : 0,
        aq: data.aq,
        entryType: entryType,
        total: (data.salePrice * qty) - (discRupee * qty),
        productDetail: '',

      });

      //this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex);
      this.sortTableData();
      this.getTotal();
      this.productImage = this.ImageUrlFeature ? data.imagesPath : data.productImage;




    } else {
      if (this.PBarcode.split("/")[1] != undefined) {
        qty = this.PBarcode.split("/")[1] / this.tableDataList[index].salePrice;
      }
      var newQty: any = Number(qty) > 0 ? Number(qty) * data.quantity : data.quantity;
      this.tableDataList[index].quantity = Number(this.tableDataList[index].quantity) + newQty;

      /////// Sorting Table
      this.tableDataList[index].rowIndex = this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1 : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1;
      this.sortTableData();
      this.productImage = this.tableDataList[index].productImage;
      this.getTotal();
    }

  }


  pushVoidData(data: any, qty: any, entryType: any = 'VOID') {
    /////// check already present in the table or not
    const targetBarcode = data.barcode2 || data.barcode;

    this.voidDataList.push({
      rowIndex: this.tableDataList.length == 0 ? this.tableDataList.length + 1
        : this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1
          : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
      productID: data.productID,
      productTitle: data.productTitle,
      barcode: targetBarcode,
      flavourTitle: data.flavourTitle,
      productImage: '',
      quantity: qty,
      wohCP: data.costPrice,
      avgCostPrice: data.avgCostPrice,
      costPrice: data.costPrice,
      salePrice: data.salePrice,
      ovhPercent: 0,
      ovhAmount: 0,
      expiryDate: this.global.dateFormater(new Date(), '-'),
      batchNo: '-',
      batchStatus: '-',
      uomID: data.uomID,
      gst: data.gst,
      et: data.et,
      packing: data.packing,
      multyQty: data.multyQty,
      uomTitle: data.uomTitle,
      discInP: data.discPerc,
      discInR: data.discRupee,
      aq: data.aq,
      entryType: entryType,
      productDetail: '',
      entryTime: new Date(),

    });

    console.log(this.voidDataList);
  }

  searchSpecialBarcode(barcode: any, qty: any) {

    //////////////// For Special Barcode setting /////////////////////////

    var txtBCode = barcode;
    var reqQty: any = 0;
    var reqQtyDot: any = 0;
    var prodQty: any = 0;
    var tmpPrice: any = 0;

    txtBCode = txtBCode.substring(2, 7);  /////////// extracting product barcode from special barcode
    txtBCode = parseInt(txtBCode);
    txtBCode = txtBCode.toString();

    /////////// verifying whether exists in product list or not
    var prodDetail = this.productList.find((p: any) => p.barcode == txtBCode);


    this.global.getProdDetail(0, txtBCode).subscribe(
      (Response: any) => {

        if (Response == '' || Response == null || Response == undefined) {
          this.msg.WarnNotify('Product Not Found');
          return;
        }

        if (Response[0].barcodeType !== 'Special') {
          this.msg.WarnNotify('Product Not Found');
          return;
        }

        /////////// extracting price from special barcode based on UOM
        if (Response[0].uomTitle == 'price') {
          reqQty = barcode.substring(12 - 5);
          reqQtyDot = reqQty.substring(0, 5);
          tmpPrice = reqQtyDot;

        } else if (Response[0].uomTitle == 'piece') {
          reqQty = barcode.substring(12 - 5);
          reqQtyDot = reqQty.substring(6 - 4);
          reqQtyDot = reqQtyDot.substring(0, 3);
          reqQty = reqQty.substring(0, 5);
          prodQty = parseFloat(reqQty);

        }
        else {
          /////////// extracting quantity from special barcode based on UOM
          reqQty = barcode.substring(12 - 5);
          reqQtyDot = reqQty.substring(6 - 4);
          reqQtyDot = reqQtyDot.substring(0, 3);
          reqQty = reqQty.substring(0, 2);
          prodQty = parseFloat(reqQty + '.' + reqQtyDot);
        }

        var condition = this.tableDataList.find(
          (x: any) => x.productID == Response[0].productID
        );
        var index = this.tableDataList.indexOf(condition);
        if (condition == undefined) {
          /////////// inserting data into tableDataList
          Response[0].salePrice = tmpPrice || Response[0].salePrice;
          this.pushProdData(Response[0], prodQty || 1)

        } else {
          /////////// changing qty if product already scanned
          if (prodDetail.uomTitle == 'price') {
            this.tableDataList[index].quantity = parseFloat(this.tableDataList[index].quantity) + 1;
            this.tableDataList[index].total = parseFloat(this.tableDataList[index].total) + parseFloat(tmpPrice);
            this.tableDataList[index].salePrice = parseFloat(this.tableDataList[index].total) / parseFloat(this.tableDataList[index].quantity);
          } else {
            this.tableDataList[index].quantity = parseFloat(this.tableDataList[index].quantity) + parseFloat(prodQty);
          }
          this.tableDataList[index].rowIndex = this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1 : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1;
          this.sortTableData();
          this.productImage = this.tableDataList[index].productImage;

        }



        this.getTotal();


      }
    )


  }
  sortType = 'desc';

  sortTableData() {
    this.sortType == 'desc'
      ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex)
      : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);

  }




  //////////////////////////  Get Current Bill Data for which Products are Scanning//////////////////////////////////
  // //////////////////////
  getCurrentBill() {


    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSaleExistingBill?reqUserID=' + this.global.getUserID() + '&reqType=HS').subscribe(
      (Response: any) => {
        this.tableDataList = [];
        if (Response.length > 0) {
          this.invBillNo = Response[0].invBillNo;
          Response.forEach((e: any) => {

            this.tableDataList.push({
              productID: e.productID,
              productTitle: e.productTitle,
              barcode: e.barcode,
              flavourTitle: e.flavourTitle,
              productImage: e.productImage,
              tmpQuantity: e.quantity * e.multyQty,
              quantity: e.quantity * e.multyQty,
              wohCP: e.costPrice,
              costPrice: e.costPrice,
              avgCostPrice: e.avgCostPrice,
              salePrice: e.salePrice,
              ovhPercent: 0,
              ovhAmount: 0,
              expiryDate: this.global.dateFormater(new Date(), '-'),
              batchNo: '-',
              batchStatus: '-',
              uomID: e.uomID,
              packing: e.packing,
              multyQty: e.multyQty,
              discInP: e.discInP,
              discInR: e.discInR / e.multyQty,
              aq: e.aq,
              autoInvDetID: e.autoInvDetID,
              gstAmount: e.gstAmount,
              gstValue: e.gstValue,
              gst: this.gstFeature ? e.gst : 0,
              cusDiscAmount: ((e.salePrice - e.avgCostPrice) * this.cusDisc) / 100,
              cusDisc: this.cusDisc,

            })
          });

          this.productImage = Response[0].productImage;
          // this.tableDataList.sort((a: any, b: any) => b.autoInvDetID - a.autoInvDetID)

          this.getTotal();
        }

      }
    )
  }




  //////////////////////////////  For Getting Totals of All whole Bill ////////////////////////////////////////////////////


  getTotal() {
    this.qtyTotal = 0;
    this.subTotal = 0;
    this.netTotal = 0;
    this.offerDiscount = 0;
    this.CusDiscAmount = 0;
    this.tableDataList.forEach((e: any) => {
      // if (this.billDiscount > 0) {
      //   e.discInP = this.billDiscount;
      //   e.discInR = (e.salePrice * this.billDiscount) / 100
      // }
      e.total = ((parseFloat(e.salePrice) - parseFloat(e.discInR)) * parseFloat(e.quantity));
      this.qtyTotal += parseFloat(e.quantity);
      this.subTotal += parseFloat(e.quantity) * parseFloat(e.salePrice);
      this.offerDiscount += parseFloat(e.discInR) * parseFloat(e.quantity);

      e.cusDisc = this.cusDisc;
      e.cusDiscAmount = ((e.salePrice - e.avgCostPrice) * this.cusDisc) / 100;
      this.CusDiscAmount += e.cusDiscAmount * e.quantity;

    });

    if (this.discount == '') {
      this.discount = 0;
    }

    if (this.cash == '') {
      this.cash = 0;
    }


    if (this.gstFeature) {
      this.subTotal = this.subTotal + this.PosFee;
    }

    this.netTotal = this.subTotal - Number(this.discount) - Number(this.offerDiscount) - Number(this.CusDiscAmount);

    if (this.paymentType == 'Split') {
      this.bankCash = this.netTotal - Number(this.cash);
    }
    if (this.paymentType == 'Bank') {
      this.bankCash = this.netTotal;
    }



    if (this.paymentType !== 'Credit') {
      this.partyID = 0;
    }

    this.change = (Number(this.cash) + Number(this.bankCash)) - this.netTotal;
    ////////////// restrict to save in localstorage///////
    if (!this.insertLocalStorageFeature) return;
    this.insertToLocalStorage();


  }






  ///////////////////////////////// Handle Product List focusing on key up and down  /////////////////////////////////////////////////
  rowFocused = -1;
  prodFocusedRow = 0;

  handleProdFocus(item: any, e: any, cls: any, endFocus: any, prodList: []) {

    // if (e.keyCode == 9 && !e.shiftKey) {
    //   this.prodFocusedRow += 1;

    // }
    // if (e.shiftKey && e.keyCode == 9) {
    //   this.prodFocusedRow -= 1;

    // }

    /////move down
    if (e.keyCode == 40) {
      if (this.prodFocusedRow >= 24) {
        return;
      }
      if (prodList.length > 0) {
        this.prodFocusedRow += 1;
        if (this.prodFocusedRow >= prodList.length) {
          this.prodFocusedRow -= 1
        } else {
          var clsName = cls + this.prodFocusedRow;
          //  alert(clsName);
          $(clsName).trigger('focus');


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

    //  alert(this.prodFocusedRow);  
  }





  ////////////////////////////////////// General Function for changing focus///////////////////
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

          $('.prodRow0').trigger('focus');
        }
      }
    }



  }

  focusTo(e: any, cls: any) {
    if (cls == '#disc' && e.keyCode == 13) {
      e.preventDefault();
      $(cls).trigger('select');
      $(cls).trigger('focus');
    }
    if (cls == '#charges' && e.keyCode == 13) {
      e.preventDefault();
      $(cls).trigger('select');
      $(cls).trigger('focus');
    }
    if (cls == '#cash' && e.keyCode == 13 && e.target.value == '') {
      e.preventDefault();
      $(cls).trigger('select');
      $(cls).trigger('focus');
    }

    if (cls == '#save' && e.keyCode == 13) {
      e.preventDefault();
      // $(cls).trigger('select');
      $(cls).trigger('focus');
    }

    if (cls == '#vssearchProduct' && e.keyCode == 13) {
      e.preventDefault();
      $(cls).trigger('select');
      $(cls).trigger('focus');
    }

  }


  ///////////////////////////////////

  handleNumKeys(item: any, e: KeyboardEvent, cls: string, index: number) {
    const allowedKeys = [
      'Enter', 'Backspace', 'Tab', 'Shift', 'Delete', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', '.',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ];

    // Tab and Shift+Tab navigation
    if (e.key === 'Tab' && !e.shiftKey) {
      this.rowFocused = index + 1;
    } else if (e.key === 'Tab' && e.shiftKey) {
      this.rowFocused = index - 1;
    }

    // Allow specific keys only
    if (!allowedKeys.includes(e.key) && !(e.key >= 'Numpad0' && e.key <= 'Numpad9')) {
      e.preventDefault();
    }

    // Move down (ArrowDown)
    if (e.key === 'ArrowDown') {
      if (this.tableDataList.length > 1 && this.rowFocused < this.tableDataList.length - 1) {
        this.rowFocused += 1;
        const clsName = cls + this.rowFocused;
        e.preventDefault();
        $(clsName).trigger('select');
        $(clsName).trigger('focus'); // still using jQuery here
      }
    }

    // Move up (ArrowUp)
    if (e.key === 'ArrowUp') {
      if (this.rowFocused === 0) {
        $(".searchProduct").trigger('focus'); // using jQuery
      } else if (this.tableDataList.length > 1) {
        this.rowFocused -= 1;
        const clsName = cls + this.rowFocused;
        e.preventDefault();
        $(clsName).trigger('select');
        $(clsName).trigger('focus');
      }
    }

    // Delete row
    if (e.key === 'Delete') {
      this.delRow(item);
      this.rowFocused = 0;
    }
  }








  /////////////////////////// Discount Funcionality ////////////////
  onDiscChange(type: any) {
    if (type == 'amt') {
      this.DiscPercent = (this.tempDisc / this.netTotal) * 100;
    }

    if (type == 'percent') {
      this.tempDisc = (this.netTotal * this.DiscPercent) / 100;
    }
  }

  onDiscountClick() {
    if (this.tableDataList.length > 0) {
      this.global.openBootstrapModal('#discountModal', true);
      setTimeout(() => {
        $('#discR').trigger('select');
        $('#discR').trigger('focus');
      }, 500);
    }
  }


  EnterDiscount(amount: any) {
    if (amount > this.netTotal) {
      this.msg.WarnNotify('Discount is not Valid!')
    } else {


      if (this.disableDiscPwd == true) {

        $('#cash').trigger('focus');
        if (amount == '' || amount == undefined) {
          this.discount = 0;
        } else {
          this.discount = amount;
        }
        this.getTotal()
      } else {

        this.global.openPassword('Password').subscribe(pin => {
          if (pin !== '') {
            this.app.startLoaderDark();
            this.http.post(environment.mainApi + this.global.userLink + 'MatchPassword', {
              RestrictionCodeID: 2,
              Password: pin,
              UserID: this.global.getUserID()

            }).subscribe(
              (Response: any) => {
                if (Response.msg == 'Password Matched Successfully') {
                  $('#cash').trigger('focus');
                  if (amount == '' || amount == undefined) {
                    this.discount = 0;
                  } else {
                    this.discount = amount;
                  }
                  this.getTotal()

                } else {
                  this.msg.WarnNotify(Response.msg);
                }

                this.app.stopLoaderDark();
              }
            )
          }
        })

      }



    }
  }



  ///////////////////////////// For Image Modal View /////////////////////////////////////////////////////

  showImg(item: any) {

    // var index = this.tableDataList.findIndex((e: any) => e.productID == item.productID);
    // this.productImage = this.tableDataList[index].productImage;

    this.getProductImage(item)

  }


  getProductImage(item: any) {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetProductImage?ProductID=' + item.productID).subscribe(
      (Response: any) => {

        this.productImage = Response[0].productImage;

        $('.loaderDark').fadeOut();
      }
    )
  }


  //////////////////////////////// Sale Insert Function //////////////////////////////////////////////////
  isProcessing = false;
  save(paymentType: any, SendToFbr: any) {

    if (this.isProcessing) { return; }

    var inValidCostProdList = this.tableDataList.filter((p: any) => Number(p.costPrice) > Number(p.salePrice) || p.costPrice == 0 || p.costPrice == '0' || p.costPrice == '' || p.costPrice == undefined || p.costPrice == null);
    var inValidSaleProdList = this.tableDataList.filter((p: any) => p.salePrice == 0 || p.salePrice == '0' || p.salePrice == '' || p.salePrice == undefined || p.salePrice == null);
    var inValidQtyProdList = this.tableDataList.filter((p: any) => p.quantity == 0 || p.quantity == '0' || p.quantity == null || p.quantity == undefined || p.quantity == '')
    var inValidDiscProdList = this.tableDataList.filter((p: any) => Number(p.costPrice) > (Number(p.salePrice) - (Number(p.discInR))));


    if (inValidCostProdList.length > 0 && !this.LessToCostFeature) {
      this.msg.WarnNotify('(' + inValidCostProdList[0].productTitle + ') Cost Price greater than Sale Price');
      return;
    }
    if (inValidSaleProdList.length > 0) {
      this.msg.WarnNotify('(' + inValidSaleProdList[0].productTitle + ') Sale Price is not Valid');
      return;
    }
    if (inValidQtyProdList.length > 0) {
      this.msg.WarnNotify('(' + inValidQtyProdList[0].productTitle + ') Quantity is not Valid');
      return;
    }

    if (inValidDiscProdList.length > 0 && !this.LessToCostFeature) {
      this.msg.WarnNotify('(' + inValidDiscProdList[0].productTitle + ') Discount is not Valid');
      return;
    }

    if (this.tableDataList == '') {
      this.msg.WarnNotify('No Product Seleted');
      return;
    }
    if (paymentType == 'Cash' && this.partyID == 0 && (this.cash == 0 || this.cash == undefined || this.cash == null)) {
      this.msg.WarnNotify('Enter Cash');
      return;
    }

    if (paymentType == 'Cash' && this.partyID == 0 && this.cash < this.netTotal) {
      this.msg.WarnNotify('Entered Cash is not Valid');
      return;
    }
    if (paymentType == 'Split' && ((this.cash + this.bankCash) > this.netTotal || (this.cash + this.bankCash) < this.netTotal)) {
      this.msg.WarnNotify('Sum Of Both Amount must be Equal to Net Total');
      return;
    }

    if (this.paymentType == 'Split' && this.cash <= 0) {
      this.msg.WarnNotify('Cash Amount is Not Valid');
      return;
    }
    if (this.paymentType == 'Split' && this.bankCash <= 0) {
      this.msg.WarnNotify('Bank Amount is Not Valid');
      return;
    }
    if ((this.bookerID == 0 || this.bookerID == undefined) && this.BookerFeature) {
      this.msg.WarnNotify('Select Booker');
      return;
    }
    if (this.paymentType == 'Credit' && this.partyID == 0) {
      this.msg.WarnNotify('Select Customer');
      return;
    }
    if (paymentType == 'Bank' && (this.bankCash < this.netTotal) || (this.bankCash > this.netTotal)) {
      this.msg.WarnNotify('Enter Valid Amount');
      return;
    }

    if ((paymentType == 'Credit' || paymentType == 'Split' || paymentType == 'Bank') && this.bankCash > 0 && this.bankCoaID == 0) {
      this.msg.WarnNotify('Select Bank');
      return;
    }



    var postData = {
      HoldInvNo: this.invBillNo,
      InvDate: this.global.dateFormater(this.InvDate, '-'),
      PartyID: 0,
      InvType: "S",
      ProjectID: this.projectID,
      BookerID: 0,
      PaymentType: paymentType,
      SendToFbr: SendToFbr,
      PosFee: this.gstFeature ? this.PosFee : 0,
      Remarks: this.billRemarks || '-',
      OrderType: "Take Away",
      BillTotal: this.subTotal,
      BillDiscount: Number(this.discount) + Number(this.offerDiscount) + Number(this.CusDiscAmount),
      OtherCharges: this.otherCharges,
      NetTotal: this.netTotal,
      CashRec: this.cash,
      Change: this.change,
      BankCoaID: this.bankCoaID,
      BankCash: this.bankCash,
      CusContactNo: this.customerMobileno || '-',
      CusName: this.customerName || '-',
      SaleDetail: JSON.stringify(this.tableDataList),
      UserID: this.global.getUserID(),
      DiscPartyID: this.CusDiscFeature ? this.tmpDiscCustomerList.partyID : 0,
      CusDisc: this.cusDisc,
      CusDiscAmount: this.CusDiscAmount || 0,


    }


    if (this.global.SubscriptionExpired()) {
      Swal.fire({
        title: 'Alert!',
        text: 'Unable To Save , Contact To Administrator!',
        position: 'center',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK',
      });
      return;
    }




    this.isProcessing = true;
    this.app.startLoaderDark();


    this.http.post(environment.mainApi + this.global.inventoryLink + 'InsertVoidableSale', postData).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.tmpCash = this.cash;
          this.tmpChange = this.change;
          this.PrintAfterSave(Response.invNo);
          this.reset();
          this.getCurrentBill();

          if (paymentType != 'Cash') {
            $('#vssearchProduct').trigger('focus');  /// setting focus to prodsearch field
            this.global.closeBootstrapModal('#paymentMehtod', true);     //// hiding payment Mehtod Modal window

          }


        } else {
          this.msg.WarnNotify(Response.msg);
        }
        this.app.stopLoaderDark();
        this.isProcessing = false;
      },
      (Error: any) => {
        this.isProcessing = false;
        this.msg.WarnNotify(Error);
        console.log(Error);
        this.app.stopLoaderDark();
      }
    )





  }





  /////////////////////////////// Reset Fields///////////////////////////////////////////////////
  reset() {
    this.PBarcode = '';
    this.tableDataList = [];
    this.subTotal = 0;
    this.discount = 0;
    this.netTotal = 0;
    this.totalQty = 0;
    this.rowFocused = 0;
    this.prodFocusedRow = 0;
    this.otherCharges = 0;
    this.paymentType = 'Cash';
    this.change = 0;
    this.cash = 0;
    this.bankCash = 0;
    this.customerMobileno = '';
    this.customerName = '';
    this.tempDisc = 0;
    this.tempProdRow = '';
    this.tempQty = 0;
    this.billRemarks = '';
    // this.PosFee = 0;
    this.offerDiscount = 0;
    this.tmpDiscCustomerList = [];
    this.cusDiscCode = '';
    this.cusDisc = 0;
    this.CusDiscAmount = 0;
    this.removeLocalStorage();

  }







  onQtyFocusIn(event: FocusEvent, item: any) {
    item.tmpQuantity = item.quantity;
  }

  onQtyFocusOut(event: FocusEvent, item: any) {

    if (item.multyQty > 1) return;

    var updateQty = (Number(item.quantity) * item.multyQty)


    /////////////////////////// checking whether quantity increase and trigger api
    if (updateQty > item.tmpQuantity) {

      var updatePostData = {
        InvBillNo: this.invBillNo,
        ProductID: item.productID,
        barcode: item.barcode,
        Quantity: Number(item.quantity) - (item.tmpQuantity / item.multyQty),

        UserID: this.global.getUserID(),
      }
      this.http.post(environment.mainApi + this.global.inventoryLink + 'AddSaleQuantity', updatePostData).subscribe(
        (Response: any) => {
          if (Response.msg == 'Data Updated Successfully') {
            this.getCurrentBill();
          } else {
            this.msg.WarnNotify(Response.msg);
          }
        },
        (Error: any) => {
          this.msg.WarnNotify(Error);
          this.app.stopLoaderDark();
        }
      )
    }

    /////////////////////////// checking whether quantity decrease and trigger void
    if (updateQty < item.quantity) {

      var postData = {
        InvBillNo: this.invBillNo,
        ProductID: item.productID,
        ProductTitle: item.productTitle,
        barcode: item.barcode,
        Quantity: (item.tmpQuantity / item.multyQty) - Number(item.quantity),
        CostPrice: item.costPrice,
        AvgCostPrice: item.avgCostPrice,
        SalePrice: item.salePrice,
        ReqRefNo: item.autoInvDetID,

        UserID: this.global.getUserID(),
      }
      this.http.post(environment.mainApi + this.global.inventoryLink + 'VoidProduct', postData).subscribe(
        (Response: any) => {
          if (Response.msg == 'Data Saved Successfully') {
            this.getCurrentBill();
          } else {
            this.msg.WarnNotify(Response.msg);
          }
        },
        (Error: any) => {
          this.msg.WarnNotify(Error);
          this.app.stopLoaderDark();
        }
      )

    }
  }



  /////////////////////////////// Quantity Edit Modal  ///////////////////////////////////////////////////

  openQtyModal(e: any, item: any) {

    // if (this.DisableVoidpwdFeature &&  !(item.multyQty > 1)) return;

    if (e.keyCode == 13 || e.button == 0) {
      //  $('#qtyModal').show();
      this.dialogue.open(VsenterqtyComponent, {
        width: '30%',
        data: item,
        disableClose: true,
        hasBackdrop: true,
      }).afterClosed().subscribe(qty => {

        if (qty != '') {

          this.updateQty(item, qty);
        }
        this.getTotal();

        setTimeout(() => {
          $('.qty' + this.rowFocused.toString()).trigger('focus');
        }, 500);
      })

    }
  }


  updateQty(item: any, qty: any) {

    var prevQty = item.quantity;

    var updateQty = (Number(qty) * item.multyQty)


    /////////////////////////// checking whether quantity increase and trigger api
    if (updateQty > item.quantity) {

      item.quantity = updateQty;

      // var updatePostData = {
      //   InvBillNo: this.invBillNo,
      //   ProductID: item.productID,
      //   barcode: item.barcode,
      //   Quantity: qty - (item.quantity / item.multyQty),

      //   UserID: this.global.getUserID(),
      // }
      // this.http.post(environment.mainApi + this.global.inventoryLink + 'AddSaleQuantity', updatePostData).subscribe(
      //   (Response: any) => {
      //     if (Response.msg == 'Data Updated Successfully') {
      //       this.getCurrentBill();
      //     } else {
      //       this.msg.WarnNotify(Response.msg);
      //     }
      //   },
      //   (Error: any) => {
      //     this.msg.WarnNotify(Error);
      //     this.app.stopLoaderDark();
      //   }
      // )
    }

    /////////////////////////// checking whether quantity decrease and trigger void
    if (updateQty < item.quantity) {
      var voidQty = prevQty - updateQty;
      this.pushVoidData(item, voidQty, 'VOID')
      item.quantity = updateQty;
      // var postData = {
      //   InvBillNo: this.invBillNo,
      //   ProductID: item.productID,
      //   ProductTitle: item.productTitle,
      //   barcode: item.barcode,
      //   Quantity: (item.quantity / item.multyQty) - qty,
      //   CostPrice: item.costPrice,
      //   AvgCostPrice: item.avgCostPrice,
      //   SalePrice: item.salePrice,
      //   ReqRefNo: item.autoInvDetID,

      //   UserID: this.global.getUserID(),
      // }
      // this.http.post(environment.mainApi + this.global.inventoryLink + 'VoidProduct', postData).subscribe(
      //   (Response: any) => {
      //     if (Response.msg == 'Data Saved Successfully') {
      //       this.getCurrentBill();
      //     } else {
      //       this.msg.WarnNotify(Response.msg);
      //     }
      //   },
      //   (Error: any) => {
      //     this.msg.WarnNotify(Error);
      //     this.app.stopLoaderDark();
      //   }
      // )

    }
  }



  ///////////////////////   For Voiding the product row  ///////////////////////////////////////////////////////////


  delRow(item: any) {


    if (this.invBillNo != '') {

      if (this.tableDataList.length == 1) {

        this.voidBill();
        return;
      }

      Swal.fire({
        title: 'Alert!',
        text: 'Confirm to Void Product',
        position: 'center',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm',
      }).then((result) => {

        if (result.isConfirmed) {

          if (this.DisableVoidpwdFeature) {
            // this.voidProduct(item);
            this.pushVoidData(item, item.quantity, 'VOID')
          } else {

            this.global.openPassword('Password').subscribe(pin => {
              if (pin !== '') {
                this.http.post(environment.mainApi + this.global.userLink + 'MatchPassword', {
                  RestrictionCodeID: 1,
                  Password: pin,
                  UserID: this.global.getUserID()

                }).subscribe(
                  (Response: any) => {
                    if (Response.msg == 'Password Matched Successfully') {

                      // this.voidProduct(item);
                      this.pushVoidData(item, item.quantity, 'VOID')

                    } else {
                      this.msg.WarnNotify(Response.msg);
                    }
                  }
                )
              }
            })
          }
        }
      })
    }
  }







  //////////////////////  Void Single Product  /////////////////////////////////////////////////////////

  voidProduct(item: any) {

    this.http.post(environment.mainApi + this.global.inventoryLink + 'VoidProduct', {
      InvBillNo: this.invBillNo,
      ProductID: item.productID,
      ProductTitle: item.productTitle,
      barcode: item.barcode,
      Quantity: item.quantity / item.multyQty,
      CostPrice: item.costPrice,
      AvgCostPrice: item.avgCostPrice,
      SalePrice: item.salePrice,
      ReqRefNo: item.autoInvDetID,

      UserID: this.global.getUserID(),
    }).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully') {
          if (this.tableDataList.length == 1) {
            this.reset();
          }
          this.getCurrentBill();

          $('#vssearchProduct').trigger('focus');
          $('.billArea').scrollTop(0);
        } else {
          this.msg.WarnNotify(Response.msg);
        }
        $('#vssearchProduct').trigger('focus');
      },
      (Error: any) => {
        this.msg.WarnNotify(Error);
        this.app.stopLoaderDark();
      }
    )
  }


  ///////////////////////////  Void Full Bill ///////////////////////////////////////////////////////


  voidBill() {

    if (this.tableDataList.length > 0) {

      Swal.fire({
        title: 'Alert!',
        text: 'Confirm to Void Full Bill',
        position: 'center',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm',
      }).then((result) => {

        if (result.isConfirmed) {
          if (this.DisableVoidpwdFeature) {

            this.http.post(environment.mainApi + this.global.inventoryLink + 'VoidAllProducts', {
              InvBillNo: this.invBillNo,
              SaleDetail: JSON.stringify(this.tableDataList),
              UserID: this.global.getUserID(),
            }).subscribe(
              (Response: any) => {
                if (Response.msg == 'Data Saved Successfully') {
                  this.getCurrentBill();
                  this.reset();
                  $('#vssearchProduct').trigger('focus');
                } else {
                  this.msg.WarnNotify(Response.msg);
                }

                $('#vssearchProduct').trigger('focus');
              }
            )
          } else {

            this.global.openPassword('Password').subscribe(pin => {
              if (pin !== '') {
                this.http.post(environment.mainApi + this.global.userLink + 'MatchPassword', {
                  RestrictionCodeID: 1,
                  Password: pin,
                  UserID: this.global.getUserID()

                }).subscribe(
                  (Response: any) => {
                    if (Response.msg == 'Password Matched Successfully') {

                      this.http.post(environment.mainApi + this.global.inventoryLink + 'VoidAllProducts', {
                        InvBillNo: this.invBillNo,
                        SaleDetail: JSON.stringify(this.tableDataList),
                        UserID: this.global.getUserID(),
                      }).subscribe(
                        (Response: any) => {
                          if (Response.msg == 'Data Saved Successfully') {
                            this.getCurrentBill();
                            this.reset();
                            $('#vssearchProduct').trigger('focus');
                          } else {
                            this.msg.WarnNotify(Response.msg);
                          }

                          $('#vssearchProduct').trigger('focus');
                        }
                      )

                    } else {
                      this.msg.WarnNotify(Response.msg);
                    }
                  },
                  (Error: any) => {
                    this.msg.WarnNotify(Error);
                    this.app.stopLoaderDark();
                  }
                )
              }
            })

          }
        }
      })



    }


  }




  /////////////// Print After Save Function //////////////

  PrintAfterSave(InvNo: any) {
    this.billPrint.PrintBill(InvNo);
    this.billPrint.billType = '';
  }



  ///////////// Payment Modal Setting//////////////

  openPaymentModal() {
    this.global.openBootstrapModal('#paymentMehtod', true);
    this.cash = 0;
    this.bankCash = 0;
    this.getTotal()
  }

  onPaymentModalClose() {
    this.paymentType = 'Cash';
    this.bankCoaID = 0;
    this.cash = 0;
    this.bankCash = 0
    this.partyID = 0;
  }


  /////////////////// Saved Bill Functions ///////////

  savedbillList: any = []
  getSavedBill() {


    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetOpenDaySale').subscribe(
      (Response: any) => {
        this.savedbillList = [];
        var userID: any = this.global.getUserID();
        var roleTypeId: any = this.global.getRoleTypeID();
        var projectID: any = this.global.getProjectID();

        Response.forEach((e: any) => {


          /////////////// if Feature false all Bills will Display
          if (!this.RestBillUserwise) {
            if (e.invType == 'S') {
              this.savedbillList.push(e);
            }
            return;
          }


          /////////////// Filtering Bills with UserID and ProjectID
          if (roleTypeId == 3 || roleTypeId == 2) { ///////////if Admin or User
            if (e.invType == 'S' && e.userID == userID && e.projectID == projectID) {
              this.savedbillList.push(e);
            }
          } else { /////////// if Superadmin
            if (e.invType == 'S') {
              this.savedbillList.push(e);
            }
          }

        });
      }
    )
  }

  sendToFbr(item: any) {
    this.app.startLoaderDark();
    this.http.post(environment.mainApi + this.global.inventoryLink + 'InvSendToFbr', {
      InvBillNo: item.invBillNo,
      UserID: this.global.getUserID()
    }).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Updated Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.getSavedBill();
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

  changePayment(data: any) {
    $('#SavedBillModal').hide();
    this.dialogue.open(PaymentMehtodComponent, {
      width: '30%',
      data: data
    }).afterClosed().subscribe(val => {
      this.getSavedBill();
      $('#SavedBillModal').show();
    })

  }


  postSaleBill(item: any) {
    if (!item.postedStatus) {
      this.global.postSaleInvoice(item).subscribe(
        (Response: any) => {
          if (Response.msg == 'Posted Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.getSavedBill();
          } else {
            this.msg.WarnNotify(Response.msg);
          }
        }
      );
    }

  }


  openDuplicateModal() {
    this.global.openBootstrapModal('#SavedBillModal', true);
    this.getSavedBill()
  }


  printDuplicateBill(item: any) {
    $('#SavedBillModal').hide();
    if (this.disablePrintPwd) {
      this.billPrint.PrintBill(item.invBillNo);
      this.billPrint.billType = 'Duplicate';
    } else {
      this.global.openPassword('Password').subscribe(pin => {
        if (pin !== '') {
          this.http.post(environment.mainApi + this.global.userLink + 'MatchPassword', {
            RestrictionCodeID: 5,
            Password: pin,
            UserID: this.global.getUserID()

          }).subscribe(
            (Response: any) => {
              if (Response.msg == 'Password Matched Successfully') {
                $('#SavedBillModal').show();
                this.billPrint.PrintBill(item.invBillNo);
                this.billPrint.billType = 'Duplicate';

              } else {
                this.msg.WarnNotify(Response.msg);
              }
            }
          )
        }
      })
    }



  }

  billDetails(item: any) {


    $('#SavedBillModal').hide();
    // $('#paymentMehtod').hide();
    // $('.modal-backdrop').remove();

    this.global.openPassword('Password').subscribe(pin => {
      if (pin !== '') {
        this.http.post(environment.mainApi + this.global.userLink + 'MatchPassword', {
          RestrictionCodeID: 5,
          Password: pin,
          UserID: this.global.getUserID()

        }).subscribe(
          (Response: any) => {
            if (Response.msg == 'Password Matched Successfully') {
              $('#SavedBillModal').show();
              this.dialogue.open(SaleBillDetailComponent, {
                width: '50%',
                data: item,
                disableClose: true,
              }).afterClosed().subscribe(value => {

              })
            } else {
              this.msg.WarnNotify(Response.msg);
            }
          }
        )
      }
    })


  }


  removeLocalStorage() {
    localStorage.removeItem('tmpVbl2SaleData');
    localStorage.removeItem('tmpVbl2VoidData');
    localStorage.removeItem('tmpVbl2ProjectID');

    localStorage.removeItem('tmpVbl2InvoiceDate');
    localStorage.removeItem('tmpVbl2PartyID');
    localStorage.removeItem('tmpVbl2Remarks');

    localStorage.removeItem('tmpVbl2BookerID');

    localStorage.removeItem('tmpVbl2Discount');

  }


  insertToLocalStorage() {
    this.removeLocalStorage();

    var prodData = JSON.stringify(this.tableDataList);
    localStorage.setItem('tmpVbl2SaleData', prodData);
    var voidData = JSON.stringify(this.voidDataList);
    localStorage.setItem('tmpVbl2VoidData', voidData);


    var projectID = JSON.stringify(this.projectID);
    localStorage.setItem('tmpVbl2ProjectID', projectID);

    var date = JSON.stringify(this.InvDate);
    localStorage.setItem('tmpVbl2InvoiceDate', date);



    var partyID = JSON.stringify(this.partyID);
    localStorage.setItem('tmpVbl2PartyID', partyID);

    var remarks = JSON.stringify(this.billRemarks ? this.billRemarks : '-');
    localStorage.setItem('tmpVbl2Remarks', remarks);

    var bookerID = JSON.stringify(this.bookerID);
    localStorage.setItem('tmpVbl2BookerID', bookerID);


    var discount = JSON.stringify(this.discount);
    localStorage.setItem('tmpVbl2Discount', discount);




  }

  importFromLocalStorage() {

    var data = JSON.parse(localStorage.getItem('tmpVbl2SaleData') || '[]');



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

    this.billRemarks = JSON.parse(localStorage.getItem('tmpVbl2Remarks') || '');
    this.partyID = JSON.parse(localStorage.getItem('tmpVbl2PartyID') || '0');

    var tmpDate: any = JSON.parse(localStorage.getItem('tmpVbl2InvoiceDate') || '');
    this.InvDate = new Date(tmpDate ? tmpDate : new Date());

    this.projectID = JSON.parse(localStorage.getItem('tmpVbl2ProjectID') || '0');
    this.bookerID = JSON.parse(localStorage.getItem('tmpVbl2BookerID') || '0');
    this.discount = JSON.parse(localStorage.getItem('tmpVbl2Discount') || '0');
    this.tableDataList = data;
    this.getTotal();

  }





}

