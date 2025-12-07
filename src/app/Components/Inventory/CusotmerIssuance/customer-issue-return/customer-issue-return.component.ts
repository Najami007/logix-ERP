import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

import { Router } from '@angular/router';
import { Observable, retry } from 'rxjs';
import { AddpartyComponent } from 'src/app/Components/Company/party/addparty/addparty.component';
import Swal from 'sweetalert2';
import { AdjBillPrintComponent } from '../../InvAdjustment/adj-bill-print/adj-bill-print.component';
import { CustomerIssueBillPrintComponent } from '../customer-issue-bill-print/customer-issue-bill-print.component';

@Component({
  selector: 'app-customer-issue-return',
  templateUrl: './customer-issue-return.component.html',
  styleUrls: ['./customer-issue-return.component.scss']
})
export class CustomerIssueReturnComponent implements OnInit {

  @ViewChild(CustomerIssueBillPrintComponent) billPrint: any;

  crudList: any = { c: true, r: true, u: true, d: true };
  companyProfile: any = [];
  disableDateFeature = this.global.DisableInvDate;
  editSpFeature = this.global.editSpFeature;
  LessToCostFeature = this.global.LessToCostFeature;
  CTCCustomerIssuanceFeature = this.global.CTCCustomerIssuanceFeature;


  insertLocalStorageFeature = this.global.insertLocalStorageFeature;
    ImageUrlFeature = this.global.ImageUrlFeature;




  @HostListener('document:visibilitychange', [])

  appVisibility() {
    ////////////// restrict to save in localstorage///////
    if (!this.insertLocalStorageFeature) return;
    if (document.hidden) { } else { this.importFromLocalStorage(); }

    this.importFromLocalStorage();

  }

  

  @HostListener('document:keydown', ['$event'])

  handleKeyboardEventSearchByNaem(event: KeyboardEvent) {
    if (event.altKey && event.key.toLowerCase() === 'n') {
      this.byNameSearch = !this.byNameSearch;
      $('#vssearchProduct').trigger('focus');
    }
  }


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
    this.global.setHeaderTitle('Customer Issuance Return');
    this.getLocation();
    this.getPartyList();
    $('.searchProduct').trigger('focus');

    this.global.getProducts().subscribe(
      (data: any) => { this.productList = data; });
    this.importFromLocalStorage();

  }


  sortType = 'desc';

  btnType = 'Save';
  Date: Date = new Date();
  invBillNo = '-';
  holdBtnType = 'Hold';
  invoiceDate: Date = new Date();
  locationID = 0;
  locationList: any = [];
  invRemarks: any = '';
  PBarcode: any = '';
  productList: any = [];
  tableDataList: any = [];
  partyList: any = [];
  holdInvNo: any = '-';


  productImage: any;
  subTotal: number = 0;
  totalQty: number = 0;
  IssueBillList: any = [];

  salePriceTotal = 0;
  CostTotal = 0;

  projectID = this.global.getProjectID();
  bookerID = 1;
  partyID = 0;
  byNameSearch:any = false;


  changeOrder() {
    this.sortType = this.sortType == 'desc' ? 'asc' : 'desc';
    this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);

  }


  getLocation() {
    this.global.getWarehouseLocationList().subscribe((data: any) => { this.locationList = data; });
  }



  ////////////////////////////// getting list of Customer ///////
  getPartyList() {
    this.global.getCustomerList().subscribe((data: any) => { this.partyList = data; });
  }



  /////////////////// adding New Customer Shorcut ////////////////
  @ViewChild('party') myParty: any;
  addParty() {
    setTimeout(() => {
      this.myParty.close()
    }, 200);
    this.dialog.open(AddpartyComponent, {
      width: "50%"
    }).afterClosed().subscribe(value => {
      if (value == 'Update') {
        this.getPartyList();
      }
    });
  }





  ////////////////////// sarch Product By Barcode Funct //////////

  searchByCode(e: any) {

    var barcode = this.PBarcode;
    var qty: number = 1;
    var BType = '';

    if (this.PBarcode !== '') {
      if (e.keyCode == 13) {

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

        // this.app.startLoaderDark();
        this.global.getProdDetail(0, barcode).subscribe(
          (Response: any) => {


            if (Response == '' || Response == null || Response == undefined) {
              this.searchSpecialBarcode(barcode, qty); ////////// conditional Searching Special Barcode of Scale
              return;
            } else {
              if (BType == 'price') { qty = qty / parseFloat(Response[0].salePrice); }
              this.pushProdData(Response[0], qty); //////// pushing Product Detail
            }
          }
        )


        this.PBarcode = '';
        this.getTotal();
        $('#searchProduct').trigger('focus');

      }
    }
  }



  ///////////////////////// Enter Product Data by Product ID /////////
  holdDataFunction(data: any) {
    this.global.getProdDetail(data.productID, '').subscribe(
      (Response: any) => {
        this.pushProdData(Response[0], 1)
      }
    )

    this.app.stopLoaderDark();
    this.getTotal();
    this.PBarcode = '';
    setTimeout(() => {
      $('#searchProduct').trigger('focus');
    }, 500);

  }




  /////////////////////////////// Push Product Detail to TableData List Common Function ////////////////////
  pushProdData(data: any, qty: any) {

    /////// check already present in the table or not
    var condition = this.tableDataList.find(
      (x: any) => x.productID == data.productID
    );

    var index = this.tableDataList.indexOf(condition);

    if (condition == undefined) {

      this.tableDataList.push({
        rowIndex: this.tableDataList.length == 0 ? this.tableDataList.length + 1
          : this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1
            : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
        productID: data.productID,
        productTitle: data.productTitle,
        barcode: data.barcode,
        productImage: this.ImageUrlFeature ? data.imagesPath : '-',
        quantity: qty,
        wohCP: data.costPrice,
        avgCostPrice: data.avgCostPrice,
        costPrice: data.costPrice,
        salePrice: this.CTCCustomerIssuanceFeature ? data.costPrice : data.salePrice,
        ovhPercent: 0,
        ovhAmount: 0,
        expiryDate: this.global.dateFormater(new Date(), '-'),
        batchNo: '-',
        batchStatus: '-',
        uomID: data.uomID,
        et: data.et,
        packing: 1,
        aq: data.aq,
        productDetail: '',

      });

      //this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex);
      this.sortTableData();
      this.getTotal();
      this.productImage = data.productImage;




    } else {
      if (this.PBarcode.split("/")[1] != undefined) {
        qty = this.PBarcode.split("/")[1] / this.tableDataList[index].salePrice;
      }
      this.tableDataList[index].quantity = parseFloat(this.tableDataList[index].quantity) + qty;

      /////// Sorting Table
      this.tableDataList[index].rowIndex = this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1 : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1;
      this.sortTableData();
      this.productImage = this.tableDataList[index].productImage;
      this.getTotal();
    }

  }



  ///////////////// Search Special Barcode Function /////////

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
          //   rowIndex: this.tableDataList.length == 0 ? this.tableDataList.length + 1
          //     : this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1
          //       : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
          //   productID: Response[0].productID,
          //   productTitle: Response[0].productTitle,
          //   barcode: Response[0].barcode,
          //   productImage: Response[0].productImage,
          //   quantity: prodQty || 1,
          //   wohCP: Response[0].costPrice,
          //   avgCostPrice: Response[0].avgCostPrice,
          //   costPrice: Response[0].costPrice,
          //   //salePrice: (tmpPrice / Response[0].salePrice) || Response[0].salePrice,
          //   salePrice: tmpPrice || Response[0].salePrice,
          //   ovhPercent: 0,
          //   ovhAmount: 0,
          //   expiryDate: this.global.dateFormater(new Date(), '-'),
          //   batchNo: '-',
          //   batchStatus: '-',
          //   uomID: Response[0].uomID,
          //   gst: this.gstFeature ? Response[0].gst : 0,
          //   et: Response[0].et,
          //   packing: 1,
          //   discInP: this.discFeature ? Response[0].discPercentage : 0,
          //   discInR: this.discFeature ? Response[0].discRupees : 0,
          //   aq: Response[0].aq,
          //   total: (Response[0].salePrice * qty) - (Response[0].discRupees * qty),
          //   productDetail: '',

          // });
          // //this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex);
          // this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
          // this.getTotal();
          // this.productImage = Response[0].productImage;

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
        this.getTotal()
      }
    )


  }



  ///////////////// sorting Table Data List ///////////
  sortTableData() {
    this.sortType == 'desc'
      ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex)
      : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex)
  }




  ///////////////////////// Show Image Modal Function
  showImg(item: any) {

    // var index = this.tableDataList.findIndex((e: any) => e.productID == item.productID);
    // this.productImage = this.tableDataList[index].productImage;

       var index = this.tableDataList.findIndex((e: any) => e.productID == item.productID);
    !this.ImageUrlFeature
      ? this.getProductImage(item)
      : this.productImage = this.tableDataList[index].productImage;

  }

   getProductImage(item: any) {
      this.http.get(environment.mainApi + this.global.inventoryLink + 'GetProductImage?ProductID=' + item.productID).subscribe(
        (Response: any) => {
  
          this.productImage = Response[0].productImage;
  
          $('.loaderDark').fadeOut();
        }
      )
    }





  ///////////////////// Getting Total From Table Data List Common Funcion /////////

  getTotal() {
    this.subTotal = 0;
    this.totalQty = 0;
    this.CostTotal = 0;
    this.salePriceTotal = 0;
    for (var i = 0; i < this.tableDataList.length; i++) {

      this.subTotal += (Number(this.tableDataList[i].quantity) * Number(this.tableDataList[i].salePrice));
      this.totalQty += Number(this.tableDataList[i].quantity);
      this.CostTotal += (Number(this.tableDataList[i].quantity) * Number(this.tableDataList[i].costPrice));
      this.salePriceTotal += (Number(this.tableDataList[i].quantity) * Number(this.tableDataList[i].salePrice))
      // this.myTotal = this.mySubtoatal - this.myDiscount;
      // this.myDue = this.myPaid - this.myTotal;\
    }

    ////////////// restrict to save in localstorage///////
    if (!this.insertLocalStorageFeature) return;
    this.insertToLocalStorage();
  }




  /////////////////////////////////////////////
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



  //////////////////////////// handle Product List updown focus on key up down ///////////////
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

  //////////////////////////// handle Table Data List updown focus on key up down ///////////////
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




  //////////////////////////////// to delete a specific Row ////////////////
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



  //////////////////////// Save Bill Fucntion ////////////////////
  isValidSale = true;
  SaveBill(type: any) {


     var inValidCostProdList = this.tableDataList.filter((p: any) =>  isNaN(p.costPrice) || Number(p.costPrice) > Number(p.salePrice) || p.costPrice == 0 || p.costPrice == '0' || p.costPrice == '' || p.costPrice == undefined || p.costPrice == null);
    var inValidSaleProdList = this.tableDataList.filter((p: any) => isNaN(p.salePrice) || p.salePrice == 0 || p.salePrice == '0' || p.salePrice == '' || p.salePrice == undefined || p.salePrice == null);
    var inValidQtyProdList = this.tableDataList.filter((p: any) =>  isNaN(p.quantity) || p.quantity == 0 || p.quantity == '0' || p.quantity == null || p.quantity == undefined || p.quantity == '')
    var inValidDiscProdList = this.tableDataList.filter((p: any) => Number(p.costPrice) > (Number(p.salePrice) - (Number(p.discInR))));


    if (inValidCostProdList.length > 0) {
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



    if (this.tableDataList == '') {
      this.msg.WarnNotify('Atleast One Product Must Be Selected');
      return;
    }
    if (this.locationID == undefined || this.locationID == 0) {
      this.msg.WarnNotify('Select Warehouse Location');
      return;
    }

    if (this.partyID == undefined || this.partyID == 0) {
      this.msg.WarnNotify('Select Customer');
      return;
    }

    var postData = {
      InvType: 'RIC',
      InvBillNo: this.invBillNo,
      InvDate: this.global.dateFormater(this.invoiceDate, '-'),
      LocationID: this.locationID,
      ProjectID: this.projectID,
      BookerID: this.bookerID,
      BillTotal: this.subTotal,
      NetTotal: this.subTotal,
      Remarks: this.invRemarks || '-',
      PartyID: this.partyID,
      InvDetail: JSON.stringify(this.tableDataList),
      PinCode: '',
      UserID: this.global.getUserID(),
    }

    if (this.btnType == 'Save' && type == 'Save') {
      postData.InvType = 'RIC';
      this.insert('insert', postData);
    }

    if (this.holdBtnType == 'Hold' && type == 'hold') {
      postData.InvType = 'HRIC';
      this.insert('insert', postData);
    }

    if (this.holdBtnType == 'ReHold' && type == 'hold') {

      this.global.openPinCode().subscribe(pin => {
        if (pin != '') {
          postData.PinCode = pin;
          postData.InvType = 'HRIC';
          this.insert('update', postData);
        }
      })
    }
  }



  ///////////////// Insert Data to API ///////////////////////

  insert(type: any, postData: any) {

    if (!this.isValidSale) {
      return;
    }


    var url = '';
    if (type == 'insert') {
      url = 'InsertReturnIssueStockFromCustomer';
    }
    if (type == 'update') {
      url = 'UpdateHoldedIssueInvoice';
    }

    this.app.startLoaderDark();
    this.isValidSale = false;

    this.http.post(environment.mainApi + this.global.inventoryLink + url, postData).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.reset();

        } else {
          this.msg.WarnNotify(Response.msg);
        }
        this.app.stopLoaderDark();

        this.isValidSale = true
      },
      (Error: any) => {
        this.msg.WarnNotify(Error);
        this.app.stopLoaderDark();
        this.isValidSale = true
      }
    )



  }




  ////////////////////// reset Page Fields ///////////
  reset() {
    this.invoiceDate = new Date();
    this.locationID = 0;
    this.invRemarks = '';
    this.tableDataList = [];
    this.totalQty = 0;
    this.subTotal = 0;
    this.holdBtnType = 'Hold';
    this.btnType = 'Save';
    this.productImage = '';
    this.invBillNo = '-';
    this.IssueBillList = [];
    this.CostTotal = 0;
    this.salePriceTotal = 0;
    this.partyID = 0;
    this.invBillNo = '';
    this.holdInvNo = '-'
    this.removeLocalStorage();

  }



  //////////////////////////// Getting Saved Bill Function ///////////////////
  FindSavedBills(type: any) {
    if (type == 'HRIC') {
      $('#edit').show();
    }

    if (type == 'RIC') {
      $('#edit').hide()
    }

    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetIssueInventoryBillSingleDate?Type=' + type + '&creationdate=' + this.global.dateFormater(this.Date, '-')).subscribe(
      (Response: any) => {
        this.IssueBillList = [];
        if (type == 'HRIC') {
          Response.forEach((e: any) => {
            if (e.approvedStatus == false) {
              this.IssueBillList.push(e);
            }
          });
        }
        if (type == 'RIC') {
          this.IssueBillList = Response;
        }
      },
      (Error: any) => {
        this.msg.WarnNotify(Error);
      }
    )
  }



  printBill(item: any) {
    this.billPrint.printBill(item);
  }

  retriveBill(item: any) {
    this.tableDataList = [];
    this.holdBtnType = 'ReHold';
    this.invoiceDate = new Date(item.invDate);
    this.locationID = item.locationID;
    this.invRemarks = item.remarks;
    this.invBillNo = item.invBillNo;
    this.subTotal = item.billTotal;
    this.partyID = item.partyID;

    this.getBillDetail(item.invBillNo).subscribe(
      (Response: any) => {
        this.totalQty = 0;
        this.productImage = Response[Response.length - 1].productImage;


        Response.forEach((e: any) => {
          this.totalQty += e.quantity;
          this.tableDataList.push({
            rowIndex: this.tableDataList.length + 1,
            productID: e.productID,
            productTitle: e.productTitle,
            barcode: e.barcode,
            productImage: '-',
            quantity: e.quantity,
            avgCostPrice: e.avgCostPrice,
            costPrice: e.costPrice,
            salePrice: e.salePrice,
            expiryDate: this.global.dateFormater(new Date(e.expiryDate), '-'),
            batchNo: e.batchNo,
            batchStatus: e.batchStatus,
            uomID: e.uomID,
            packing: e.packing,
            discInP: e.discInP,
            discInR: e.discInR,
          })
        });

        //////////sorting data table base on sort type
        this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex)
          : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);

        this.getTotal();

      }
    )
  }


  public getBillDetail(billNo: any): Observable<any> {
    return this.http.get(environment.mainApi + this.global.inventoryLink + 'GetIssueSingleBillDetail?reqInvBillNo=' + billNo).pipe(retry(3));
  }


  ////////////////// Delete Holded Invoice Function ///////////////
  DeleteInv(row: any) {
    $('#holdModal').hide();
    this.global.openPinCode().subscribe(pin => {
      $('#holdModal').show();
      if (pin != '') {
        this.app.startLoaderDark();
        this.http.post(environment.mainApi + this.global.inventoryLink + 'DeleteBill', {
          InvBillNo: row.invBillNo,
          PinCode: pin,
          UserID: this.global.getUserID()
        }).subscribe(
          (Response: any) => {
            if (Response.msg == 'Data Deleted Successfully') {

              this.msg.SuccessNotify(Response.msg);
              this.FindSavedBills('HRIC');


            } else {
              this.msg.WarnNotify(Response.msg)
            }
            this.app.stopLoaderDark();

          },
          (Error: any) => {
            console.log(Error);
            this.app.stopLoaderDark();
          }
        )
      }
    })
  }



  //////////////////////// Empty Whole Bill Funciton //////////////

  EmptyData() {

    if (this.tableDataList.length == 0) return;


    this.global.confirmAlert().subscribe(
      (Response: any) => {
        if (Response == true) {
          this.reset();
        }
      })
  }




  ////////////////////////// To Edit Sale Price //////////////////
  editSP(item: any) {
    if (this.editSpFeature && this.crudList.u) {
      Swal.fire({
        title: "Enter Total Amount",
        input: "text",
        showCancelButton: true,
        confirmButtonText: 'Save',
        showLoaderOnConfirm: true,
        preConfirm: (value) => {

          if (!value || isNaN(value) || value <= 0) {
            return Swal.showValidationMessage("Enter Valid Amount");
          }
          const index = this.tableDataList.indexOf(item);
          if (value < this.tableDataList[index].costPrice && this.LessToCostFeature == false) {
            return Swal.showValidationMessage("Sale Price Is Less Then Cost Price");
          }

          this.tableDataList[index].salePrice = value;
          this.getTotal();
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



  /////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////


  removeLocalStorage() {
    localStorage.removeItem('tmpICRData');
    localStorage.removeItem('tmpICRLocationID');
    localStorage.removeItem('tmpICRInvoiceDate');
    localStorage.removeItem('tmpICRPartyID');
    localStorage.removeItem('tmpICRRemarks');
    localStorage.removeItem('tmpICRHoldINvNo')
    localStorage.removeItem('tmpICRHoldBtnType');
    localStorage.removeItem('tmpICRBookerID');


  }


  insertToLocalStorage() {
    this.removeLocalStorage();

    var prodData = JSON.stringify(this.tableDataList);
    localStorage.setItem('tmpICRData', prodData);

    var locationID = JSON.stringify(this.locationID);
    localStorage.setItem('tmpICRLocationID', locationID);

    var date = JSON.stringify(this.invoiceDate);
    localStorage.setItem('tmpICRInvoiceDate', date);



    var partyID = JSON.stringify(this.partyID);
    localStorage.setItem('tmpICRPartyID', partyID);

    var remarks = JSON.stringify(this.invRemarks);
    localStorage.setItem('tmpICRRemarks', remarks);

    var holdInvNo = JSON.stringify(this.holdInvNo);
    localStorage.setItem('tmpICRHoldINvNo', holdInvNo);

    var holdBtnType = JSON.stringify(this.holdBtnType);
    localStorage.setItem('tmpICRHoldBtnType', holdBtnType);



    var bookerID = JSON.stringify(this.bookerID);
    localStorage.setItem('tmpICRBookerID', bookerID);


  }

  importFromLocalStorage() {

    var data = JSON.parse(localStorage.getItem('tmpICRData') || '[]');



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

    this.invRemarks = JSON.parse(localStorage.getItem('tmpICRRemarks') || '');
    this.partyID = JSON.parse(localStorage.getItem('tmpICRPartyID') || '0');
    this.invoiceDate = JSON.parse(localStorage.getItem('tmpICRInvoiceDate') || '');
    this.locationID = JSON.parse(localStorage.getItem('tmpICRLocationID') || '0');
    this.holdInvNo = JSON.parse(localStorage.getItem('tmpICRHoldINvNo') || '');
    this.holdBtnType = JSON.parse(localStorage.getItem('tmpICRHoldBtnType') || 'Hold');
    this.bookerID = JSON.parse(localStorage.getItem('tmpICRBookerID') || '0');
    this.tableDataList = data;
    this.getTotal();

    // if (this.AuditInventoryID > 0) {
    //   this.holdBtnType = 'Rehold'
    // }



  }

}
