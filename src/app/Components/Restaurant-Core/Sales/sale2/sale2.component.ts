import { HttpClient } from '@angular/common/http';
import { Component, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../../../User/pincode/pincode.component';
import Swal from 'sweetalert2';
import { RestKotPrintComponent } from '../SaleCommonComponent/rest-kot-print/rest-kot-print.component';
import { SaleBillDetailComponent } from '../sale1/sale-bill-detail/sale-bill-detail.component';
import { RestSaleBillPrintComponent } from '../SaleCommonComponent/rest-sale-bill-print/rest-sale-bill-print.component';
import { SaleSavedBillComponent } from '../SaleCommonComponent/sale-saved-bill/sale-saved-bill.component';


@Component({
  selector: 'app-sale2',
  templateUrl: './sale2.component.html',
  styleUrls: ['./sale2.component.scss']
})
export class Sale2Component implements OnInit {
  @HostListener('document:visibilitychange', ['$event'])

  @ViewChild(RestSaleBillPrintComponent) billPrint: any;
  @ViewChild(RestKotPrintComponent) KotPrint: any;

  showCmpNameFeature: any = this.global.showCmpNameFeature;
  waiterFeature = this.global.waiterFeature;
  FBRFeature = this.global.FBRFeature;
  gstFeature = this.global.gstFeature;

  serviceChargesFeature = this.global.serviceChargeFeature;
  RestSimpleSaleFeature = this.global.RestSimpleSaleFeature;
  BankShortCutsFeature = this.global.BankShortCutsFeature;
  coverOfFeature = this.global.coverOfFeature;
  disableDate = this.global.disableSaleDate;
  customerFeature = this.global.customerFeature;
  defaultOrderTypeFeature = this.global.DefaultOrderType;
  disableDiscPwd = this.global.DisableDiscPwd;
  disablePrintPwd = this.global.DisablePrintPwd;
  autoTableSelectFeature = this.global.AutoTableSelect;
  postBillFeature = this.global.postSale;
  RestBillUserwise = this.global.RestBillUserwise;


  roleType = this.global.getRoleTypeID();


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


  onWheel(event: WheelEvent): void {
    const container = event.currentTarget as HTMLElement;
    container.scrollLeft += event.deltaY;
    event.preventDefault(); // Prevent vertical scrolling
  }

  mobileMask = this.global.mobileMask;

  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent,
    public global: GlobalDataModule,
    private dialogue: MatDialog,
    private route: Router
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
    this.getPartyList();

  }





  orderTypeList: any = [
    { val: 'Dine In', title: 'Dine In' },
    { val: 'Take Away', title: 'Take Away' },
    { val: 'Home Delivery', title: 'Home Delivery' },
  ]

  categoriesList: any = [];
  tmpInvBillNO = '';
  serviceCharges = this.global.getServiceCharges();
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
  // orderType =  this.defaultOrderTypeFeature ? 'Take Away' : '' ;//this.global.getRestOrderType() == '' ? '' : this.global.getRestOrderType();
  orderType = this.getOrderType(); //  this.global.getRestOrderType() == '' ? '' : this.defaultOrderTypeFeature ? 'Take Away' : this.global.getRestOrderType(); 
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
  tmpTotalPrice = 0;
  tempIndex: any;

  tableData: any = [];
  subTotal: number = 0;
  netTotal = 0;
  tempRecipeList: any = [];
  RecipeList: any = [];
  holdBillList: any = [];

  tableList: any = [];
  bookerList: any = [];
  partyList: any = [];

  //////For Temp Use///////////
  discPer = 0;
  discAmount = 0;

  getOrderType() {
    return this.defaultOrderTypeFeature ? 'Take Away' : this.global.getRestOrderType() == '' ? '' : this.global.getRestOrderType()
  }

  getBookerList() {

    this.global.getBookerList().subscribe((data: any) => { this.bookerList = data; });
  }

  getPartyList() {
    this.global.getCustomerList().subscribe((data: any) => { this.partyList = data; });
  }

  partySelect() {
    if (this.PartyID > 0) {
      this.paymentType = 'Credit';

    } else {
      this.paymentType = 'Cash';
    }
    this.getTotal();
  }

  onPriceChange(type: any) {
    if (type == 'price') {
      this.tempQty = this.tmpTotalPrice / this.tempProdRow.salePrice;
    }

    if (type == 'qty') {
      this.tmpTotalPrice = this.tempQty * this.tempProdRow.salePrice;
    }

  }


  searchByCode(event: any, value: any) {

    if (event.keyCode == 13) {
      var RecipeRow = this.tempRecipeList.filter((e: any) => e.recipeCode == value);
      if (RecipeRow.length > 0) {
        this.productSelected(RecipeRow[0], 1);
      } else {
        this.msg.WarnNotify('Recipe Not Found');
        $('#recSearch').val('');
      }
    }


  }

  rowFocused = -1;
  prodFocusedRow = 0;
  handleUpdown(item: any, e: any, cls: string, index: any) {

    const container = $(".table-logix");
    if (e.keyCode == 9) {
      this.rowFocused = index + 1;
    }

    if (e.shiftKey && e.keyCode == 9) {

      this.rowFocused = index - 1;
    }
    if (e.keyCode == 13) {
      e.preventDefault();
      $('#cash2').trigger('select');
      $('#cash2').trigger('focus');
    }

    if ((e.keyCode == 13 || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 16 || e.keyCode == 46 || e.keyCode == 37 || e.keyCode == 110 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 48 || e.keyCode == 49 || e.keyCode == 50 || e.keyCode == 51 || e.keyCode == 52 || e.keyCode == 53 || e.keyCode == 54 || e.keyCode == 55 || e.keyCode == 56 || e.keyCode == 57 || e.keyCode == 96 || e.keyCode == 97 || e.keyCode == 98 || e.keyCode == 99 || e.keyCode == 100 || e.keyCode == 101 || e.keyCode == 102 || e.keyCode == 103 || e.keyCode == 104 || e.keyCode == 105)) {
      // 13 Enter ///////// 8 Back/remve ////////9 tab ////////////16 shift ///////////46 del  /////////37 left //////////////110 dot
    }
    else {
      e.preventDefault();
    }

    /////move down

    if (e.keyCode === 40) {
      if (this.tableData.length > 1) {
        this.rowFocused = Math.min(this.rowFocused + 1, this.tableData.length - 1);
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

      this.deleteRow(item, 1);
      this.rowFocused = 0;
    }

  }


  focusTo(cls: any, e: any) {

    if (cls == '#cash' || cls == '#discRs') {
      setTimeout(() => {
        $(cls).trigger('focus');
        $(cls).trigger('select');
      }, 500);
    }


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
    if (cls == '#cash2' && e.keyCode == 13 && e.target.value == '') {
      e.preventDefault();
      $(cls).trigger('select');
      $(cls).trigger('focus');

    }

    if (cls == '#save' && e.keyCode == 13) {
      e.preventDefault();
      // $(cls).trigger('select');
      $(cls).trigger('focus');

    }

  }




  changeFocus(id: any, e: any) {
    if (e.keyCode == 13) {
      $(id).trigger('focus');
    }
  }

  ////////////////////////////////////////////////////////////

  getTable() {
    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetTable').subscribe(
      (Response: any) => {
        this.tableList = Response;

        //////////////// will Set the Default Table No by looping through available Tables //////////
        if (this.autoTableSelectFeature && !this.defaultOrderTypeFeature) {
          this.orderType = 'Dine In';
          this.setAutoTable();
        }
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

  setAutoTable() {

    var tblList = this.tableList.filter((e: any) => e.tableStatus == false);
    if (tblList.length > 0) {
      this.tableID = tblList[0].tableID;
      this.tableTitle = tblList[0].tableTitle;
    } else {
      this.msg.WarnNotify('No Table Empty')
    }


  }



  selectT() {

    if (this.tempOrderType == 'Dine In' && (this.tempTableID == 0 || this.tempTableID == undefined)) {
      this.msg.WarnNotify('Select Table')
    } else if (this.tempOrderType == '' || this.tempOrderType == undefined || this.tempOrderType == null) {
      this.msg.WarnNotify('Select Order Type')
    } else if (this.tempOrderType == 'Dine In' && this.coverOfFeature && (this.coverOf == '' || this.coverOf == 0 || this.coverOf == undefined)) {
      this.msg.WarnNotify('Enter Cover oF')
    } else if (this.BookerID == 0 && this.waiterFeature) {
      this.msg.WarnNotify('Select Waiter')
    } else {


      if (!this.coverOfFeature) {
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

      this.global.closeBootstrapModal('#NewBill', true);




    }


  }


  tmpProdIndex = 0;
  editQty(item: any, index: any) {
    if (item.entryType == 'New') {
      this.tempProdRow = item;
      this.tmpTotalPrice = item.salePrice * item.quantity;
      this.tempQty = item.quantity;
      this.tmpProdIndex = index;
      this.global.openBootstrapModal('#qtyModal', true);
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


  changeQty(qty: any) {

    this.tableData[this.tmpProdIndex].quantity = parseFloat(qty);

    this.getTotal();
    this.tempQty = 1;

  }


  ////////////////////////////////////////////
  getBankList() {

    this.global.getBankList().subscribe((data: any) => {
      this.bankCoaList = data;
      // setTimeout(() => {
      //   this.bankCoaID = data[0].coaID;
      // }, 200);
    });
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

  OnCatChange(item: any) {
    this.categoryID = item.recipeCatID;
    if (item.recipeCatID > 0) {
      this.RecipeList = this.tempRecipeList.filter((e: any) => e.recipeCatID == item.recipeCatID);
    } else {
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
      if (this.global.validCharges(this.subTotal) && this.serviceChargesFeature) {
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

  onProdClicked(item: any) {

    if (this.RestSimpleSaleFeature) {
      this.productSelected(item, 1)
    } else {
      this.global.openBootstrapModal('#qtyModal', true);
      this.global.focusTo('.prodQty');
      this.tempProdRow = item;
      this.tmpTotalPrice = item.recipeSalePrice;
    }

  }

  productSelected(item: any, qty: any) {
    if (this.orderType == '') {
      this.msg.WarnNotify('Select The Order type')
    } else if (this.tableID == 0 && this.orderType == 'Dine In') {
      this.msg.WarnNotify('Table Number Must be Selected');
    } else if (qty <= 0) {
      this.msg.WarnNotify('Enter Valid Quantity')
    } else {
      var index = this.tableData.findIndex((e: any) => e.recipeID == item.recipeID && e.entryType == 'New');



      if (index >= 0) {
        this.tableData[index].quantity += 1;
        this.tableData[index].rowIndex = this.tableData[0].rowIndex + 1;
      } else {
        this.tableData.push({
          rowIndex: this.tableData.length == 0 ? this.tableData.length + 1
            : this.tableData[0].rowIndex + 1,

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

      this.orderDataTable()
      this.getTotal();
    }
    this.tempProdRow = [];
    this.tempQty = 1;
    $('#recSearch').trigger('select');
    $('#recSearch').trigger('focus');
    // $('#recSearch').val('');
  }

  orderDataTable() {
    this.tableData.sort((a: any, b: any) => b.rowIndex - a.rowIndex);

  }


  editTotal(item: any) {
    if (this.RestSimpleSaleFeature) {
      this.tempProdRow = item;
      Swal.fire({
        title: "Enter Total Amount",
        input: "text",
        showCancelButton: true,
        confirmButtonText: 'Save',
        showLoaderOnConfirm: true,
        preConfirm: (value) => {

          if (value == "") {
            return Swal.showValidationMessage("Enter Valid Amount");
          }

          if (isNaN(value)) {
            return Swal.showValidationMessage("Enter Valid Amount");
          }

          if (value <= 0) {
            return Swal.showValidationMessage("Enter Valid Amount");
          }

          this.tableData[this.tableData.indexOf(this.tempProdRow)].quantity =
            value / this.tableData[this.tableData.indexOf(this.tempProdRow)].salePrice;
          this.getTotal();
          this.tempProdRow = [];
        }
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Sale Price Updated",
            timer: 500,
          });
        }
      })
    }

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

  generateGst() {


    if (this.gstFeature && (this.paymentType == 'Cash' || this.paymentType == 'Split')) {
      this.gstValue = this.global.ResCashGst;
      this.GstAmount = (this.subTotal * this.gstValue) / 100;
    }
    if (this.gstFeature && this.paymentType == 'Bank') {
      if (this.bankCoaID > 0) {
        var coaTitle = this.bankCoaList.filter((e: any) => e.coaID == this.bankCoaID)[0].coaTitle;

        if (coaTitle == 'Card') {
          this.gstValue = this.global.ResCardGst;
        } else {
          this.gstValue = this.global.ResCashGst;
        }
      } else {
        this.gstValue = this.global.ResCardGst;
      }

      this.GstAmount = (this.subTotal * this.gstValue) / 100;

    }


    if (this.gstFeature && this.paymentType == 'Complimentary') {
      this.gstValue = 0;
      this.GstAmount = 0;
    }

    this.getTotal();

  }


  save(type: any, SendToFbr: any, printFlag?: any) {


    if (this.orderType == 'Dine In' && (this.tableID == 0 || this.tableID == undefined)) {
      this.msg.WarnNotify('Select Table');
      return;
    }
    if (this.orderType == '' || this.orderType == undefined) {
      this.msg.WarnNotify('Select Order Type');
      return;
    }
    if (type == 'sale' && (this.paymentType == '' || this.paymentType == undefined)) {
      this.msg.WarnNotify('Select Payment Type');
      return;
    }

    if (this.tableData == '' || this.tableData == undefined) {
      this.msg.WarnNotify('One Product must be Entered');
      return;
    }
    if (type == 'sale' && this.paymentType == 'Split' && ((this.cash + this.bankCash) > (this.netTotal + this.GstAmount) || (this.cash + this.bankCash) < this.netTotal)) {
      this.msg.WarnNotify('Amount in Not Valid');
      return;

    }
    if (type == 'sale' && this.paymentType == 'Cash' && (this.cash < (this.netTotal + this.GstAmount))) {
      this.msg.WarnNotify('Enter Valid Amount');
      return;
    }
    if (type == 'sale' && this.paymentType == 'Bank' && (this.bankCash < (this.netTotal + this.GstAmount))) {
      this.msg.WarnNotify('Enter Valid Amount');
      return;
    }
    if (type == 'sale' && this.paymentType == 'Credit' && (this.bankCash + this.cash > (this.netTotal + this.GstAmount))) {
      this.msg.WarnNotify('Enter Valid Amount');
      return;
    }
    if (type == 'sale' && this.paymentType == 'Credit' && this.PartyID == 0) {
      this.msg.WarnNotify('Select Customer');
      return;
    }
    if (type == 'sale' && (this.customerName == '' && this.customerMobileno != '')) {
      this.msg.WarnNotify('Enter Customer Name');
      return;
    }
    if (type == 'sale' && this.paymentType == 'Split' && this.cash <= 0) {
      this.msg.WarnNotify('Cash Amount is Not Valid');
      return;
    }
    if (type == 'sale' && this.paymentType == 'Split' && this.bankCash <= 0) {
      this.msg.WarnNotify('Bank Amount is Not Valid');
      return;
    }
    if (type == 'sale' && (this.customerName != '' && this.customerMobileno == '')) {
      this.msg.WarnNotify('Enter Customer Name');
      return;
    }
    if (this.orderType == 'Dine In' && this.waiterFeature && (this.BookerID == 0 || this.BookerID == undefined)) {
      this.msg.WarnNotify('Select Waiter');
      return;
    }
    if (type == 'sale' && (this.paymentType == 'Bank' || this.paymentType == 'Split') && this.bankCoaID <= 0) {
      this.msg.WarnNotify('Select Bank');
      return;
    }


    if (this.billDiscount == '' || this.billDiscount == undefined || this.billDiscount == null) {
      this.billDiscount = 0;
    }

    if (this.OtherCharges == '' || this.OtherCharges == undefined || this.OtherCharges == null) {
      this.OtherCharges = 0;
    }

    var holdPostData = {
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
      GstAmount: 0,
      GstValue: 0,
      SaleDetail: JSON.stringify(this.tableData),
      UserID: this.global.getUserID()

    }

    if (this.global.SubscriptionExpired()) {
      Swal.fire({
        title: 'Alert!',
        text: 'Unable to Save, Subscription Expired Today',
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
      this.http.post(environment.mainApi + this.global.restaurentLink + 'InsertHold', holdPostData).subscribe(
        (Response: any) => {

          if (Response.msg == 'Data Saved Successfully') {
            // this.tmpInvBillNO = Response.invNo;
            if (printFlag) {
              this.billPrint.HOldandPrint(this.orderType, Response.invNo);
            }
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
          this.global.focusTo('#recSearch');
        },
        (Error: any) => {
          console.log(Error);
          this.msg.WarnNotify(Error);
          this.app.stopLoaderDark();
        }
      )
    }


    if (type == 'rehold') {

      this.app.startLoaderDark()
      this.http.post(environment.mainApi + this.global.restaurentLink + 'UpdateHold', holdPostData).subscribe(
        (Response: any) => {

          if (Response.msg == 'Data Updated Successfully') {
            if (printFlag) {
              this.billPrint.HOldandPrint(this.orderType, Response.invNo);
            }
            this.printKOT(Response.invNo); /////// Will Print KOT ////////////////
            this.msg.SuccessNotify(Response.msg);
            this.getTable()
            this.reset();
            this.getHoldBills();

          } else {
            this.msg.WarnNotify(Response.msg);
          }
          this.app.stopLoaderDark();
          this.global.focusTo('#recSearch');
        },
        (Error: any) => {
          console.log(Error);
          this.msg.WarnNotify(Error);
          this.app.stopLoaderDark();
        }
      )


    }

    if (type == 'sale') {

      if (this.paymentType == 'Complimentary') {
        this.global.closeBootstrapModal('#paymentMehtod', true);

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
                  this.InsertSale(false);
                } else {
                  this.msg.WarnNotify(Response.msg);
                }
                this.global.focusTo('#recSearch');
              },
              (Error: any) => {
                console.log(Error);
                this.msg.WarnNotify(Error);
                this.app.stopLoaderDark();
              }
            )
          }
        })



      } else {
        this.InsertSale(SendToFbr)
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

  InsertSale(SendToFbr: any) {

    let postData = {

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
      GstAmount: this.GstAmount,
      GstValue: this.gstValue,
      BillTotal: this.subTotal + this.GstAmount,
      BillDiscount: this.billDiscount,
      OtherCharges: this.OtherCharges,
      NetTotal: this.netTotal + this.GstAmount,
      CashRec: this.cash,
      Change: this.change,
      BankCoaID: this.bankCoaID,
      BankCash: this.bankCash,
      InvoiceDocument: this.invDocument || '-',
      CusContactNo: this.customerMobileno || '0000-0000000',
      CusName: this.customerName || '-',
      SendToFbr: SendToFbr,
      SaleDetail: JSON.stringify(this.tableData),
      UserID: this.global.getUserID()
    }

    this.app.startLoaderDark()
    if (this.validSaleFlag) {
      this.validSaleFlag = false;
      this.http.post(environment.mainApi + this.global.restaurentLink + 'InsertSale', postData).subscribe(
        (Response: any) => {
          if (Response.msg == 'Data Saved Successfully') {

            this.printKOT(Response.invNo); /////// Will Print KOT ////////////////
            this.msg.SuccessNotify(Response.msg);

            this.printAfterSave(Response.invNo);

            this.getRecipeList({ recipeCatID: 0, prodFlag: false });
            this.getHoldBills();
            setTimeout(() => {
              this.reset();
              this.getTable();
            }, 200);
            /////////// will hide the modal window ///////////
            this.global.closeBootstrapModal('#paymentMehtod', true);


          } else {
            this.msg.WarnNotify(Response.msg);
          }
          this.app.stopLoaderDark();
          this.validSaleFlag = true;
        },
        (Error: any) => {
          console.log(Error);
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

        if (this.RestBillUserwise && this.roleType == 3) {

          this.holdBillList = Response.filter((e: any) => e.userID == this.global.getUserID());
        } else {
          this.holdBillList = Response;
        }
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
            rowIndex: this.tableData.length == 0 ? 1
              : this.tableData[0].rowIndex + 1,
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
        this.getTotal();
        this.orderDataTable();


      },
      (Error: any) => {
        this.msg.WarnNotify(Error);

      }
    )


  }

  ///////////////////////////////////////////////////////////////

  voidQty = 1;
  openVoidModal() {
    this.global.openBootstrapModal('#voidQtyModal', true);
    setTimeout(() => {

      $('.voidQuantity').trigger('focus');
      $('.voidQuantity').trigger('select');
    }, 500);
  }

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


        if (this.tableData.length == 1 && item.quantity == voidQty) {
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

  reset() {
    this.change = 0;

    this.OtherCharges = 0;
    this.billDiscount = 0;
    this.invBillNo = '';
    this.prevTableID = 0;
    this.orderNo = 0;
    this.coverOf = 0;
    this.billRemarks = '';
    this.BookerID = 0;
    this.PartyID = 0;
    this.invoiceDate = new Date();
    this.orderType = this.getOrderType();
    this.paymentType = 'Cash';
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
    if (this.tableData != '') {

      if (this.invBillNo != '') {
        this.save('rehold', false, true);
      } else {
        this.save('hold', false, true);
      }
      this.myDuplicateFlag = false;

    } else {
      this.msg.WarnNotify('No Bill Retrieved')
    }


  }

  ////////////////////////////////////////////////////////////

  genDisc(type: any) {

    if (type == 'perc') {
      this.discAmount = (this.subTotal * this.discPer) / 100;
    }
    if (type == 'amt') {
      this.discPer = (this.discAmount / this.subTotal) * 100;
    }

  }


  verifyDiscount() {
    $('#disc').hide();
    if (this.discAmount > this.netTotal) {
      this.msg.WarnNotify('Discount is not valid!')
    } else {
      if (this.disableDiscPwd) {
        this.global.closeBootstrapModal('#disc', true);
        this.billDiscount = this.discAmount;
        this.getTotal();
        this.discAmount = 0;
        this.discPer = 0;

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
                  this.global.closeBootstrapModal('#disc', true);
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



  /////////////////////////////////////////////////////////////////////////////

  getSavedBill() {
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetOpenDaySale').subscribe(
      (Response: any) => {
        this.savedbillList = Response;
      }
    )


  }



  printDuplicateBill(item: any) {

    if (this.disablePrintPwd) {
      this.billPrint.printBill(item.invBillNo);
      this.billPrint.myDuplicateFlag = true;
    } else {

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



  sendToFbr(item: any) {
    this.http.post(environment.mainApi + this.global.restaurentLink + 'ResSendToPra', {
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



  onBankSelected() {
    this.paymentType = 'Bank';
    this.cash = 0;
    this.getTotal();

  }
  onCashSelected() {
    this.paymentType = 'Cash';
    this.getTotal();

  }



  openSavedBill() {

    this.dialogue.open(SaleSavedBillComponent, {
      width: '80%',
    }).afterClosed().subscribe(val => {

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


}


