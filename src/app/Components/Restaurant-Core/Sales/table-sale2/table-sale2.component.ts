import { HttpClient } from '@angular/common/http';
import { Component, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

import Swal from 'sweetalert2';
import { RestKotPrintComponent } from '../SaleCommonComponent/rest-kot-print/rest-kot-print.component';
import { RestSaleBillPrintComponent } from '../SaleCommonComponent/rest-sale-bill-print/rest-sale-bill-print.component';
import { exec } from 'child_process';
import * as bootstrap from 'bootstrap';
import { SaleBillDetailComponent } from '../sale1/sale-bill-detail/sale-bill-detail.component';
import * as $ from 'jquery';

@Component({
  selector: 'app-table-sale2',
  templateUrl: './table-sale2.component.html',
  styleUrls: ['./table-sale2.component.scss']
})
export class TableSale2Component implements OnInit {
  @HostListener('document:visibilitychange', ['$event'])

  @ViewChild(RestSaleBillPrintComponent) billPrint: any;
  @ViewChild(RestKotPrintComponent) KotPrint: any;

  showCmpNameFeature: any = this.global.showCmpNameFeature;
  waiterFeature = this.global.waiterFeature;
  FBRFeature = this.global.FBRFeature;
  coverOfFeature = this.global.coverOfFeature;
  appVisibility() {
    if (document.hidden) {

    }
    else {
      this.getHoldBills();

    }
  }

  holdbtnType = 'hold';

  crudList: any = [];
  companyProfile: any = [];
  companyLogo: any = '';
  logoHeight: any = 100;
  logoWidth: any = 100;
  companyAddress: any = '';
  CompanyMobile: any = '';
  companyName: any = '';

  mobileMask = this.global.mobileMask;

  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    public global: GlobalDataModule,
    private dialogue: MatDialog,
    private route: Router
  ) {

    // function getPCName(): Promise<string> {
    //   return new Promise((resolve, reject) => {
    //     const exec = require('child_process').exec;
    //     exec('hostname', (error:any, stdout:any, stderr:any) => {
    //       if (error) {
    //         reject(error);
    //       } else {
    //         resolve(stdout.trim());
    //       }
    //     });
    //   });
    // }

    // getPCName().then((pcName) => {
    //   console.log('PC Name:', pcName);
    // }).catch((error) => {
    //   console.error('Error getting PC name:', error);
    // });



    this.global.getCompany().subscribe((data) => {
      this.companyProfile = data;
      this.companyLogo = data[0].companyLogo1;
      this.CompanyMobile = data[0].companyMobile;
      this.companyAddress = data[0].companyAddress;
      this.companyName = data[0].companyName;
      this.logoHeight = data[0].logo1Height;
      this.logoWidth = data[0].logo1Width;
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })


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
    this.global.setHeaderTitle('Sale');
    this.getCategories();
    this.getTable();
    this.getHoldBills();
    this.getBankList();
    this.getSavedBill();
    this.getBookerList();
    
  }





  orderTypeList: any = [
    { val: 'Dine In', title: 'Dine In' },
    // { val: 'Take Away', title: 'Take Away' },
    // { val: 'Home Delivery', title: 'Home Delivery' },
  ]

  categoriesList: any = [];
  tmpInvBillNO = '';
  serviceCharges = this.global.RestServiceCharges;
  bankCoaID = 0;
  OtherCharges: any = 0;
  billDiscount: any = 0;
  invBillNo = '';
  prevTableID = 0;
  orderNo = 0;
  coverOf: any = 0;
  billRemarks = '';
  BookerID = 0;
  ProjectID = this.global.getProjectID();
  PartyID = 0;
  invoiceDate: Date = new Date();
  categoryID: any = 0;
  orderType = '';
  paymentType = 'Cash';
  cash: any = 0;
  bankCash: any = 0;
  change = 0;
  bankCoaList: any = [];
  gstValue = 0;
  GstAmount = 0;

  tableID = 0;
  tempTableID = 0;
  tempOrderType = 'Dine In';
  tableTitle: any = '';

  customerName = '';
  customerMobileno = '';
  invDocument: any = '';


  tempProdRow: any = [];
  tempQty = 1;
  tempIndex: any;

  tableData: any = [];
  subTotal: number = 0;
  netTotal = 0;
  tempRecipeList: any = [];
  RecipeList: any = [];
  holdBillList: any = [];

  tableList: any = [];
  bookerList: any = [];


  //////For Temp Use///////////
  discPer = 0;
  discAmount = 0;

  getBookerList(){

    this.global.getBookerList().subscribe((data: any) => { this.bookerList = data; });
}


  focusTo(id: any) {
    setTimeout(() => {
      $(id).trigger('focus');
    }, 500);
  }

  ////////////////////////////////////////////////////////////

  getTable() {
    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetTable').subscribe(
      (Response: any) => {
        this.tableList = Response;
      }
    )
  }

  ////////////////////////////////////////////////////////////

  onOrderTypeSelected(type: any) {

    if (type !== 'Dine In') {
      this.tempTableID = 0;
      this.coverOf = 0;
    }

  }

  //////////////////////////////////////////////////////////////

  selectT() {

    if (this.tempOrderType == 'Dine In' && (this.tempTableID == 0 || this.tempTableID == undefined)) {
      this.msg.WarnNotify('Select Table')
    } else if (this.tempOrderType == '' || this.tempOrderType == undefined || this.tempOrderType == null) {
      this.msg.WarnNotify('Select Order Type')
    } 
    else if (this.tempOrderType == 'Dine In' && this.coverOfFeature && (this.coverOf == '' || this.coverOf == 0 || this.coverOf == undefined)) {
      this.msg.WarnNotify('Enter Cover oF')
    }
    else if (this.BookerID == 0 && this.waiterFeature) {
      this.msg.WarnNotify('Select Waiter')
    } else {
      
      if(!this.coverOfFeature){
        this.coverOf = 0;
      }


      if (this.tempOrderType !== 'Dine In') {
        this.tempTableID = 0;
        this.coverOf = 0;
      }


      this.tableID = this.tempTableID;
      if (this.tempOrderType == 'Dine In') {
        this.tableTitle = this.tableList.find((e: any) => e.tableID == this.tableID).tableTitle;
      }
      this.orderType = this.tempOrderType;

      this.global.closeBootstrapModal('#NewBill',true);




    }


  }


  ////////////////////////////////////////////
  getBankList() {

    this.global.getBankList().subscribe((data: any) => {
       this.bankCoaList = data; 
       setTimeout(() => {
        this.bankCoaID = data[0].coaID;
      }, 200);});
}

  ///////////////////////////////////////////////////////////

  getRecipeList(item: any) {
    // alert(item.recipeCatID);
    this.categoryID = item.recipeCatID;
    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetAllRecipesCatWise?CatID=' + this.categoryID + '&reqFlag=' + item.prodFlag).subscribe(
      (Response: any) => {
        this.tempRecipeList = Response;
        this.RecipeList = Response;

      }
    )

  }

  OnCatChange(item:any){
    this.categoryID = item.recipeCatID;
    if(item.recipeCatID > 0){
      this.RecipeList = this.tempRecipeList.filter((e:any)=> e.recipeCatID == item.recipeCatID);
    }else{
      this.RecipeList = this.tempRecipeList;
    }
   
  }


  //////////////////////////////////////////////////////////

  getCategories() {
    this.app.startLoaderDark();
    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetRecipeCategories').subscribe(
      (Response: any) => {
        this.categoriesList = Response;
        // this.categoryID = this.categoriesList[0].recipeCatID;


        if (Response != '' && Response != null) {
          this.getRecipeList({ recipeCatID: 0, prodFlag: false });
        }

        this.app.stopLoaderDark();
      },
      (Error: any) => {
        this.app.stopLoaderDark();
      }
    )
  }





  ///////////////////////////////////////////////////////////////
  getTotal() {
    this.subTotal = 0;
    this.tableData.forEach((e: any) => {
      this.subTotal += e.salePrice * e.quantity;
    });
    if (this.OtherCharges == '' || this.OtherCharges == undefined) {
      this.OtherCharges = 0;
    }
    if (this.billDiscount == '' || this.billDiscount == undefined) {
      this.billDiscount = 0;
    }
    if (this.orderType == 'Dine In') {
      this.OtherCharges = 0;
      if(this.global.validCharges(this.subTotal)){
        this.OtherCharges = this.subTotal * (this.serviceCharges / 100);
      }
    }

    this.netTotal = (this.subTotal + parseFloat(this.OtherCharges)) - parseFloat(this.billDiscount);

    if (this.paymentType == 'Split') {
      this.bankCash = (this.netTotal + this.GstAmount) - parseFloat(this.cash);
    }
    if (this.paymentType == 'Bank') {
      this.bankCash = this.netTotal + this.GstAmount;
    }
    this.change = (parseFloat(this.cash) + parseFloat(this.bankCash)) - (this.netTotal + this.GstAmount);
  }


  ///////////////////////////////////////////////////////////////

  productSelected(item: any, qty: any) {
    
    if (this.orderType == '') {
      this.msg.WarnNotify('Select The Order type')
    } else if (this.tableID == 0 && this.orderType == 'Dine In') {
      this.msg.WarnNotify('Table Number Must be Selected');
    } else if (qty <= 0) {
      this.msg.WarnNotify('Enter Valid Quantity')
    } else {
      var index = this.tableData.findIndex((e: any) => e.recipeID == item.recipeID && e.entryType == 'New');

      if (index >= 0 ) {
        this.tableData[index].quantity += 1;
      }else{
        this.tableData.push({
          productID: item.productID,
          productTitle: item.recipeTitle,
          quantity: qty,
          costPrice: item.recipeCostPrice,
          avgCostPrice: item.avgCostPrice,
          salePrice: item.recipeSalePrice,
          recipeID: item.recipeID,
          cookingAriaID: item.cookingAriaID,
          cookingTime: item.cookingTime,
          requestType: 'Order',
          entryType: 'New',
          autoInvDetID: 0,
        });
      }

     
      // this.tableData.push({recipeID:item.recipeID,recipeTitle:item.recipeTitle,quantity:qty,recipeSalePrice:item.recipeSalePrice});

      // }
      this.getTotal();
    }
    this.tempProdRow = [];
    this.tempQty = 1;

    this.closeQtyModal();

    // $('#recSearch').trigger('focus');
    // $('#recSearch').val('');
  }




  onDocSelected(event: any) {


    if (this.global.getExtension(event.target.value) == 'pdf') {
      let targetEvent = event.target;

      let file: File = targetEvent.files[0];

      let fileReader: FileReader = new FileReader();


      fileReader.onload = (e) => {
        this.invDocument = fileReader.result;
      }

      fileReader.readAsDataURL(file);

    } else {
      this.msg.WarnNotify('File Must Be pdf Only');
      event.target.value = '';
      this.invDocument = '';
    }
  }


  /////////////////////////////////////////////////////////////////

  generateGst(){
    if(this.FBRFeature &&  (this.paymentType == 'Cash' || this.paymentType == 'Split')){
      this.gstValue = this.global.ResCashGst;
      this.GstAmount = (this.subTotal * this.gstValue) / 100;
    }
    if(this.FBRFeature && this.paymentType == 'Bank'){
      this.gstValue = this.global.ResCardGst;
      this.GstAmount = (this.subTotal * this.gstValue) / 100;
    }
  }

  save(type: any) {

 

    if (this.orderType == 'Dine In' && (this.tableID == 0 || this.tableID == undefined)) {
      this.msg.WarnNotify('Select Table')
    } else if (this.orderType == '' || this.orderType == undefined) {
      this.msg.WarnNotify('Select Order Type')
    }else if (type == 'sale' && (this.paymentType == '' || this.paymentType == undefined)) {
      this.msg.WarnNotify('Select Payment Type')
    }
     else if (this.tableData == '' || this.tableData == undefined) {
      this.msg.WarnNotify('One Product must be Entered')
    } else if (type == 'sale' && this.paymentType == 'Split' && ((this.cash + this.bankCash) > (this.netTotal+this.GstAmount) || (this.cash + this.bankCash) < this.netTotal)) {
      this.msg.WarnNotify('Amount in Not Valid');
    } else if (type == 'sale' && this.paymentType == 'Cash' && (this.cash < (this.netTotal+this.GstAmount))) {
      this.msg.WarnNotify('Enter Valid Amount')
    } else if (type == 'sale' && this.paymentType == 'Bank' && (this.bankCash < (this.netTotal+this.GstAmount))) {
      this.msg.WarnNotify('Enter Valid Amount')
    } else if (type == 'sale' && (this.customerName == '' && this.customerMobileno != '')) {
      this.msg.WarnNotify('Enter Customer Name')
    } else if (type == 'sale' && this.paymentType == 'Split' && this.cash <= 0) {
      this.msg.WarnNotify('Cash Amount is Not Valid')
    } else if (type == 'sale' && this.paymentType == 'Split' && this.bankCash <= 0) {
      this.msg.WarnNotify('Bank Amount is Not Valid')
    } else if (type == 'sale' && (this.customerName != '' && this.customerMobileno == '')) {
      this.msg.WarnNotify('Enter Customer Name')
    } else if ((this.BookerID == 0 || this.BookerID == undefined) && this.waiterFeature == true) {
      this.msg.WarnNotify('Select Waiter')
    }
    else {

      if (this.billDiscount == '' || this.billDiscount == undefined || this.billDiscount == null) {
        this.billDiscount = 0;
      }

      if (this.OtherCharges == '' || this.OtherCharges == undefined || this.OtherCharges == null) {
        this.OtherCharges = 0;
      }

      if(this.global.SubscriptionExpired()){
        Swal.fire({
          title: 'Alert!',
          text: 'Subscription Expired Today',
          position: 'center',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK',
        });
        return;
      }
      if (type == 'hold') {
        this.app.startLoaderDark()
        this.http.post(environment.mainApi + this.global.restaurentLink + 'InsertHold', {
          InvDate: this.global.dateFormater(this.invoiceDate, '-'),
          TableID: this.tableID,
          PartyID: this.PartyID,
          InvType: "HS",
          ProjectID: this.ProjectID,
          BookerID: this.waiterFeature ? this.BookerID : 1,
          PaymentType: this.paymentType,
          Remarks: this.billRemarks,
          OrderType: this.orderType,
          CoverOf: this.coverOf,
          OtherCharges: this.OtherCharges,
          BillDiscount: this.billDiscount,
          GstAmount:0,
          GstValue:0,

          SaleDetail: JSON.stringify(this.tableData),

          UserID: this.global.getUserID()
        }).subscribe(
          (Response: any) => {

            if (Response.msg == 'Data Saved Successfully') {
              this.tmpInvBillNO = Response.invNo;
              this.printKOT(Response.invNo);   /////// Will Print KOT ////////////////
              this.msg.SuccessNotify(Response.msg);
              this.getTable()
              this.getRecipeList({ recipeCatID: 0, prodFlag: false });
              this.reset();
              this.getHoldBills();

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

      if (type == 'rehold') {

        this.app.startLoaderDark()
        this.http.post(environment.mainApi + this.global.restaurentLink + 'UpdateHold', {
          InvBillNo: this.invBillNo,
          OrderNo: this.orderNo,
          InvDate: this.global.dateFormater(this.invoiceDate, '-'),
          TableID: this.tableID,
          TmpTableID: this.prevTableID,
          PartyID: this.PartyID,
          InvType: "HS",
          ProjectID: this.ProjectID,
          BookerID: this.waiterFeature ? this.BookerID : 1,
          PaymentType: this.paymentType,
          Remarks: this.billRemarks,
          OrderType: this.orderType,
          CoverOf: this.coverOf,
          OtherCharges: this.OtherCharges,
          BillDiscount: this.billDiscount,
          GstAmount:0,
          GstValue:0,
          SaleDetail: JSON.stringify(this.tableData),

          UserID: this.global.getUserID()
        }).subscribe(
          (Response: any) => {

            if (Response.msg == 'Data Updated Successfully') {
              this.printKOT(Response.invNo); /////// Will Print KOT ////////////////
              this.msg.SuccessNotify(Response.msg);
              this.getTable()
              this.reset();
              this.getHoldBills();

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

      if (type == 'sale') {

        if (this.paymentType == 'Complimentary') {
          this.global.closeBootstrapModal('#paymentMehtod',true);

          this.global.openPassword('Password').subscribe(pin => {
            if (pin !== '') {
              this.http.post(environment.mainApi + this.global.userLink + 'MatchPassword', {
                RestrictionCodeID: 3,
                Password: pin,
                UserID: this.global.getUserID()

              }).subscribe(
                (Response: any) => {
                  if (Response.msg == 'Password Matched Successfully') {

                    this.cash = 0;
                    this.bankCash = 0;
                    this.change = 0;
                    this.billDiscount = 0;
                    this.OtherCharges = 0;
                    this.bankCoaID = 0;
                    this.getTotal();
                    this.InsertSale();
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



        } else {
          this.InsertSale()
        }
      }

    }
  }


  printKOT(invNo: any) {
    var printData = this.tableData.filter((e: any) => e.entryType == 'New');
    if (printData.length > 0 && this.global.getKOTApproval() == true) {

      this.KotPrint.myPrintData = printData;
      this.KotPrint.printBill(invNo, false);

      // setTimeout(() => {
      //   this.global.printData('#print-Kot');
      // }, 200);
    }

  }

  //////////////////////////////////////////////////////////////////
  validSaleFlag = true;

  InsertSale() {

    if (this.customerMobileno == '' || this.customerMobileno == undefined) {
      this.customerMobileno = '0000-0000000';
    }
    if (this.customerName == '' || this.customerName == undefined) {
      this.customerName = '-';
    }
    if (this.invDocument == '' || this.invDocument == undefined) {
      this.invDocument = '-';
    }
   

    this.app.startLoaderDark()
    if (this.validSaleFlag) {
      this.validSaleFlag = false;
      this.http.post(environment.mainApi + this.global.restaurentLink + 'InsertSale', {
        HoldInvNo: this.invBillNo,
        OrderNo: this.orderNo,
        InvDate: this.global.dateFormater(this.invoiceDate, '-'),
        TableID: this.tableID,
        TmpTableID: this.prevTableID,
        PartyID: this.PartyID,
        InvType: "S",
        ProjectID: this.ProjectID,
        BookerID: this.waiterFeature ? this.BookerID : 1,
        PaymentType: this.paymentType,
        Remarks: this.billRemarks,
        OrderType: this.orderType,
        CoverOf: this.coverOf,
        GstAmount:this.GstAmount,
        GstValue:this.gstValue,
        BillTotal: this.subTotal + this.GstAmount,
        BillDiscount: this.billDiscount,
        OtherCharges: this.OtherCharges,
        NetTotal: this.netTotal + this.GstAmount,
        CashRec: this.cash,
        Change: this.change,
        BankCoaID: this.bankCoaID,
        BankCash: this.bankCash,
        InvoiceDocument: this.invDocument,
        CusContactNo: this.customerMobileno,
        CusName: this.customerName,

        SaleDetail: JSON.stringify(this.tableData),
        UserID: this.global.getUserID()
      }).subscribe(
        (Response: any) => {
          if (Response.msg == 'Data Saved Successfully') {
            this.validSaleFlag = true;
            this.printKOT(Response.invNo); /////// Will Print KOT ////////////////
            this.msg.SuccessNotify(Response.msg);

            this.printAfterSave(Response.invNo);
            this.getTable();
            this.getRecipeList({ recipeCatID: 0, prodFlag: false });
            this.getHoldBills();
            setTimeout(() => {
              this.reset();
            }, 200);
            /////////// will hide the modal window ///////////
            this.global.closeBootstrapModal('#paymentMehtod',true);


          } else {
            this.validSaleFlag = true;
            this.msg.WarnNotify(Response.msg);
          }
          this.app.stopLoaderDark();
        },
        (Error: any) => {
          this.validSaleFlag = true;
          this.msg.WarnNotify(Error);
          this.app.stopLoaderDark();
        }
      )
    }
  }

  /////////////////////////////////////////////////////////////////

  getHoldBills() {


    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetHoldBills').subscribe(
      (Response: any) => {
        this.holdBillList = Response;
      },
      (Error: any) => {
        this.msg.WarnNotify(Error);

      }
    )
  }

  //////////////////////////////////////////////////////////////

  getBillDetail(item: any) {

    this.tableID = item.tableID;
    this.tempTableID = item.tableID;
    this.tempOrderType = item.orderType;
    this.holdbtnType = 'rehold';
    this.tableTitle = '';
    if (item.orderType == 'Dine In') {
      this.tableTitle = item.tableTitle;
    }
    this.invBillNo = item.invBillNo;
    this.OtherCharges = item.otherCharges;
    this.PartyID = item.partyID;
    this.ProjectID = item.projectID;
    this.BookerID = item.bookerID;
    this.billRemarks = item.remarks;
    this.orderType = item.orderType;
    this.coverOf = item.coverOf;
    this.prevTableID = item.tmpTableID;
    this.billDiscount = item.billDiscount;
    this.OtherCharges = item.otherCharges;
    this.invoiceDate = new Date(item.invDate);


    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetHoldedBillDetail?BillNo=' + item.invBillNo).subscribe(
      (Response: any) => {
       
        this.tableData = [];
        this.orderNo = Response[0].orderNo;
        Response.forEach((e: any) => {
          this.tableData.push({
            productID: e.productID,
            productTitle: e.productTitle,
            quantity: e.quantity,
            costPrice: e.costPrice,
            avgCostPrice: e.avgCostPrice,
            salePrice: e.salePrice,
            recipeID: e.recipeID,
            cookingAriaID: e.cookingAriaID,
            cookingTime: e.cookingTime,
            requestType: e.requestType,
            entryType: e.entryType,
            autoInvDetID: e.autoInvDetID,
          });


        });
        this.getTotal()


      },
      (Error: any) => {
        this.msg.WarnNotify(Error);

      }
    )


  }

  ///////////////////////////////////////////////////////////////

  tempDeleteRow: any = [];

  deleteRow(item: any, voidQty: any) {
    if (item.entryType == 'New') {
      var index = this.tableData.indexOf(item);
      this.tableData.splice(index, 1);
      this.getTotal();
    }

    if (voidQty > item.quantity) {
      this.msg.WarnNotify('Void Quantity is not Valid');
      return;
    } else {
      if (item.entryType == 'Saved') {


        if (this.tableData.length == 1 && item.quantity <= 1) {
          this.voidBill();
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

                    this.http.post(environment.mainApi + this.global.restaurentLink + 'InsertVoidItem', {
                      InvBillNo: this.invBillNo,
                      ProductID: item.productID,
                      ProductTitle: item.productTitle,
                      Quantity: voidQty,
                      CostPrice: item.costPrice,
                      AvgCostPrice: item.avgCostPrice,
                      SalePrice: item.salePrice,
                      RecipeID: item.recipeID,
                      CookingAriaID: item.cookingAriaID,
                      CookingTime: item.cookingTime,
                      RequestType: 'Void',
                      EntryType: item.entryType,
                      ReqRefNo: item.autoInvDetID,

                      PinCode: pin,
                      UserID: this.global.getUserID()
                    }).subscribe(
                      (Response: any) => {
                        if (Response.msg == 'Data Saved Successfully') {
                          this.msg.SuccessNotify('Item Void');

                          /////// Will Print KOT ////////////////
                          if (this.global.getKOTApproval() == true) {
                            this.KotPrint.myPrintData = [{
                              productTitle: item.productTitle,
                              quantity: voidQty,
                            }];
                            this.KotPrint.printBill(this.invBillNo, true);

                            // setTimeout(() => {
                            //   this.global.printData('#print-Kot');
                            // }, 200);
                          }


                          if (item.quantity <= 1 || voidQty == item.quantity) {
                            var index = this.tableData.indexOf(item);
                            this.tableData.splice(index, 1);
                          } else {
                            item.quantity -= voidQty;
                          }
                          this.tempDeleteRow = [];
                          this.getTotal()

                        } else {
                          this.msg.WarnNotify(Response.msg);
                        }
                      },
                      (Error: any) => {
                        this.msg.WarnNotify(Error);

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
      }

    }


  }

  //////////////////////////////////////////////////////////////

  voidBill() {
    if (this.invBillNo != '') {
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
                    this.http.post(environment.mainApi + this.global.restaurentLink + 'InsertVoidFullBill', {
                      InvBillNo: this.invBillNo,
                      TableID: this.tableID,
                      TmpTableID: this.tableID,
                      SaleDetail: JSON.stringify(this.tableData),
                      UserID: this.global.getUserID()
                    }).subscribe(
                      (Response: any) => {
                        if (Response.msg == 'Data Saved Successfully') {

                          /////// Will Print KOT ////////////////
                          if (this.global.getKOTApproval() == true) {
                            this.KotPrint.myPrintData = this.tableData;
                            this.KotPrint.printBill(this.invBillNo, true);

                            // setTimeout(() => {
                            //   this.global.printData('#print-Kot');
                            // }, 200);
                          }


                          this.msg.SuccessNotify('Bill Void');
                          this.getTotal();
                          this.reset();
                          this.getHoldBills();
                          this.getTable()

                        } else {
                          this.msg.WarnNotify(Response.msg);
                        }
                        this.app.stopLoaderDark();
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


  ///////////////////////////////////////////////////////////////



  openQtyModal(){
    this.global.openBootstrapModal('#qtyModal',true);
    this.global.closeBootstrapModal('#prodModal',true);
    setTimeout(() => {
      $('.prodQty').trigger('focus');
    $('.prodQty').trigger('select');
    }, 500);

  }

  closeQtyModal(){
    this.global.openBootstrapModal('#prodModal',true);
    this.global.closeBootstrapModal('#qtyModal',true);
  }


  ///////////////////////////////////////////////////////////////

  reset() {
    this.change = 0;

    this.OtherCharges = 0;
    this.billDiscount = 0;
    this.invBillNo = '';
    this.prevTableID = 0;
    this.orderNo = 0;
    this.coverOf = '';
    this.billRemarks = '';
    this.BookerID = 0;
    this.PartyID = 0;
    this.invoiceDate = new Date();
    this.orderType = '';
    this.paymentType = '';
    this.cash = 0;
    this.bankCash = 0;

    this.tableID = 0;
    this.tempTableID = 0;
    this.prevTableID = 0;
    this.tempOrderType = 'Dine In';
    this.tableTitle = '';
    this.tempProdRow = [];
    this.tempQty = 1;
    this.tempIndex = 0;
    this.tableData = [];
    this.subTotal = 0;
    this.netTotal = 0;
    // this.tempRecipeList = [];
    this.holdbtnType = 'hold';
    this.getBankList();
    this.customerName = '';
    this.customerMobileno = '';
    this.invDocument = '';
    this.mergeBillNo1 = '';
    this.mergeBillNo2 = '';

  }

  resetPrint() {
    this.myPrintData = [];
    this.myInvoiceNo = '';
    this.mytableNo = '';
    this.myCounterName = '';
    this.myInvDate = '';
    this.myOrderType = '';
    this.mySubTotal = 0;
    this.myNetTotal = 0;
    this.myOtherCharges = 0;
    this.myRemarks = '';
    this.myDiscount = 0;
    this.myCash = 0;
    this.myChange = 0;
    this.myBank = 0;
    this.myPaymentType = '';
    this.myDuplicateFlag = false;
    this.myTime = '';
    this.mergeBillNo1 = '';
    this.mergeBillNo2 = '';
  }



  myPrintData: any = [];
  myInvoiceNo = '';
  mytableNo = '';
  myCounterName = '';
  myInvDate: any = '';
  myInvTime: any = '';
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
  myCounter: any = '';


  printAfterSave(invNo: any) {

    this.billPrint.printBill(invNo);
    // setTimeout(() => {
    //   this.global.printData('#print-bill');
    // }, 200);


  }

  HOldandPrint(type: any) {

    this.myOrderType = this.orderType;
    if (this.tableData != '') {

      if (this.invBillNo != '') {
        this.myInvoiceNo = this.invBillNo;
        this.save('rehold');

        setTimeout(() => {
          this.billPrint.HOldandPrint(this.orderType, this.myInvoiceNo);
        }, 1000);

        // setTimeout(() => {
        //   this.global.printData('#print-bill');
        // }, 200);

      } else {

        this.save('hold');
        setTimeout(() => {
          this.myInvoiceNo = this.tmpInvBillNO;
          if (this.tmpInvBillNO != '') {
            this.billPrint.HOldandPrint(this.orderType, this.tmpInvBillNO);

            // setTimeout(() => {
            //   this.global.printData('#print-bill');
            // }, 200);
            this.tmpInvBillNO = '';
          }
        }, 2000);
      }
      this.myDuplicateFlag = false;

    } else {
      this.msg.WarnNotify('No Bill Retrieved')
    }


  }


  ////////////////////////////////////////////////////////////

  genDisc(type:any){

    if(type == 'perc'){
      this.discAmount = (this.subTotal * this.discPer) /100;
    }
    if(type == 'amt'){
      this.discPer = (this.discAmount / this.subTotal) * 100;
    }

  }

  
  verifyDiscount() {
    $('#disc').hide();
    if (this.discAmount > this.netTotal) {
      this.msg.WarnNotify('Discount is not valid!')
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
                this.global.closeBootstrapModal('#disc',true);
                this.billDiscount = this.discAmount;
                this.getTotal();
                this.discAmount = 0;
                this.discPer = 0;
              } else {
                this.msg.WarnNotify(Response.msg);
                $('#disc').show();
              }
             
              this.app.stopLoaderDark();
            },
            (Error: any) => {
              $('#disc').show();
              this.msg.WarnNotify(Error);
              this.app.stopLoaderDark();
            }
          )
        }
      })
    }
  }
  /////////////////////////////////////////////////





  savedbillList: any = [];

  mergeBillNo1 = '';
  mergeBillNo2 = '';

  mergeBills() {
    // alert(this.mergeBillNo1)
    // alert(this.mergeBillNo2)
    if (this.mergeBillNo1 == '' || this.mergeBillNo2 == '') {
      this.msg.WarnNotify('Select Both Bill 1 and 2')
    } else {
      this.http.get(environment.mainApi + this.global.restaurentLink + 'MergeAndPrintBill?BillNo=' + this.mergeBillNo1 + '&BillNo2=' + this.mergeBillNo2).subscribe(
        (Response: any) => {

          this.myInvoiceNo = Response[0].invBillNo;
          this.myInvDate = Response[0].invDate;
          this.myOrderType = Response[0].orderType;
          this.myRemarks = Response[0].billRemarks;
          this.myCounter = Response[0].entryUser;


          this.myPrintData = Response;
          this.mySubTotal = 0;
          this.OtherCharges = 0;
          this.myOtherCharges = this.holdBillList.find((e: any) => e.invBillNo == this.mergeBillNo1).otherCharges +
            this.holdBillList.find((e: any) => e.invBillNo == this.mergeBillNo2).otherCharges;
          Response.forEach((e: any) => {
            this.mySubTotal += e.quantity * e.salePrice;
          });




          setTimeout(() => {
            this.global.printData('#mergePrint');
          }, 500);


        }
      )
    }
  }


  increment(type: any, value: any) {
    if (type == 'add') {
      this.tempQty += 1;
    }

    if (type == 'minus') {
      this.tempQty -= 1;
    }
  }

  tmpProdIndex = 0;
  editQty(item: any, index: any) {
   if(item.entryType == 'New'){
    this.tempProdRow = item;
    this.tmpProdIndex = index;
    this.global.openBootstrapModal('#qtyModal',true);
    setTimeout(() => {
      $('.prodQty').trigger('focus');
    $('.prodQty').trigger('select');
    }, 500);

   }


    // var qty =  this.tableData[index].quantity;
    // if (type == 'add') {

    //   qty >= 0 ? this.tableData[index].quantity += 1 : ''
    // }

    // if (type == 'minus') {
    //    qty > 0 ? this.tableData[index].quantity -= 1 : ''
    // }
  }

  changeQty(qty:any){

    this.tableData[this.tmpProdIndex].quantity = qty;

  }

  


  /////////////////////////////////////////////////////////////////////////////

  getSavedBill() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetOpenDaySale').subscribe(
      (Response: any) => {

        this.savedbillList = Response;
      }
    )


  }



  printDuplicateBill(item: any) {
    $('#SavedBillModal').hide();
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

              this.billPrint.printBill(item.invBillNo);
              this.billPrint.myDuplicateFlag = true;

              // setTimeout(() => {
              //   this.global.printData('#print-bill');
              // }, 500);

            } else {
              this.msg.WarnNotify(Response.msg);
              $('#SavedBillModal').show();
            }
          }
        )
      }
    })

  }

  billDetails(item: any) {
    $('#SavedBillModal').hide();
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




 openCommentCard(item:any){
      this.global.closeBootstrapModal('#holdedBillModal',true)
      this.global.openBootstrapModal('#commentCardModal',true)
    }



}


