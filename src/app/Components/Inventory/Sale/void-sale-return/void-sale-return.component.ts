import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';

import * as $ from 'jquery';

import { Observable, retry } from 'rxjs';
import { VrtnenterqtyComponent } from './vrtnenterqty/vrtnenterqty.component';
import { VrtnsavedbillComponent } from './vrtnsavedbill/vrtnsavedbill.component';
import { SaleBillPrintComponent } from '../SaleComFiles/sale-bill-print/sale-bill-print.component';
import { PaymentMehtodComponent } from '../SaleComFiles/payment-mehtod/payment-mehtod.component';
import { SaleBillDetailComponent } from 'src/app/Components/Restaurant-Core/Sales/sale1/sale-bill-detail/sale-bill-detail.component';
import { VsenterqtyComponent } from '../void-sale/vsenterqty/vsenterqty.component';

@Component({
  selector: 'app-void-sale-return',
  templateUrl: './void-sale-return.component.html',
  styleUrls: ['./void-sale-return.component.scss']
})
export class VoidSaleReturnComponent implements OnInit {


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


  @ViewChild(SaleBillPrintComponent) billPrint: any;

  ////////////////// will give the current tab visible status

  @HostListener('document:visibilitychange', ['$event'])

  appVisibility() {
    if (document.hidden) {

    }
    else {
      this.getCurrentBill();

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
    private route: Router
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
    this.global.setHeaderTitle('Sale Return');
    this.getBankList();
    this.getCurrentBill();
    this.getPartyList();
    this.getBooker();
    setTimeout(() => {
      $('#vssearchProduct').trigger('select');
      $('#vssearchProduct').trigger('focus');
    }, 200);

    this.global.getProducts().subscribe(
      (data: any) => { this.productList = data; })
  }



  byNameSearch: any = false;

  billRemarks = '';

  productList: any = [];
  bankCoaList: any = [];
  projectID = this.global.getProjectID();
  InvDate = new Date();
  PBarcode: any = '';
  tableDataList: any = [];
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
  PosFee = 0;

  tempProdData: any = [];


  tmpCash = 0;
  tmpChange = 0;



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






  ///////////////////////////////  Search Product By Name///////////////////////////////////////////////////
  holdDataFunction(data: any) {
    this.insertProductData(data.productID, '', 0);
  }





  ///////////////////////////////  Search Product By Barcode///////////////////////////////////////////////////
  searchByCode(e: any) {
    if (this.PBarcode !== '') {
      if (e.keyCode == 13) {
        this.insertProductData(0, this.PBarcode);
      }
    }
  }





  ///////////////////////////////  Send Product to To API and Recall get Funciton///////////////////////////////////////////////////

  insertProductData(productID = 0, barcode = '', PartyID = 0) {

    var postData = {
      PartyID: 0,
      ProductID: productID,
      Barcode: barcode,
      UserID: this.global.getUserID()
    }
    this.http.post(environment.mainApi + this.global.inventoryLink + 'AddSaleProduct', postData).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully') {
          this.getCurrentBill();
        } else {
          this.msg.WarnNotify(Response.msg);
        }
      },
      (Error: any) => {
        console.log(Error);
      }
    )


    $('.billArea').scrollTop(0);
    this.PBarcode = '';
    $('#vssearchProduct').trigger('focus');
    this.getTotal();

  }



  //////////////////////////  Get Current Bill Data for which Products are Scanning//////////////////////////////////
  // //////////////////////
  getCurrentBill() {


    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSaleExistingBill?reqUserID=' + this.global.getUserID()).subscribe(
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
              quantity: e.quantity * e.packing,
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
              discInP: e.discInP,
              discInR: e.discInR / e.packing,
              aq: e.aq,
              autoInvDetID: e.autoInvDetID,
              gstAmount: e.gstAmount,
              gstValue: e.gstValue,
              gst: this.gstFeature ? e.gst : 0,

            })
          });

          this.productImage = Response[0].productImage;

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

    this.tableDataList.forEach((e: any) => {
      // if (this.billDiscount > 0) {
      //   e.discInP = this.billDiscount;
      //   e.discInR = (e.salePrice * this.billDiscount) / 100
      // }
      e.total = ((parseFloat(e.salePrice) - parseFloat(e.discInR)) * parseFloat(e.quantity));
      this.qtyTotal += parseFloat(e.quantity);
      this.subTotal += parseFloat(e.quantity) * parseFloat(e.salePrice);
      this.offerDiscount += parseFloat(e.discInR) * parseFloat(e.quantity);

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

    this.netTotal = this.subTotal - parseFloat(this.discount) - parseFloat(this.offerDiscount);

    if (this.paymentType == 'Split') {
      this.bankCash = this.netTotal - parseFloat(this.cash);
    }
    if (this.paymentType == 'Bank') {
      this.bankCash = this.netTotal;
    }



    if (this.paymentType !== 'Credit') {
      this.partyID = 0;
    }

    this.change = (parseFloat(this.cash) + parseFloat(this.bankCash)) - this.netTotal;


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
        $(clsName).trigger('focus');
      }
    }

    // Delete row
    if (e.key === 'Delete') {
      this.delRow(item);
      this.rowFocused = 0;
    }
  }





  ///////////////////////   For Voiding the product row  ///////////////////////////////////////////////////////////


  delRow(item: any) {


    if (this.invBillNo != '') {
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
          this.global.openPassword('Password').subscribe(pin => {
            if (pin !== '') {
              this.http.post(environment.mainApi + this.global.userLink + 'MatchPassword', {
                RestrictionCodeID: 1,
                Password: pin,
                UserID: this.global.getUserID()

              }).subscribe(
                (Response: any) => {
                  if (Response.msg == 'Password Matched Successfully') {
                    this.voidProduct(item);
                  } else {
                    this.msg.WarnNotify(Response.msg);
                  }
                }
              )



            }
          })
        }


      })
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



  ///////////////////////////// For Image Modal View /////////////////////////////////////////////////////

  showImg(item: any) {

    var index = this.tableDataList.findIndex((e: any) => e.productID == item.productID);
    this.productImage = this.tableDataList[index].productImage;

  }

  //////////////////////////////// Sale Insert Function //////////////////////////////////////////////////
  isValidSale = true;
  save(paymentType: any, SendToFbr: any) {

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
      InvType: "SR",
      ProjectID: this.projectID,
      BookerID: 0,
      PaymentType: paymentType,
      Remarks: this.billRemarks || '-',
      OrderType: "Take Away",
      BillTotal: this.subTotal,
      BillDiscount: Number(this.discount) + Number(this.offerDiscount),
      OtherCharges: this.otherCharges,
      NetTotal: this.netTotal,
      CashRec: this.cash,
      Change: this.change,
      BankCoaID: this.bankCoaID,
      BankCash: this.bankCash,
      CusContactNo: this.customerMobileno || '-',
      CusName: this.customerName || '-',
      SaleDetail: JSON.stringify(this.tableDataList),
      UserID: this.global.getUserID()
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
    

    if (this.isValidSale) {
      this.app.startLoaderDark();
      this.isValidSale = false;
      this.http.post(environment.mainApi + this.global.inventoryLink + 'InsertVoidableSaleRtn', postData).subscribe(
        (Response: any) => {
          if (Response.msg == 'Data Saved Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.tmpCash = this.cash;
            this.tmpChange = this.change;
            this.PrintAfterSave(Response.invNo);
            this.getCurrentBill();
            this.reset();
            $('#vssearchProduct').trigger('focus');  /// setting focus to prodsearch field
            this.global.closeBootstrapModal('#paymentMehtod', true);     //// hiding payment Mehtod Modal window
          } else {
            this.msg.WarnNotify(Response.msg);
          }
          this.app.stopLoaderDark();
          this.isValidSale = true;
        },
        (Error: any) => {
          this.isValidSale = true;
          this.msg.WarnNotify(Error);
          console.log(Error);
          this.app.stopLoaderDark();
        }
      )
    }




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
    this.PosFee = 0;
    this.offerDiscount = 0;

  }





  /////////////////////////////// Quantity Edit Modal  ///////////////////////////////////////////////////


  openQtyModal(e: any, item: any) {
    if (e.keyCode == 13 || e.button == 0) {
      //  $('#qtyModal').show();
      this.dialogue.open(VsenterqtyComponent, {
        width: '30%',
        data: item,
        disableClose: true,
        hasBackdrop: true,
      }).afterClosed().subscribe(qty => {

        if (qty != '') {

          var updateQty = (Number(qty) * item.packing)
          /////////////////////////// checking whether quantity increase and trigger api
          if (updateQty > item.quantity) {

            var updatePostData = {
              InvBillNo: this.invBillNo,
              ProductID: item.productID,
              barcode: item.barcode,
              Quantity: qty - (item.quantity / item.packing),

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
              Quantity: (item.quantity / item.packing) - qty,
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

        setTimeout(() => {
          $('.qty' + this.rowFocused.toString()).trigger('focus');
        }, 500);
      })

    }
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


      })
    }


  }





  //////////////////////  Void Single Product  /////////////////////////////////////////////////////////

  voidProduct(item: any) {

    this.http.post(environment.mainApi + this.global.inventoryLink + 'VoidProduct', {
      InvBillNo: this.invBillNo,
      ProductID: item.productID,
      ProductTitle: item.productTitle,
      Quantity: item.quantity / item.packing,
      barcode: item.barcode,
      CostPrice: item.costPrice,
      AvgCostPrice: item.avgCostPrice,
      SalePrice: item.salePrice,
      ReqRefNo: item.autoInvDetID,

      UserID: this.global.getUserID(),
    }).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully') {
          if (this.tableDataList.length == 1) {
            this.reset()
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
        Response.forEach((e: any) => {
          if (e.invType == 'SR') {
            this.savedbillList.push(e);
          }
        });
      }
    )
  }

  sendToFbr(item: any) {
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
                // setTimeout(() => {
                //   this.global.printData('#print-bill')
                // }, 200);



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




}
