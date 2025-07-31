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
import { AddpartyComponent } from 'src/app/Components/Company/party/addparty/addparty.component';
import { SaleBillDetailComponent } from 'src/app/Components/Restaurant-Core/Sales/sale1/sale-bill-detail/sale-bill-detail.component';
import { SaleBillPrintComponent } from '../SaleComFiles/sale-bill-print/sale-bill-print.component';
import { PaymentMehtodComponent } from '../SaleComFiles/payment-mehtod/payment-mehtod.component';
import { EditQtyModalComponent } from './edit-qty-modal/edit-qty-modal.component';



@Component({
  selector: 'app-garment-sale',
  templateUrl: './garment-sale.component.html',
  styleUrls: ['./garment-sale.component.scss'],
})
export class GarmentSaleComponent implements OnInit {

  @ViewChild(SaleBillPrintComponent) billPrint: any;
  disableDate = this.global.DisableDateSale;
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

  postBillFeature = this.global.postSale;
  urduBillFeature = this.global.urduBill;
  disablePrintPwd = this.global.DisablePrintPwd;
  VehicleSaleFeature = this.global.VehicleSaleFeature;




  companyProfile: any = [];
  companyLogo: any = '';
  logoHeight: any = 0;
  logoWidth: any = 0;
  companyAddress: any = '';
  CompanyMobile: any = '';
  companyName: any = '';
  crudList: any = { c: true, r: true, u: true, d: true };


  mobileMask = this.global.mobileMask;

  constructor(
    private http: HttpClient,
    private msg: NotificationService,
    public global: GlobalDataModule,
    private dialog: MatDialog,
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
      this.logoHeight = data[0].logo1Height;
      this.logoWidth = data[0].logo1Width;
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
    this.global.setHeaderTitle('Sale');
    this.getBankList();
    this.getPartyList();
    this.getBooker();
    this.getVehicles();


    setTimeout(() => {
      $('#psearchProduct').trigger('focus');
    }, 200);


    this.getProducts();
    for (let i = 0; i <= 100; i++) { this.discountList.push({ value: i }); }



  }

  getProducts() {
    this.global.getProducts().subscribe(
      (data: any) => { this.productList = data; });
  }

  discountList: any = [];
  billDiscount: any = 0;

  applyDiscount() {

    this.tableDataList.forEach((e: any) => {
      e.discInP = this.billDiscount;
      e.discInR = (e.salePrice * this.billDiscount) / 100
    });
    this.getTotal();

  }


  tempProdData: any = [];


  sortType = 'desc';
  invoiceDate = new Date();
  partyID = 0;
  vehicleID = 0;
  meterReading = '';
  productList: any = [];
  projectID = this.global.getProjectID();

  tableDataList: any = [];
  tempTableDataList: any = [];
  InvDate = new Date();
  PBarcode: any = '';
  productImage = '';
  productName: any = '';
  discount: any = 0;
  offerDiscount: any = 0;
  cash: any = 0;
  change = 0;
  paymentType = 'Cash';
  bankCash: any = 0;
  bankCoaID = 0;
  billRemarks = '';
  otherCharges = 0;
  customerName = '';
  customerMobileno = '';
  bookerID = 0;
  AdvTaxValue = 0;
  AdvTaxAmount = 0;


  qtyTotal = 0;
  subTotal: any = 0;
  netTotal = 0;
  PosFee = this.global.POSFee;

  bankCoaList: any = [];
  partyList: any = [];
  bookerList: any = [];

  tmpCash = 0;
  tmpChange = 0;

  billPrintType: any = this.global.getBillPrintType();
  setBillType(e: any) {
    localStorage.setItem('BillPrint', this.billPrintType);
  }

  getBooker() {
    this.global.getBookerList().subscribe((data: any) => { this.bookerList = data; });
  }

  getPartyList() {
    this.global.getCustomerList().subscribe((data: any) => { this.partyList = data; });
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


  @ViewChild('supplier') myParty: any;
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



  changeOrder() {
    this.sortType = this.sortType == 'desc' ? 'asc' : 'desc';
    this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);

  }

  searchByCode(e: any) {

    var barcode = this.PBarcode;
    var qty: number = 0;
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

  pushProdData(data: any, qty: any) {
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
        productImage: data.productImage,
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
        discInP: discPerc,
        discInR: discRupee,
        aq: data.aq,
        total: (data.salePrice * qty) - (discRupee * qty),
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
      var newQty: any = Number(qty) > 0 ? Number(qty) * data.quantity : data.quantity;
      this.tableDataList[index].quantity = Number(this.tableDataList[index].quantity) + newQty;

      /////// Sorting Table
      this.tableDataList[index].rowIndex = this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1 : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1;
      this.sortTableData();
      this.productImage = this.tableDataList[index].productImage;
      this.getTotal();
    }

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
          // this.tableDataList.push({
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



        this.getTotal();


      }
    )


  }

  sortTableData() {
    this.sortType == 'desc'
      ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex)
      : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);

  }

  vehicleList: any = [];
  getVehicles() {
    this.http.get(environment.mainApi + 'veh/GetActiveVehicle').subscribe(
      (Response: any) => {
        this.vehicleList = Response;
      }
    )
  }

  searchProductByName() {
    this.global.openBootstrapModal('#prodModal', true, true);

    setTimeout(() => {
      $('#prodName').trigger('select');
      $('#prodName').trigger('focus');
    }, 500);

  }

  focusto(cls: any, e: any) {

    // setTimeout(() => {
    //  $(cls).trigger('focus');
    // }, 500);

    if (cls == '#prodName') {
      setTimeout(() => {
        $(cls).trigger('focus');
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

    if (cls == '#vsrtnsearchProduct' && e.keyCode == 13) {
      e.preventDefault();
      $(cls).trigger('select');
      $(cls).trigger('focus');
    }



  }


  getTotal() {

    if (this.tableDataList.length == 0) return;
    this.qtyTotal = 0;
    this.subTotal = 0;
    this.netTotal = 0;
    this.offerDiscount = 0;

    this.tableDataList.forEach((e: any) => {
      // if (this.billDiscount > 0) {
      //   e.discInP = this.billDiscount;
      //   e.discInR = (e.salePrice * this.billDiscount) / 100
      // }
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
  handleUpdown(item: any, e: KeyboardEvent, cls: string, index: number): void {
    const container = $(".table-logix");
    const key = e.keyCode;
    const isShiftTab = e.shiftKey && key === 9;

    // Tab key → Move focus to next row
    if (key === 9 && !e.shiftKey) {
      this.rowFocused = index + 1;
      return;
    }

    // Shift+Tab key → Move focus to previous row
    if (isShiftTab) {
      this.rowFocused = index - 1;
      return;
    }

    // Enter key → Focus the product search input
    if (key === 13) {
      e.preventDefault();
      if (item.packing > 1) {
        this.editDiscProdQty(item);
      } else {
        $('#psearchProduct').trigger('select').trigger('focus');
      }

      return;
    }

    // Delete key → Remove the row
    if (key === 46) {
      this.delRow(item);
      this.rowFocused = 0;
      return;
    }

    // Arrow Down → Move to next row
    if (key === 40) {
      if (this.tableDataList.length > 1) {
        this.rowFocused = Math.min(this.rowFocused + 1, this.tableDataList.length - 1);
        const clsName = `${cls}${this.rowFocused}`;
        this.global.scrollToRow(clsName, container);
        e.preventDefault();
        $(clsName).trigger('select').trigger('focus');
      }
      return;
    }

    // Arrow Up → Move to previous row or focus search
    if (key === 38) {
      if (this.rowFocused > 0) {
        this.rowFocused--;
        const clsName = `${cls}${this.rowFocused}`;
        this.global.scrollToRow(clsName, container);
        e.preventDefault();
        $(clsName).trigger('select').trigger('focus');
      } else {
        e.preventDefault();
        $(".searchProduct").trigger('select').trigger('focus');
      }
      return;
    }

    // Allowable keys (numbers, arrows, delete, tab, enter, etc.)
    const allowedKeys = [
      8, 9, 13, 16, 37, 38, 39, 40, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
      96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110
    ];

    // Block any key not in allowedKeys
    if (!allowedKeys.includes(key)) {
      e.preventDefault();
    }
  }


  editDiscProdQty(item: any) {
    if(item.packing <= 1) return;
    this.dialog.open(EditQtyModalComponent, {
      width: '30%',
      data: item
    }).afterClosed().subscribe(value => {
      if(Number(value) > 0){
        var index = this.tableDataList.findIndex((e:any)=> e.barcode == item.barcode);
        this.tableDataList[index].quantity = Number(value) * item.packing;
        this.getTotal();

      }
    })
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
    this.getTotal();
  }


  showImg(item: any) {

    var index = this.tableDataList.findIndex((e: any) => e.productID == item.productID);
    this.productImage = this.tableDataList[index].productImage;

  }

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


  editDR(item: any) {

    if (this.editDiscFeature) {

      Swal.fire({
        title: "Enter Discount Amount",
        input: "text",
        showCancelButton: true,
        confirmButtonText: 'Save',
        showLoaderOnConfirm: true,
        preConfirm: (value) => {
          if (!value || isNaN(value) || value < 0) {
            return Swal.showValidationMessage("Enter Valid Amount");
          }

          if (item.salePrice - value < item.costPrice) {
            return Swal.showValidationMessage("Discount Price Not Valid");
          }
          const index = this.tableDataList.indexOf(item);
          this.tableDataList[index].discInR = value;
          this.tableDataList[index].discInP = (value / item.salePrice) * 100;
          this.getTotal();
        }
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Discount Updated",
            timer: 500,
          });
        }
      })
    }


  }

  editDP(item: any) {
    if (this.editDiscFeature) {
      Swal.fire({
        title: "Enter Discount Percent",
        input: "text",
        showCancelButton: true,
        confirmButtonText: 'Save',
        showLoaderOnConfirm: true,
        preConfirm: (value) => {
          if (!value || isNaN(value) || value < 0) {
            return Swal.showValidationMessage("Enter Valid Amount");
          }

          if (item.salePrice - ((item.salePrice * value) / 100) < item.costPrice) {
            return Swal.showValidationMessage("Discount % Not Valid");
          }
          const index = this.tableDataList.indexOf(item);
          this.tableDataList[index].discInP = value;
          this.tableDataList[index].discInR = (item.salePrice * value) / 100;
          this.getTotal();
          this.tempProdData = [];
        }
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Discount Updated",
            timer: 500,
          });
        }
      })
    }



  }

  EditTotal(item: any) {

    // if(this.discFeature) return;

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


        this.tableDataList[index].quantity = value / (this.tableDataList[index].salePrice - this.tableDataList[index].discInR);
        this.getTotal();
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Price Updated",
          timer: 200,
        });
      }
    })

  }



  partySelect() {
    if (this.partyID > 0) {
      this.paymentType = 'Credit';

    } else {
      this.paymentType = 'Cash';
    }
    this.getTotal();
  }

  isValidSale = true;
  save(paymentType: any, SendToFbr: any, printFlag: any) {




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


    if (this.isValidSale == true) {


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

      if (this.VehicleSaleFeature && this.vehicleID == 0) {
        this.msg.WarnNotify('Select Vehicle');
        return;
      }
      if (this.VehicleSaleFeature && this.meterReading == '') {
        this.msg.WarnNotify('Enter Meter Reading');
        return;
      }


      var postData: any = {
        InvDate: this.global.dateFormater(this.InvDate, '-'),
        PartyID: this.partyID,
        InvType: "S",
        ProjectID: this.projectID,
        BookerID: this.bookerID,
        PaymentType: paymentType,
        SendToFbr: SendToFbr,
        PosFee: this.gstFeature ? this.PosFee : 0,
        Remarks: this.billRemarks || '-',
        OrderType: "Take Away",
        BillTotal: this.subTotal,
        BillDiscount: Number(this.discount) + Number(this.offerDiscount),
        OtherCharges: this.otherCharges,
        NetTotal: this.netTotal,
        CashRec: this.cash,
        Change: this.change,
        AdvTaxAmount: this.AdvTaxAmount,
        AdvTaxValue: this.AdvTaxValue,
        BankCoaID: this.bankCoaID,
        BankCash: this.bankCash,
        CusContactNo: this.customerMobileno || '-',
        CusName: this.customerName || '-',
        SaleDetail: JSON.stringify(this.tableDataList),
        VehicleID: this.vehicleID,
        MeterReading: this.meterReading || '0',
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
      this.isValidSale = false;
      this.app.startLoaderDark();
      this.http.post(environment.mainApi + this.global.inventoryLink + 'InsertCashAndCarrySale', postData).subscribe(
        (Response: any) => {
          if (Response.msg == 'Data Saved Successfully') {
            this.tmpCash = this.cash;
            this.tmpChange = this.change;
            this.reset();
            this.msg.SuccessNotify(Response.msg);

            if (printFlag) {
              this.PrintAfterSave(Response.invNo);
            }

            if (paymentType != 'Cash') {
              $('#searchProduct').trigger('focus');
              this.global.closeBootstrapModal('#paymentMehtod', true);

            }

          } else {
            this.msg.WarnNotify(Response.msg);
          }
          this.isValidSale = true;
          this.app.stopLoaderDark();

        },
        (error: any) => {
          this.isValidSale = true;
          console.log(error);
          this.msg.WarnNotify('Unable to Save Check Connection');

          this.app.stopLoaderDark();
        }
      )
    }



  }


  reset() {
    this.partyID = 0;
    this.invoiceDate = new Date();
    this.PBarcode = '';
    this.productName = '';
    this.productImage = '';
    this.tableDataList = [];
    this.cash = 0;
    this.discount = 0;
    this.netTotal = 0;
    this.subTotal = 0;
    this.change = 0;
    this.bankCash = 0;
    this.qtyTotal = 0;
    this.paymentType = 'Cash';
    this.InvDate = new Date();
    this.billRemarks = '';
    this.otherCharges = 0;
    this.billDiscount = 0;
    this.offerDiscount = 0;
    this.bookerID = 0;
    this.customerMobileno = '';
    this.customerName = '';
    this.bankCoaID = 0;
    this.vehicleID = 0;
    this.meterReading = '';


  }


  emptyBill() {
    if (this.tableDataList != '') {
      this.global.confirmAlert().subscribe(
        (Response: any) => {
          if (Response == true) {

            this.reset();
            $('#psearchProduct').trigger('focus');
          }
        }
      )
    }

  }





  savedbillList: any = [];



  myPrintTableData: any = [];
  myInvoiceNo = '';
  mytableNo = '';
  myCounterName = '';
  myCustomerName = '';
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
  myQtyTotal = 0;
  myOfferDiscount = 0;
  myBookerName = '';
  PrintAfterSave(InvNo: any) {
    this.billPrint.PrintBill(InvNo);
    this.billPrint.billType = '';

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
              this.dialog.open(SaleBillDetailComponent, {
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


  getSavedBill() {


    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetOpenDaySale').subscribe(
      (Response: any) => {
        this.savedbillList = [];
        Response.forEach((e: any) => {
          if (e.invType == 'S') {
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

  onBankSelected() {
    this.paymentType = 'Bank';
    this.cash = 0;
    this.getTotal();

  }
  onCashSelected() {
    this.paymentType = 'Cash';
    this.bankCash = 0;

    this.getTotal();

  }


  changePayment(data: any) {
    $('#SavedBillModal').hide();
    this.dialog.open(PaymentMehtodComponent, {
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





  ///////////////////////// For Adding New Vehicle Shortcut /////////////

  @ViewChild('vehicle') myVehicle: any;
  addVehicle() {
    setTimeout(() => {
      this.myVehicle.close()

    }, 200);

    this.global.openBootstrapModal('#addVehicleModal', true);

  }

  closeVehicleModal() {
    this.global.closeBootstrapModal('#addVehicleModal', true);
  }


}
