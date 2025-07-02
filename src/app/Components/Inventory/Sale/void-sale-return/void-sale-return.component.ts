import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-void-sale-return',
  templateUrl: './void-sale-return.component.html',
  styleUrls: ['./void-sale-return.component.scss']
})
export class VoidSaleReturnComponent implements OnInit {

  disableDate = this.global.DisableDateSale;

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



    ///////////// will Check day is opened or not


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
    $('#vsrtnsearchProduct').trigger('focus');

    this.global.getProducts().subscribe(
      (data: any) => { this.productList = data; })

  }


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


  invBillNo = '';








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


    $('.rtnBillArea').scrollTop(0);
    this.PBarcode = '';
    $('#vsrtnsearchProduct').trigger('focus');
    this.getTotal();

  }





  //////////////////////////  Get Current Bill Data for which Products are Scanning//////////////////////////////////
  // //////////////////////
  getCurrentBill() {

    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSaleExistingBill?reqUserID=' + this.global.getUserID()).subscribe(
      (Response: any) => {
        this.tableDataList = [];
        if (Response != '') {
          this.invBillNo = Response[0].invBillNo;
        }

        Response.forEach((e: any) => {
          this.tableDataList.push({
            productID: e.productID,
            productTitle: e.productTitle,
            barcode: e.barcode,
            productImage: e.productImage,
            quantity: e.quantity,
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
            packing: 1,
            discInP: 0,
            discInR: 0,
            aq: e.aq,
            autoInvDetID: e.autoInvDetID,

          })
        });

        if (Response != '') {
          this.productImage = Response[0].productImage;
        }
        this.getTotal();


      }
    )
  }





  //////////////////////////////  For Getting Totals of All whole Bill ////////////////////////////////////////////////////

  getTotal() {
    // alert();
    this.subTotal = 0;
    this.totalQty = 0;
    this.netTotal = 0;
    for (var i = 0; i < this.tableDataList.length; i++) {

      this.subTotal += (parseFloat(this.tableDataList[i].quantity) * parseFloat(this.tableDataList[i].salePrice));
      this.totalQty += parseFloat(this.tableDataList[i].quantity);

    }

    if (this.discount == '') {
      this.discount = 0;
    }
    if (this.otherCharges == 0) {
      this.otherCharges = 0;
    }
    if (this.cash == '') {
      this.cash = 0;
    }


    this.netTotal = (this.subTotal + parseFloat(this.otherCharges)) - parseFloat(this.discount);
    this.change = (parseFloat(this.cash) + parseFloat(this.bankCash)) - this.netTotal;
  }






  ///////////////////////////////// Handle Product Qty focusing on key up and down  /////////////////////////////////////////////////

  rowFocused = -1;
  prodFocusedRow = 0;

  handleProdFocus(item: any, e: any, cls: any, endFocus: any, prodList: []) {

    if (e.keyCode == 9 && !e.shiftKey) {
      this.prodFocusedRow += 1;

    }
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
          //  e.which = 9;   
          //  $(clsName).trigger(e)       
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

  focusTo(e: any, cls: string) {
    if (cls == '#disc' && e.keyCode == 13 && e.target.value == '') {
      e.preventDefault();
      $(cls).trigger('select');
      $(cls).trigger('focus');
    }
    if (cls == '#charges' && e.keyCode == 13) {
      e.preventDefault();
      $(cls).trigger('select');
      $(cls).trigger('focus');
    }
    if (cls == '#cash' && e.keyCode == 13) {
      e.preventDefault();
      $(cls).trigger('select');
      $(cls).trigger('focus');

    }

    if (cls == '#save' && e.keyCode == 13) {
      e.preventDefault();
      // $(cls).trigger('select');
      $(cls).trigger('focus');
    }

    if (cls == '#vsrtnsearchProduct' && e.keyCode == 13) {
      e.preventDefault();
      $(cls).trigger('select');
      $(cls).trigger('focus');
    }

  }


  //////////////// Handling Searched Product List Qty up down focus on keyup down//////////////////

   handleNumKeys(item: any, e: KeyboardEvent, cls: string, index: number) {
  const allowedKeys = [
    'Enter', 'Backspace', 'Tab', 'Shift', 'Delete', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', '.',
    '0','1','2','3','4','5','6','7','8','9'
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


  //////////////////////////////////////////////////////////////////////////////////


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
                },
                (Error: any) => {
                  this.msg.WarnNotify(Error);

                }
              )



            }
          })
        }


      })
    }





  }


  //////////////////////////////////////////////////////////////////////////////////




  //////////////////////////////////////////////////////////////////////////////////

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

  //////////////////////////////////////////////////////////////////////////////////

  showImg(item: any) {

    var index = this.tableDataList.findIndex((e: any) => e.productID == item.productID);
    this.productImage = this.tableDataList[index].productImage;

  }

  //////////////////////////////////////////////////////////////////////////////////

  save() {

    if (this.tableDataList == '') {
      this.msg.WarnNotify('Select Product');
    } if (this.paymentType == 'Cash' && (this.cash == 0 || this.cash == undefined || this.cash == null)) {
      this.msg.WarnNotify('Enter Cash')
    } else if (this.paymentType == 'Cash' && this.cash < this.netTotal) {
      this.msg.WarnNotify('Entered Cash is not Valid')
    } else if (this.paymentType == 'Split' && ((this.cash + this.bankCash) > this.netTotal || (this.cash + this.bankCash) < this.netTotal)) {
      this.msg.WarnNotify('Amount in Not Valid')
    } else if (this.paymentType == 'Bank' && (this.bankCash < this.netTotal) || (this.bankCash > this.netTotal)) {
      this.msg.WarnNotify('Enter Valid Amount')
    } else if (this.customerName == '' && this.customerMobileno != '') {
      this.msg.WarnNotify('Enter Customer Name')
    } else if (this.customerName != '' && this.customerMobileno == '') {
      this.msg.WarnNotify('Enter Customer Mobile')
    } else {
      this.app.startLoaderDark();
      this.http.post(environment.mainApi + this.global.inventoryLink + 'InsertVoidableSaleRtn', {
        HoldInvNo: this.invBillNo,
        InvDate: this.global.dateFormater(this.InvDate, '-'),
        PartyID: 0,
        InvType: "SR",
        ProjectID: this.projectID,
        BookerID: 0,
        PaymentType: this.paymentType,
        Remarks: this.billRemarks,
        OrderType: "Take Away",
        BillTotal: this.subTotal,
        BillDiscount: this.discount,
        OtherCharges: this.otherCharges,
        NetTotal: this.netTotal,
        CashRec: this.cash,
        Change: this.change,
        BankCoaID: this.bankCoaID,
        BankCash: this.bankCash,
        CusContactNo: this.customerMobileno,
        CusName: this.customerName,
        SaleDetail: JSON.stringify(this.tableDataList),
        UserID: this.global.getUserID()
      }).subscribe(
        (Response: any) => {
          if (Response.msg == 'Data Saved Successfully') {
            this.msg.SuccessNotify(Response.msg);

            this.PrintAfterSave(Response.invNo);
            this.getCurrentBill();
            this.reset();
            $('#vssearchProduct').trigger('focus');
          } else {
            this.msg.WarnNotify(Response.msg);
          }
          this.app.stopLoaderDark();
        },
        (Error: any) => {
          this.msg.WarnNotify(Error);
          this.app.stopLoaderDark();
        }
      )
    }



  }

  //////////////////////////////////////////////////////////////////////////////////


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
    this.billRemarks = '';

  }


  //////////////////////////////////////////////////////////////////////////////////



  openQtyModal(e: any, item: any) {
    if (e.keyCode == 13 || e.button == 0) {
      //  $('#qtyModal').show();
      this.dialogue.open(VrtnenterqtyComponent, {
        width: '20%',
        data: item.quantity,
        disableClose: true,
        hasBackdrop: true,
      }).afterClosed().subscribe(qty => {
        setTimeout(() => {
          $('.qty' + this.rowFocused.toString()).trigger('focus');
        }, 500);
        if (qty != '') {
          /////////////////////////// checking whether quantity increase and trigger api
          if (qty > item.quantity) {
            this.http.post(environment.mainApi + this.global.inventoryLink + 'AddSaleQuantity', {
              InvBillNo: this.invBillNo,
              ProductID: item.productID,
              Quantity: qty - item.quantity,

              UserID: this.global.getUserID(),
            }).subscribe(
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
          if (qty < item.quantity) {
            this.http.post(environment.mainApi + this.global.inventoryLink + 'VoidProduct', {
              InvBillNo: this.invBillNo,
              ProductID: item.productID,
              ProductTitle: item.productTitle,
              Quantity: item.quantity - qty,
              CostPrice: item.costPrice,
              AvgCostPrice: item.avgCostPrice,
              SalePrice: item.salePrice,
              ReqRefNo: item.autoInvDetID,

              UserID: this.global.getUserID(),
            }).subscribe(
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
      })

    }
  }


  //////////////////////////////////////////////////////////////////////////////////


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
                    this.app.startLoaderDark();
                    this.http.post(environment.mainApi + this.global.inventoryLink + 'VoidAllProducts', {
                      InvBillNo: this.invBillNo,
                      SaleDetail: JSON.stringify(this.tableDataList),
                      UserID: this.global.getUserID(),
                    }).subscribe(
                      (Response: any) => {
                        if (Response.msg == 'Data Saved Successfully') {
                          this.getCurrentBill();
                          $(".searchProduct").trigger('focus');
                        } else {
                          this.msg.WarnNotify(Response.msg);
                        }
                        this.app.stopLoaderDark();
                      }
                    )

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

  ///////////////////////////////////////////////////////////////////////////////

  voidProduct(item: any) {

    this.app.startLoaderDark();
    this.http.post(environment.mainApi + this.global.inventoryLink + 'VoidProduct', {
      InvBillNo: this.invBillNo,
      ProductID: item.productID,
      ProductTitle: item.productTitle,
      Quantity: item.quantity,
      CostPrice: item.costPrice,
      AvgCostPrice: item.avgCostPrice,
      SalePrice: item.salePrice,
      ReqRefNo: item.autoInvDetID,

      UserID: this.global.getUserID(),
    }).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully') {
          this.getCurrentBill();
          $(".searchProduct").trigger('focus');
          $('.rtnBillArea').scrollTop(0);
        } else {
          this.msg.WarnNotify(Response.msg);
        }
        this.app.stopLoaderDark();
      }
    )
  }


  openSavedBill() {
    this.dialogue.open(VrtnsavedbillComponent, {
      width: '60%',
    }).afterClosed().subscribe(

    )
  }




  savedbillList: any = [];



  myPrintData: any = [];
  myInvoiceNo = '';
  mytableNo = '';
  myCounterName = '';
  myInvDate: any = new Date();
  myOrderType = '';
  mySubTotal = 0;
  myNetTotal = 0;
  myOtherCharges = 0;
  myRemarks = '';
  myDiscount = 0;
  myCash = 0;
  myChange = 0;
  myBank = 0;
  myPaymentType = '';
  myDuplicateFlag = false;
  myTime: any;

  PrintAfterSave(InvNo: any) {



    this.http.get(environment.mainApi + this.global.inventoryLink + 'PrintBill?BillNo=' + InvNo).subscribe(
      (Response: any) => {
        this.myInvoiceNo = InvNo;
        this.myInvDate = Response[0].createdOn;
        this.myCounterName = Response[0].entryUser;
        this.mySubTotal = Response[0].billTotal;
        this.myNetTotal = Response[0].netTotal;
        this.myOtherCharges = Response[0].otherCharges;
        this.myRemarks = Response[0].remarks;
        this.myCash = Response[0].cashRec;
        this.myBank = Response[0].netTotal - Response[0].cashRec;
        this.myDiscount = Response[0].billDiscount;
        this.myChange = Response[0].change;
        this.myPaymentType = Response[0].paymentType;

        this.myPrintData = Response;
        setTimeout(() => {
          this.global.printData('#printBill');
        }, 500);
      }
    )



  }


}
