import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../../User/pincode/pincode.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {


  holdbtnType = 'hold';

  crudList: any = [];
  companyProfile: any = [];
  companyLogo: any = '';
  companyAddress: any = '';
  CompanyMobile: any = '';
  companyName: any = '';

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
    });

    this.global.getMenuList().subscribe((data) => {
      this.crudList = data.find((e: any) => e.menuLink == this.route.url.split("/").pop());
    })
  }


  ngOnInit(): void {
    this.global.setHeaderTitle('Sale');
    this.getCategories();
    // setTimeout(() => {
    //   console.log(this.categoriesList[0]);
    // }, 500);
    setTimeout(() => {
      this.onCatSelected(this.categoriesList[0]);
    }, 200);
    // this.getAllRecipe();
    this.getTable();
    this.getHoldBills();
    this.getBankList();

    // this.RecipeList =  this.RecipeList.filter((e:any)=>e.recipeCatID == this.categoryID);


  }



  orderTypeList: any = [
    { val: 'Dine In', title: 'Dine In' },
    { val: 'Take Away', title: 'Take Away' },
    { val: 'Home Delivery', title: 'Home Delivery' },
  ]

  categoriesList: any = [];



  tempProductList = [
    { id: 1, catID: 6, pName: 'Coke', pSale: 150, img: '../../../../assets/Images/pepsi.jfif' },
    { id: 2, catID: 6, pName: 'Pepsi', pSale: 120, img: '../../../../assets/Images/pepsi.jfif' },
    { id: 3, catID: 1, pName: 'Chicken Fajiat Pizza', pSale: 1050, img: '../../../../assets/Images/pizza.jfif' },
    { id: 4, catID: 2, pName: 'Burger', pSale: 500, img: '../../../../assets/Images/Burger.jpg' },
    { id: 5, catID: 2, pName: 'Pasta', pSale: 750, img: '../../../../assets/Images/pasta.jfif' },
    { id: 6, catID: 1, pName: 'Vegetable Pizza', pSale: 1050, img: '../../../../assets/Images/pizza.jfif' },
    { id: 7, catID: 2, pName: 'Cheese Burger', pSale: 500, img: '../../../../assets/Images/Burger.jpg' },
    { id: 8, catID: 2, pName: 'Fruid Salad', pSale: 750, img: '../../../../assets/Images/FruitSalad.jfif' },
    { id: 9, catID: 1, pName: 'Crust Pizza', pSale: 1050, img: '../../../../assets/Images/pizza.jfif' },
    { id: 10, catID: 5, pName: 'Prawns', pSale: 500, img: '../../../../assets/Images/Prawns.jfif' },
    { id: 11, catID: 6, pName: 'Pasta', pSale: 750, img: '../../../../assets/Images/pasta.jfif' },
    { id: 12, catID: 1, pName: ' Pizza', pSale: 1050, img: '../../../../assets/Images/pizza.jfif' },
    { id: 13, catID: 1, pName: ' Pizza', pSale: 1050, img: '../../../../assets/Images/pizza.jfif' },
    { id: 14, catID: 1, pName: ' Pizza', pSale: 1050, img: '../../../../assets/Images/pizza.jfif' },
    { id: 15, catID: 1, pName: 'BBQ Pizza', pSale: 1050, img: '../../../../assets/Images/pizza.jfif' },
    { id: 16, catID: 1, pName: 'BBQ Pizza', pSale: 1050, img: '../../../../assets/Images/pizza.jfif' },
    { id: 17, catID: 1, pName: 'BBQ Pizza', pSale: 1050, img: '../../../../assets/Images/pizza.jfif' },
    { id: 18, catID: 1, pName: 'BBQ Pizza', pSale: 1050, img: '../../../../assets/Images/pizza.jfif' },
    { id: 19, catID: 1, pName: 'BBQ Pizza', pSale: 1050, img: '../../../../assets/Images/pizza.jfif' },
    { id: 20, catID: 1, pName: 'BBQ Pizza', pSale: 1050, img: '../../../../assets/Images/pizza.jfif' },

  ]


  serviceCharges = 5;
  bankCoaID = 0;
  OtherCharges: any = 0;
  billDiscount: any = 0;
  invBillNo = '';
  prevTableID = 0;
  orderNo = 0;
  coverOf: any;
  billRemarks = '';
  BookerID = 1;
  ProjectID = this.global.InvProjectID;
  PartyID = 0;
  invoiceDate: Date = new Date();
  categoryID: any = 0;
  orderType = '';
  paymentType = '';
  cash = 0;
  bankCash = 0;
  change = 0;
  bankCoaList: any = [];

  tableID = 0;
  tempTableID = 0;
  tempOrderType = '';
  tableTitle: any = '';


  tempProdRow: any = [];
  tempQty: any;
  tempIndex: any;

  tableData: any = [];
  subTotal: number = 0;
  netTotal = 0;
  tempRecipeList: any = [];
  RecipeList: any = [];
  holdBillList: any = [];

  tableList: any = [];

  ////////////////////////////////////////////////////////////

  getTable() {
    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetTable').subscribe(
      (Response: any) => {
        this.tableList = Response;
        //console.log(Response);
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
    } else if (this.tempOrderType == 'Dine In' && (this.coverOf == '' || this.coverOf == 0 || this.coverOf == undefined)) {
      this.msg.WarnNotify('Enter Cover oF')
    } else {


      if (this.tempOrderType !== 'Dine In') {
        this.tempTableID = 0;
        this.coverOf = 0;
      }


      this.tableID = this.tempTableID;
      if (this.tempOrderType == 'Dine In') {
        this.tableTitle = this.tableList.find((e: any) => e.tableID == this.tableID).tableTitle;
      }
      this.orderType = this.tempOrderType;

      $('#NewBill').hide();
      // $('.modal').remove();
      // $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();



    }


  }


  ////////////////////////////////////////////

  getBankList() {
    this.http.get(environment.mainApi + 'acc/GetVoucherCBCOA?type=BRV').subscribe(
      (Response: any) => {
        this.bankCoaList = Response;
        setTimeout(() => {
          this.bankCoaID = Response[0].coaID;
        }, 200);
        //console.log(Response);
      },
      (Error) => {
        //console.log(Error);
      }
    )
  }

  ///////////////////////////////////////////////////////////

  onCatSelected(item: any) {
    this.categoryID = item.recipeCatID;
    // alert(item.recipeCatID)
    // alert(item.prodFlag)
    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetAllRecipesCatWise?CatID=' + item.recipeCatID + '&reqFlag=' + item.prodFlag).subscribe(
      (Response: any) => {
        // console.log(Response)
        this.RecipeList = Response;
      }
    )
    // this.RecipeList = this.tempRecipeList.filter((e:any)=>e.recipeCatID == catID);
  }


  //////////////////////////////////////////////////////////

  getCategories() {
    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetRecipeCategories').subscribe(
      (Response: any) => {
        this.categoriesList = Response;
        // console.log(Response);
        this.categoryID = this.categoriesList[0].recipeCatID;

      }
    )
  }


  rowFocused = 0;
  handleFocus(item: any, e: any, cls: string) {

    if (item.quantity < 0 || item.quantity == '') {
      item.quantity = 0;
    }

    /////move down
    if (e.keyCode == 40) {

      if (this.tableData.length > 1) {
        this.rowFocused += 1;
        if (this.rowFocused >= this.tableData.length) {
          this.rowFocused -= 1
        } else {
          var clsName = cls + this.rowFocused;
          // alert(clsName);   
          $(clsName).trigger('focus');
        }
      }
    }


    //Move up
    if (e.keyCode == 38) {

      if (this.tableData.length > 1) {

        this.rowFocused -= 1;

        var clsName = cls + this.rowFocused;
        // alert(clsName);
        $(clsName).trigger('focus');


      }

    }

    ////removeing row
    if (e.keyCode == 46) {
      this.deleteRow(item);
      //  $(cls+'0').trigger('focus');   
    }

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
      this.OtherCharges = this.subTotal * (this.serviceCharges / 100);
    }
    this.netTotal = (this.subTotal + parseFloat(this.OtherCharges)) - parseFloat(this.billDiscount);

    this.change = (this.cash + this.bankCash) - this.netTotal;
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
      var index = this.tableData.findIndex((e: any) => e.recipeID == item.recipeID);
      // console.log(index);
      // alert( index)
      //if(index !== -1){
      //   this.tableData[index].quantity = parseFloat( this.tableData[index].quantity +1 ); 
      // }else{

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
      // this.tableData.push({recipeID:item.recipeID,recipeTitle:item.recipeTitle,quantity:qty,recipeSalePrice:item.recipeSalePrice});

      // }
      this.getTotal();
    }
    this.tempProdRow = [];
  }


  /////////////////////////////////////////////////////////////////

  save(type: any) {

    if (this.orderType == 'Dine In' && (this.tableID == 0 || this.tableID == undefined)) {
      this.msg.WarnNotify('Select Table')
    } else if (this.orderType == '' || this.orderType == undefined) {
      this.msg.WarnNotify('Select Order Type')
    } else if (this.tableData == '' || this.tableData == undefined) {
      this.msg.WarnNotify('One Product must be Entered')
    } else if (this.paymentType == 'Split' && ((this.cash + this.bankCash) > this.netTotal || (this.cash + this.bankCash) < this.netTotal)) {
      this.msg.WarnNotify('Amount in Not Valid')
    } else if (this.paymentType == 'Cash' && (this.cash < this.netTotal)) {
      this.msg.WarnNotify('Enter Valid Amount')
    } else if (this.paymentType == 'Bank' && (this.bankCash < this.netTotal)) {
      this.msg.WarnNotify('Enter Valid Amount')
    }
    else {

      if (this.billDiscount == '' || this.billDiscount == undefined || this.billDiscount == null) {
        this.billDiscount = 0;
      }

      if (this.OtherCharges == '' || this.OtherCharges == undefined || this.OtherCharges == null) {
        this.OtherCharges = 0;
      }



      if (type == 'hold') {
        this.app.startLoaderDark()
        this.http.post(environment.mainApi + this.global.restaurentLink + 'InsertHold', {
          InvDate: this.global.dateFormater(this.invoiceDate, '-'),
          TableID: this.tableID,
          PartyID: this.PartyID,
          InvType: "HS",
          ProjectID: this.ProjectID,
          BookerID: this.BookerID,
          PaymentType: this.paymentType,
          Remarks: this.billRemarks,
          OrderType: this.orderType,
          CoverOf: this.coverOf,

          SaleDetail: JSON.stringify(this.tableData),

          UserID: this.global.getUserID()
        }).subscribe(
          (Response: any) => {
            if (Response.msg == 'Data Saved Successfully') {
              this.msg.SuccessNotify(Response.msg);
              this.getTable()
              this.onCatSelected(this.categoriesList[0]);
              this.reset();
              this.getHoldBills();

            } else {
              this.msg.WarnNotify(Response.msg);
            }
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
          BookerID: this.BookerID,
          PaymentType: this.paymentType,
          Remarks: this.billRemarks,
          OrderType: this.orderType,
          CoverOf: this.coverOf,

          SaleDetail: JSON.stringify(this.tableData),

          UserID: this.global.getUserID()
        }).subscribe(
          (Response: any) => {
            if (Response.msg == 'Data Updated Successfully') {
              this.msg.SuccessNotify(Response.msg);
              this.getTable()
              this.reset();
              this.getHoldBills();

            } else {
              this.msg.WarnNotify(Response.msg);
            }
            this.app.stopLoaderDark();
          }
        )


      }

      if (type == 'sale') {



        if (this.paymentType == 'Complimentary') {


          this.global.openPinCode().subscribe(pin => {
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

  //////////////////////////////////////////////////////////////////

  InsertSale() {
    this.app.startLoaderDark()
    this.http.post(environment.mainApi + this.global.restaurentLink + 'InsertSale', {
      HoldInvNo: this.invBillNo,
      OrderNo: this.orderNo,
      InvDate: this.global.dateFormater(this.invoiceDate, '-'),
      TableID: this.tableID,
      TmpTableID: this.prevTableID,
      PartyID: this.PartyID,
      InvType: "S",
      ProjectID: this.ProjectID,
      BookerID: this.BookerID,
      PaymentType: this.paymentType,
      Remarks: this.billRemarks,
      OrderType: this.orderType,
      CoverOf: this.coverOf,

      BillTotal: this.subTotal,
      BillDiscount: this.billDiscount,
      OtherCharges: this.OtherCharges,
      NetTotal: this.netTotal,
      CashRec: this.cash,
      Change: this.change,
      BankCoaID: this.bankCoaID,
      BankCash: this.bankCash,

      SaleDetail: JSON.stringify(this.tableData),
      UserID: this.global.getUserID()
    }).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully') {
          console.log(Response);
          this.msg.SuccessNotify(Response.msg);
          // this.printbill('save')

          this.printAfterSave(Response.invNo);
          this.getTable();
          this.onCatSelected(this.categoriesList[0]);
          this.getHoldBills();
          this.reset();
          /////////// will hide the modal window ///////////
          $('#paymentMehtod').hide();
          $('.modal-backdrop').remove();

        } else {
          this.msg.WarnNotify(Response.msg);
        }
        this.app.stopLoaderDark();
      }
    )
  }

  /////////////////////////////////////////////////////////////////

  getHoldBills() {


    this.http.get(environment.mainApi + this.global.restaurentLink + 'GetHoldBills').subscribe(
      (Response: any) => {
        this.holdBillList = Response;
        //  console.log(Response);
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
        // console.log(Response);
        this.tableData = [];

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
        // console.log(this.tableData);


      }
    )


  }

  ///////////////////////////////////////////////////////////////

  deleteRow(item: any) {
    if (item.entryType == 'New') {
      var index = this.tableData.indexOf(item);
      this.tableData.splice(index, 1);
      this.getTotal();
    }


    if (item.entryType == 'Saved') {
      if (this.tableData.length == 1 && item.quantity <= 1) {
        this.voidBill();
      } else {
        this.global.openPinCode().subscribe(pin => {
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
                    Quantity: 1,
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
                        if (item.quantity <= 1) {
                          var index = this.tableData.indexOf(item);
                          this.tableData.splice(index, 1);
                        } else {
                          item.quantity -= 1;
                        }
                        this.getTotal()

                      } else {
                        this.msg.WarnNotify(Response.msg);
                      }
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


  ///////////////////////////////////////////////////////////////

  changeQty(type: any, index: any) {
    this.tempIndex = index;

    if (type == 'add') {

      this.tableData[index].quantity = (parseFloat(this.tableData[index].quantity) + 1);

    }
    if (type == 'minus') {
      if (this.tableData[index].quantity > 1) {
        this.tableData[index].quantity = (parseFloat(this.tableData[index].quantity) - 1);
      }


    }

    this.getTotal();
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
    this.BookerID = 1;
    this.ProjectID = this.global.InvProjectID;
    this.PartyID = 0;
    this.invoiceDate = new Date();
    this.orderType = '';
    this.paymentType = '';
    this.cash = 0;
    this.bankCash = 0;

    this.tableID = 0;
    this.tempTableID = 0;
    this.prevTableID = 0;
    this.tempOrderType = '';
    this.tableTitle = '';
    this.tempProdRow = [];
    this.tempQty = 0;
    this.tempIndex = 0;
    this.tableData = [];
    this.subTotal = 0;
    this.netTotal = 0;
    this.tempRecipeList = [];
    this.holdbtnType = 'hold';
    this.getBankList();

  }



  myPrintData: any = [];
  myInvoiceNo = '';
  mytableNo = '';
  myCounterName = '';
  myInvDate: Date = new Date();
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


  printAfterSave(invNo: any) {
    this.myInvoiceNo = invNo;
    this.mytableNo = this.tableTitle;
    this.myInvDate = this.invoiceDate;
    this.myOrderType = this.orderType;
    this.mySubTotal = this.subTotal;
    this.myNetTotal = this.netTotal;
    this.myOtherCharges = this.OtherCharges;
    this.myRemarks = this.billRemarks;
    this.myCash = this.cash;
    this.myBank = this.bankCash;
    this.myDiscount = this.billDiscount;
    this.myChange = this.change;
    this.myPaymentType = this.paymentType;
    this.myPrintData = this.tableData;

    // this.http.get(environment.mainApi+this.global.restaurentLink+'GetHoldedBillDetail?BillNo='+invNo).subscribe(
    //   (Response:any)=>{
    //    console.log(Response);
    //     this.myPrintData =Response;})

    setTimeout(() => {
      this.global.printData('#billPrint');
    }, 200);



  }

  printbill(type: any) {


    if (this.invBillNo != '') {
      this.myInvoiceNo = this.invBillNo;
      this.myPrintData = this.tableData;
      this.mytableNo = this.tableTitle;
      this.myInvDate = this.invoiceDate;
      this.myOrderType = this.orderType;
      this.mySubTotal = this.subTotal;
      this.myNetTotal = this.netTotal;
      this.myOtherCharges = this.OtherCharges;
      this.myRemarks = this.billRemarks;
      this.myCash = this.cash;
      this.myBank = this.bankCash;
      this.myDiscount = this.billDiscount;
      this.myChange = this.change;
      this.myPaymentType = this.paymentType;

      if (type == 'rehold') {
        this.save('rehold');
      }


      setTimeout(() => {
        this.global.printData('#billPrint');
      }, 200);
    } else {
      this.msg.WarnNotify('No Bill Retrieved')
    }


  }


  ////////////////////////////////////////////////////////////

  verifyDiscount(disc: any,) {
    if (this.tableData != '') {
      this.global.openPinCode().subscribe(pin => {
        if (pin !== '') {
          this.http.post(environment.mainApi + this.global.userLink + 'MatchPassword', {
            RestrictionCodeID: 2,
            Password: pin,
            UserID: this.global.getUserID()

          }).subscribe(
            (Response: any) => {
              if (Response.msg == 'Password Matched Successfully') {
                this.billDiscount = disc;
              } else {
                this.msg.WarnNotify(Response.msg);
              }
            }
          )
        }
      })
    }
  }
  /////////////////////////////////////////////////


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
          this.global.openPinCode().subscribe(pin => {
            if (pin !== '') {
              this.http.post(environment.mainApi + this.global.userLink + 'MatchPassword', {
                RestrictionCodeID: 1,
                Password: pin,
                UserID: this.global.getUserID()

              }).subscribe(
                (Response: any) => {
                  if (Response.msg == 'Password Matched Successfully') {

                    this.http.post(environment.mainApi + this.global.restaurentLink + 'InsertVoidFullBill', {
                      InvBillNo: this.invBillNo,
                      TableID: this.tableID,
                      TmpTableID: this.tableID,
                      SaleDetail: JSON.stringify(this.tableData),
                      UserID: this.global.getUserID()
                    }).subscribe(
                      (Response: any) => {
                        console.log(Response)
                        if (Response.msg == 'Data Saved Successfully') {
                          this.msg.SuccessNotify('Bill Void');
                          this.getTotal();
                          this.reset();
                          this.getHoldBills();

                        } else {
                          this.msg.WarnNotify(Response.msg);
                        }
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

}
