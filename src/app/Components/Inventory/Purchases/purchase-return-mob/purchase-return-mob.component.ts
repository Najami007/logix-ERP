import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, retry } from 'rxjs';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../../../User/pincode/pincode.component';

import * as $ from 'jquery';
import Swal from 'sweetalert2';
import { AddpartyComponent } from '../../../Company/party/addparty/addparty.component';
import { ProductModalComponent } from '../../Sale/SaleComFiles/product-modal/product-modal.component';
import { PurchaseBillPrintComponent } from '../purchase-bill-print/purchase-bill-print.component';
import { renderHidden } from 'highcharts/highcharts.src';

@Component({
  selector: 'app-purchase-return-mob',
  templateUrl: './purchase-return-mob.component.html',
  styleUrls: ['./purchase-return-mob.component.scss']
})
export class PurchaseReturnMobComponent implements OnInit {

  @ViewChild(PurchaseBillPrintComponent) billPrint: any;

  companyProfile: any = [];
  crudList: any = { c: true, r: true, u: true, d: true };
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
    });




  }


  ngOnInit(): void {
    this.global.setHeaderTitle('Purchase Return');

    this.getSuppliers();
    $('.searchProduct').trigger('focus');

    this.getProducts();
    this.global.getBookerList().subscribe((data: any) => { this.BookerList = data; });
    this.global.getWarehouseLocationList().subscribe((data: any) => { this.locationList = data; });

  }


  getProducts() {
    this.global.getProducts().subscribe(
      (data: any) => { this.productList = data; });
  }
  hideTotalFlag = true;
  productName = '';

  holdBtnType: any = 'Hold';
  tabIndex: any;
  Date: Date = new Date()
  productImage: any;
  projectID = this.global.getProjectID();
  PBarcode: string = '';   /// for Search barcode field
  productsData: any;   //// for showing the products
  tableDataList: any = [];
  productDetail: any = [];            //////will hold data temporarily
  suppliersList: any;      //////  will shows the supplier list
  supplierDetail: any = [];

  myTotalQty: any = 0;
  subTotal = 0;

  myDue: any;
  holdBillList: any = [];

  refInvNo: any;
  invRemarks: any;
  locationID: any;
  overHead: any = 0;
  discount: any = 0;
  holdInvNo: any = '-';
  bookerID: any = 0;


  change() {

  }

  sortType = 'desc';

  currentPartyAddress: any;  /////////// will shows the current party address on page
  currentPartyCity: any;      /////////// will shows the current party City on page
  currentPartyMobile: any;   /////////// will shows the current party Mobile on page
  currentPartyCNIC: any;     /////////// will shows the current party CNIC on page


  partyID: any;               /////// will get the party id for Api
  invoiceDate = new Date;    //////////// invoice date for api



  productList: any = [];
  locationList: any = [];
  BookerList: any = [];


  changeOrder() {
    this.sortType = this.sortType == 'desc' ? 'asc' : 'desc';
    this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);

  }


  /////// to change the tab on edit

  changeTab(tabNum: any) {
    this.tabIndex = tabNum;

  }

  hide(type: any) {

    if (type == 'hide') {
      $('#totalRow').hide(500);
      setTimeout(() => {
        this.hideTotalFlag = false;
      }, 400);

    }

    if (type == 'unhide') {
      $('#totalRow').show(500);
      setTimeout(() => {
        this.hideTotalFlag = true;
      }, 500);
    }



  }



  getSuppliers() {
    this.global.getSupplierList().subscribe((data: any) => { this.suppliersList = data; });

  }

  searchByCode(e: any) {

    if (this.PBarcode !== '') {
      if (e.keyCode == 13) {

        // this.app.startLoaderDark();
        this.global.getProdDetail(0, this.PBarcode).subscribe(
          (Response: any) => {

            if (Response == '') {
              this.msg.WarnNotify('Product Not Found')
            } else {

              var condition = this.tableDataList.find(
                (x: any) => x.ProductID == Response[0].productID
              );

              var index = this.tableDataList.indexOf(condition);

              if (condition == undefined) {

                this.tableDataList.push({
                  rowIndex: this.tableDataList.length == 0 ? this.tableDataList.length + 1
                    : this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1
                      : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
                  ProductID: Response[0].productID,
                  ProductTitle: Response[0].productTitle,
                  barcode: Response[0].barcode,
                  productImage: Response[0].productImage,
                  Quantity: 0,
                  wohCP: Response[0].costPrice,
                  CostPrice: Response[0].costPrice,
                  SalePrice: Response[0].salePrice,
                  ovhPercent: 0,
                  ovhAmount: 0,
                  ExpiryDate: this.global.dateFormater(new Date(), '-'),
                  BatchNo: '-',
                  BatchStatus: '-',
                  UomID: Response[0].uomID,
                  Packing: 1,
                  discInP: 0,
                  discInR: 0,
                  AQ: Response[0].aq,


                });

                this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
                this.getTotal();


                this.productImage = Response[0].productImage;

              } else {
                // this.tableDataList[index].Quantity = parseFloat(this.tableDataList[index].Quantity) + 1;
                // this.tableDataList[index].rowIndex = this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1 : this.tableDataList[this.tableDataList.length -1].rowIndex + 1 ;


                this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
                this.msg.WarnNotify('Product Already Exist in Table')
                this.productImage = this.tableDataList[index].productImage;
              }



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


    var condition = this.tableDataList.find(
      (x: any) => x.ProductID == data.productID
    );

    var index = this.tableDataList.indexOf(condition);



    if (condition == undefined) {

      this.app.startLoaderDark();

      this.global.getProdDetail(data.productID, '').subscribe(
        (Response: any) => {



          this.tableDataList.push({
            rowIndex: this.tableDataList.length == 0 ? this.tableDataList.length + 1
              : this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1
                : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
            ProductID: Response[0].productID,
            ProductTitle: Response[0].productTitle,
            barcode: Response[0].barcode,
            productImage: Response[0].productImage,
            Quantity: 0,
            wohCP: Response[0].costPrice,
            CostPrice: Response[0].costPrice,
            SalePrice: Response[0].salePrice,
            ovhPercent: 0,
            ovhAmount: 0,
            ExpiryDate: this.global.dateFormater(new Date(), '-'),
            BatchNo: '-',
            BatchStatus: '-',
            UomID: Response[0].uomID,
            Packing: 1,
            discInP: 0,
            discInR: 0,
            AQ: Response[0].aq,

          });

          this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
          this.getTotal();


          this.productImage = Response[0].productImage;
        }
      )
    } else {
      // this.tableDataList[index].Quantity = parseFloat(this.tableDataList[index].Quantity) + 1;
      // this.tableDataList[index].rowIndex = this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1 : this.tableDataList[this.tableDataList.length -1].rowIndex + 1 ;
      this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
      this.msg.WarnNotify('Product Already Exist in Table')
      this.productImage = this.tableDataList[index].productImage;
    }
    this.app.stopLoaderDark();
    this.productName = '';
    this.getTotal();
    this.global.closeBootstrapModal('#prodModal', true);
    setTimeout(() => {
      $('#psearchProduct').trigger('focus');
    }, 500);

  }



  searchProductByName() {
    this.global.openBootstrapModal('#prodModal', true, true);

    setTimeout(() => {
      $('#prodName').trigger('select');
      $('#prodName').trigger('focus');
    }, 500);

  }



  netTotal = 0;
  getTotal() {
    this.subTotal = 0;
    this.myTotalQty = 0;
    this.netTotal = 0;

    if (this.discount == '') {
      this.discount = 0;
    }
    if (this.overHead == '') {
      this.overHead = 0;
    }
    for (var i = 0; i < this.tableDataList.length; i++) {
      this.subTotal += (parseFloat(this.tableDataList[i].Quantity) * parseFloat(this.tableDataList[i].CostPrice));
      this.myTotalQty += parseFloat(this.tableDataList[i].Quantity);
    }
    this.netTotal = (this.subTotal + parseFloat(this.overHead)) - parseFloat(this.discount)

  }

  delRow(item: any) {
    this.global.confirmAlert().subscribe(
      (Response: any) => {
        if (Response == true) {

          var index = this.tableDataList.indexOf(item);
          this.tableDataList.splice(index, 1);
          this.getTotal();

          if (index == 0) {
            $('#psearchProduct').trigger('select');
            $('#psearchProduct').trigger('focus');
          } else {
            this.rowFocused = index - 1;
            $('.qty' + this.rowFocused).trigger('select');
            $('.qty' + this.rowFocused).trigger('focus');
          }
        }
      }
    )



  }




  showImg(item: any) {
    var index = this.tableDataList.findIndex((e: any) => e.ProductID == item.ProductID);
    this.productImage = this.tableDataList[index].productImage;
  }


  focusto(cls: any, e: any) {

    if (cls == '#prodName') {
      setTimeout(() => {
        e.preventDefault();
        $(cls).trigger('select');
        $(cls).trigger('focus');
      }, 500);
    }

    if (cls == 'ovhd' && e.keyCode == 13) {
      if (e.target.value == '') {
        e.preventDefault();
        $('#ovhd').trigger('select')
        $('#ovhd').trigger('focus')
      }
    }

    if (cls == 'disc' && e.keyCode == 13) {
      e.preventDefault();
      $('#disc').trigger('select')
      $('#disc').trigger('focus');
    }

    if (cls == 'savebtn' && e.keyCode == 13) {
      e.preventDefault();
      $('#savebtn').trigger('focus');
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
          //  e.which = 9;   
          //  $('.qty0').trigger(e) ; 

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
          //  e.which = 9;   
          //  $(clsName).trigger(e)       
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


  changeValue(item: any) {
    var myIndex = this.tableDataList.indexOf(item);

    var myQty = this.tableDataList[myIndex].Quantity;
    var myCP = this.tableDataList[myIndex].CostPrice;
    var mySP = this.tableDataList[myIndex].SalePrice;
    if (myCP == null || myCP == '' || myCP == undefined) {

      this.tableDataList[myIndex].CostPrice = 0;
    } else if (myQty == null || myQty == '' || myQty == undefined) {
      this.tableDataList[myIndex].Quantity = 0;
    } else if (mySP == null || mySP == '' || mySP == undefined) {
      this.tableDataList[myIndex].SalePrice = 0;
    }
  }

  handleUpdown(item: any, e: any, cls: string, index: any) {
    const container = $(".table-logix");
    ////////// focusing to product search
    if (e.keyCode == 13) {
      e.preventDefault();
      $('#psearchProduct').trigger('select');
      $('#psearchProduct').trigger('focus');
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





  onPartySelected() {
    this.supplierDetail = this.suppliersList.find((e: any) => e.partyID == this.partyID);

  }

  @ViewChild('supplier') myParty: any;
  addParty() {
    setTimeout(() => {
      this.myParty.close()
    }, 200);
    this.dialogue.open(AddpartyComponent, {
      width: "50%"
    }).afterClosed().subscribe(value => {
      if (value == 'Update') {
        this.getSuppliers();
      }
    });
  }




  validFlag = true;

  SaveBill(type: any) {
    var inValidCostProdList = this.tableDataList.filter((p: any) => Number(p.CostPrice) > Number(p.SalePrice) || p.CostPrice == 0 || p.CostPrice == '0' || p.CostPrice == '' || p.CostPrice == undefined || p.CostPrice == null);
    var inValidSaleProdList = this.tableDataList.filter((p: any) => p.SalePrice == 0 || p.SalePrice == '0' || p.SalePrice == '' || p.SalePrice == undefined || p.SalePrice == null);
    var inValidQtyProdList = this.tableDataList.filter((p: any) => p.Quantity == 0 || p.Quantity == '0' || p.Quantity == null || p.Quantity == undefined || p.Quantity == '')
    if (inValidCostProdList.length > 0) {
      this.msg.WarnNotify('(' + inValidCostProdList[0].ProductTitle + ') Cost Price greater than Sale Price');
      return;
    }
    if (inValidSaleProdList.length > 0) {
      this.msg.WarnNotify('(' + inValidSaleProdList[0].ProductTitle + ') Sale Price is not Valid');
      return;
    }
    if (inValidQtyProdList.length > 0) {
      this.msg.WarnNotify('(' + inValidQtyProdList[0].ProductTitle + ') Quantity is not Valid');
      return;
    }



    if (this.tableDataList == '') {
      this.msg.WarnNotify('Atleast One Product Must Be Selected')
    } else if (this.locationID == '' || this.locationID == undefined || this.locationID == 0) {
      this.msg.WarnNotify('Select Warehouse Location')
    } else if (this.bookerID == 0 || this.bookerID == undefined) {
      this.msg.WarnNotify("Select Purchaser")
    } else if (this.refInvNo == '' || this.refInvNo == undefined) {
      this.msg.WarnNotify('Enter Reference Invoice No')
    } else if (this.partyID == '' || this.partyID == 0 || this.partyID == undefined) {
      this.msg.WarnNotify('Select Supplier Party')
    } else {


      if (this.discount == '' || this.discount == undefined) {
        this.discount = 0;
      }
      if (this.overHead == '' || this.overHead == undefined) {
        this.overHead = 0;
      }
      if (this.invRemarks == '' || this.invRemarks == undefined) {
        this.invRemarks = '-';
      }

      if (this.validFlag == true)
        this.validFlag = false; {
        if (type == 'hold') {
          if (this.holdBtnType == 'Hold') {
            this.app.startLoaderDark();
            this.http.post(environment.mainApi + this.global.inventoryLink + 'InsertMobileShopPurchaseRtn', {
              InvType: "HPR",
              InvDate: this.global.dateFormater(this.invoiceDate, '-'),
              RefInvoiceNo: this.refInvNo,
              PartyID: this.partyID,
              LocationID: this.locationID,
              ProjectID: this.projectID,
              BookerID: this.bookerID,
              BillTotal: this.subTotal,
              BillDiscount: this.discount,
              OverHeadAmount: this.overHead,
              NetTotal: this.subTotal - this.discount,
              Remarks: this.invRemarks,
              InvoiceDocument: "-",
              ProductDetail: JSON.stringify(this.productDetail),
              InvDetail: JSON.stringify(this.tableDataList),

              UserID: this.global.getUserID()
            }).subscribe(
              (Response: any) => {
                if (Response.msg == 'Data Saved Successfully') {
                  this.msg.SuccessNotify(Response.msg);
                  this.reset();
                  this.app.stopLoaderDark();

                } else {
                  this.msg.WarnNotify(Response.msg);
                  this.app.stopLoaderDark();
                }
                this.validFlag = true;
              },
              (Error: any) => {
                this.msg.WarnNotify(Error);
                this.app.stopLoaderDark();
                this.validFlag = true;
              }
            )
          } else if (this.holdBtnType == 'ReHold') {
            this.global.openPinCode().subscribe(pin => {
              if (pin != '') {
                this.app.startLoaderDark();

                this.http.post(environment.mainApi + this.global.inventoryLink + 'UpdateHoldInvoice', {
                  InvBillNo: this.holdInvNo,
                  InvDate: this.global.dateFormater(this.invoiceDate, '-'),
                  RefInvoiceNo: this.refInvNo,
                  PartyID: this.partyID,
                  LocationID: this.locationID,
                  ProjectID: this.projectID,
                  BookerID: this.bookerID,
                  BillTotal: this.subTotal,
                  BillDiscount: this.discount,
                  OverHeadAmount: this.overHead,
                  NetTotal: this.subTotal - this.discount,
                  Remarks: this.invRemarks,
                  InvoiceDocument: "-",
                  PinCode: pin,
                  InvDetail: JSON.stringify(this.tableDataList),

                  UserID: this.global.getUserID()
                }).subscribe(
                  (Response: any) => {
                    if (Response.msg == 'Data Updated Successfully') {
                      this.msg.SuccessNotify(Response.msg);
                      this.reset();
                      this.app.stopLoaderDark();

                    } else {
                      this.msg.WarnNotify(Response.msg);
                      this.app.stopLoaderDark();
                    }
                    this.validFlag = true;
                  },
                  (Error: any) => {
                    this.msg.WarnNotify(Error);
                    this.app.stopLoaderDark();
                    this.validFlag = true;
                  }
                )
              }
            })
          }

        } else if (type == 'purchase') {

          this.global.confirmAlert().subscribe(
            (Response: any) => {
              if (Response == true) {
                this.app.startLoaderDark();
                this.http.post(environment.mainApi + this.global.inventoryLink + 'InsertMobileShopPurchaseRtn', {
                  InvType: "PR",
                  InvDate: this.global.dateFormater(this.invoiceDate, '-'),
                  RefInvoiceNo: this.refInvNo,
                  PartyID: this.partyID,
                  LocationID: this.locationID,
                  ProjectID: this.projectID,
                  BookerID: this.bookerID,
                  BillTotal: this.subTotal,
                  BillDiscount: this.discount,
                  OverHeadAmount: this.overHead,
                  NetTotal: this.subTotal - this.discount,
                  Remarks: this.invRemarks,
                  InvoiceDocument: "-",
                  HoldInvNo: this.holdInvNo,
                  ProductDetail: JSON.stringify(this.productDetail),

                  InvDetail: JSON.stringify(this.tableDataList),

                  UserID: this.global.getUserID()
                }).subscribe(
                  (Response: any) => {
                    if (Response.msg == 'Data Saved Successfully') {
                      this.msg.SuccessNotify(Response.msg);
                      this.reset();
                      this.app.stopLoaderDark();

                    } else {
                      this.msg.WarnNotify(Response.msg);
                      this.app.stopLoaderDark();
                    }
                    this.validFlag = true;
                  },
                  (Error: any) => {
                    this.msg.WarnNotify(Error);
                    this.app.stopLoaderDark();
                    this.validFlag = true;
                  }
                )
              }
            })
        }

      }



    }



  }


  reset() {
    this.PBarcode = '';
    this.invoiceDate = new Date();
    this.tableDataList = [];
    this.productDetail = [];
    this.tmpProdDetial = [];
    this.locationID = 0;
    this.refInvNo = '';
    this.discount = 0;
    this.overHead = 0;
    this.invRemarks = '';
    this.subTotal = 0;
    this.productImage = '';
    this.partyID = 0;
    this.myTotalQty = 0;
    this.holdInvNo = '-';
    this.bookerID = 0;
    this.invRemarks = '';
    this.holdBtnType = 'Hold';
    this.holdBillList = [];
    this.supplierDetail = [];
    this.netTotal = 0;

    
  }


  distributeOverHead() {
    var amount = this.overHead / this.myTotalQty;
    for (var i = 0; i < this.tableDataList.length; i++) { this.tableDataList[i].CostPrice = parseFloat(this.tableDataList[i].wohCP) + amount }
    this.getTotal();
  }

  myInvoiceNo: any;
  myInvoiceDate: any;
  myLocation: any;
  myRefInvNo: any;
  mydiscount: any;
  myOverHeadAmount: any;
  myInvRemarks: any;
  myBookerName: any;
  myPartyName: any;
  mySubTotal: any;
  myTableDataList: any = [];
  myBillTotalQty = 0;
  mywohCPTotal = 0;
  myWCPTotal = 0;
  myCPTotal = 0;
  mySPTotal = 0;
  myBillStatus = false;


  printBill(item: any) {
    this.billPrint.printBill(item);

  }

  retriveBill(item: any) {

    this.tableDataList = [];
    this.holdBtnType = 'ReHold'
    this.invoiceDate = new Date(item.invDate);
    this.locationID = item.locationID;
    this.refInvNo = item.refInvoiceNo;
    this.discount = item.billDiscount;
    this.overHead = item.overHeadAmount;
    this.invRemarks = item.remarks;
    this.holdInvNo = item.invBillNo;
    this.bookerID = item.bookerID;
    this.partyID = item.partyID;
    this.subTotal = item.billTotal;
    this.onPartySelected();

    this.getBillDetail(item.invBillNo).subscribe(
      (Response: any) => {
        var totalQty = 0;
        this.productImage = Response[Response.length - 1].productImage;

        Response.forEach((e: any) => {
          this.myTotalQty += e.quantity;
          this.tableDataList.push({
            rowIndex: this.tableDataList.length + 1,
            ProductID: e.productID,
            ProductTitle: e.productTitle,
            barcode: e.barcode,
            productImage: e.productImage,
            Quantity: e.quantity,
            wohCP: e.costPrice,
            CostPrice: e.costPrice,
            SalePrice: e.salePrice,
            ExpiryDate: this.global.dateFormater(new Date(e.expiryDate), '-'),
            BatchNo: e.batchNo,
            BatchStatus: e.batchStatus,
            UomID: e.uomID,
            Packing: e.packing,
            discInP: e.discInP,
            discInR: e.discInR,
            AQ: e.aq,
          })
        });

        //////////sorting data table base on sort type
        this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);

        // this.getTotal();

      }
    )

  }


  public getBillDetail(billNo: any): Observable<any> {
    return this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSingleBillDetail?reqInvBillNo=' + billNo).pipe(retry(3));
  }



  findHoldBills(type: any) {
    if (type == 'hpr') {
      $('#edit').show();
    }

    if (type == 'pr') {
      $('#edit').hide()
    }

    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetInventoryBillSingleDate?Type=' + type + '&creationdate=' + this.global.dateFormater(this.Date, '-')).subscribe(
      (Response: any) => {
        this.holdBillList = [];

        if (type == 'hpr') {
          Response.forEach((e: any) => {
            if (e.approvedStatus == false) {
              this.holdBillList.push(e);
            }
          });
        }
        if (type == 'pr') {
          this.holdBillList = Response;
        }
      }
    )
  }


  emptyBill() {
    if (this.tableDataList != '') {
      this.global.confirmAlert().subscribe(
        (Response: any) => {
          if (Response == true) {

            this.reset();
          }
        })
    }
  }


  addProdDetail(item: any) {
    this.global.openBootstrapModal('#ProdDetailModal', true);
    this.tmpProdDetial = item;

    setTimeout(() => {
      $('#prodOthDetDesc').trigger('focus');
    }, 500);
  }



  tmpProdDetial: any = [];
  tmpProductOtherDetDescription = '';

  onEnterPressed(e: any) {
    if (e.keyCode == 13) {
      this.insertProdDetail(this.tmpProductOtherDetDescription);
    }

  }


  insertProdDetail(value: any) {

    if (value == '' || value == undefined) {
      this.msg.WarnNotify('Enter value');
    } else {
      // this.productDetail.push({ productID: this.tmpProdDetial.ProductID, productOtherDetDescription: value });
      var tmpRow = this.productDetail.find((e: any) => e.productOtherDetDescription == value);
      if (tmpRow == undefined) {
        ///////////////////pushing Detail into tmp Array ///////
        this.productDetail.push({ productID: this.tmpProdDetial.ProductID, productOtherDetDescription: value });
        ////////////////// Changing Qty ///////
        this.tmpProdDetial.Quantity = this.productDetail.filter((e: any) => e.productID == this.tmpProdDetial.ProductID).length;

        this.tableDataList.forEach((e: any) => {
          ////////////////// Assigning tmpProdDetial value to Maing TableDataLIst ///////
          if (e.productID == this.tmpProdDetial.productID) {
            e = this.tmpProdDetial;

          }
        });
        this.getTotal();
        this.tmpProductOtherDetDescription = '';

      } else {
        this.msg.WarnNotify('Already Exist!');
      }
      $('#prodOthDetDesc').trigger('focus');
      $('#prodOthDetDesc').trigger('select');

    }

  }

  editProdDetail(item: any) {

    this.tmpProductOtherDetDescription = item.productOtherDetDescription;

    this.deleteProdDetail(item);


  }


  deleteProdDetail(item: any) {

    var index = this.productDetail.indexOf(item);
    this.productDetail.splice(index, 1);
    this.tmpProdDetial.Quantity = this.productDetail.filter((e: any) => e.productID == this.tmpProdDetial.ProductID).length;
    this.getTotal();


  }



}
