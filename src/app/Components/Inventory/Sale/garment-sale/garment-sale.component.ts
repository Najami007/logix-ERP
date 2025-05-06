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
import { ProductModalComponent } from '../SaleComFiles/product-modal/product-modal.component';
import { PaymentMehtodComponent } from '../SaleComFiles/payment-mehtod/payment-mehtod.component';


@Component({
  selector: 'app-garment-sale',
  templateUrl: './garment-sale.component.html',
  styleUrls: ['./garment-sale.component.scss']
})
export class GarmentSaleComponent implements OnInit {


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

  @ViewChild(SaleBillPrintComponent) billPrint: any;

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
    

    setTimeout(() => {
      $('#psearchProduct').trigger('focus');
    }, 200);

    this.global.getProducts().subscribe(
      (data: any) => { this.productList = data; });

    for (let i = 0; i <= 100; i++) { this.discountList.push({ value: i }); }



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
  productList: any = [];
  projectID = this.global.InvProjectID;

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
    this.dialogue.open(AddpartyComponent, {
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



  // searchByCode(e: any) {

  //   var barcode = this.PBarcode;
  //   var qty: number = 1;
  //   var BType = '';

  //   if (this.PBarcode !== '') {
  //     if (e.keyCode == 13) {

  //       /// Seperating by / and coverting to Qty
  //       if (this.PBarcode.split("/")[1] != undefined) {
  //         barcode = this.PBarcode.split("/")[0];
  //         qty = parseFloat(this.PBarcode.split("/")[1]);
  //         BType = 'price';


  //       }
  //       /// Seperating by - and coverting to Qty 
  //       if (this.PBarcode.split("-")[1] != undefined) {
  //         barcode = this.PBarcode.split("-")[0];
  //         qty = parseFloat(this.PBarcode.split("-")[1]);
  //         BType = 'qty';

  //       }


  //           /////verifying product in product list by barcode
  //       var row = this.productList.find((p: any) => p.barcode == barcode);


  //        //////////// For Normal Barcode
  //       if (row !== undefined) {
  //         /////// check already present in the table or not
  //         var condition = this.tableDataList.find(
  //           (x: any) => x.productID == row.productID
  //         );

  //         var index = this.tableDataList.indexOf(condition);

  //         //// push the data using index
  //         if (condition == undefined) {


  //           // this.app.startLoaderDark();
  //           this.global.getProdDetail(0, barcode).subscribe(
  //             (Response: any) => {

  //               if (BType == 'price') {
  //                 qty = qty / parseFloat(Response[0].salePrice);

  //               }

  //               this.tableDataList.push({
  //                 rowIndex: this.tableDataList.length == 0 ? this.tableDataList.length + 1
  //                   : this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1
  //                     : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
  //                 productID: Response[0].productID,
  //                 productTitle: Response[0].productTitle,
  //                 barcode: Response[0].barcode,
  //                 productImage: Response[0].productImage,
  //                 quantity: qty,
  //                 wohCP: Response[0].costPrice,
  //                 avgCostPrice: Response[0].avgCostPrice,
  //                 costPrice: Response[0].costPrice,
  //                 salePrice: Response[0].salePrice,
  //                 ovhPercent: 0,
  //                 ovhAmount: 0,
  //                 expiryDate: this.global.dateFormater(new Date(), '-'),
  //                 batchNo: '-',
  //                 batchStatus: '-',
  //                 uomID: Response[0].uomID,
  //                 gst: this.gstFeature ? Response[0].gst : 0,
  //                 et:Response[0].et,
  //                 packing: 1,
  //                 discInP: this.discFeature ?  Response[0].discPercentage : 0,
  //                 discInR: this.discFeature ?  Response[0].discRupees  : 0,
  //                 aq: Response[0].aq,
  //                 total:(Response[0].salePrice * qty) - (Response[0].discRupees * qty),
  //                 productDetail:'',

  //               });

  //               //this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex);
  //               this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
  //               this.getTotal();


  //               this.productImage = Response[0].productImage;
  //             }
  //           )



  //         } else {


  //           if (this.PBarcode.split("/")[1] != undefined) {
  //             qty = this.PBarcode.split("/")[1] / this.tableDataList[index].salePrice;
  //           }
  //           this.tableDataList[index].quantity = parseFloat(this.tableDataList[index].quantity) + qty;

  //            /////// Sorting Table
  //           this.tableDataList[index].rowIndex = this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1 : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1;
  //           this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
  //           this.productImage = this.tableDataList[index].productImage;
  //         }
  //       }
  //       //////////// For Special Barcode
  //       else if(row == undefined && barcode.length > 10) {
  //         //////////////// For Special Barcode setting /////////////////////////

  //         var txtBCode = barcode;
  //         var reqQty:any = 0;
  //         var reqQtyDot:any = 0;
  //         var prodQty:any = 0; 
  //         var tmpPrice:any = 0;

  //         txtBCode = txtBCode.substring(2, 7);  /////////// extracting product barcode from special barcode
  //         txtBCode = parseInt(txtBCode);
  //         txtBCode = txtBCode.toString();

  //         /////////// verifying whether exists in product list or not
  //         var prodDetail = this.productList.find((p: any) => p.barcode == txtBCode);

  //         if(prodDetail == '' || prodDetail == undefined){
  //           this.msg.WarnNotify('Product Not Fount');

  //         }else{


  //           /////////// extracting price from special barcode based on UOM
  //           if(prodDetail.uomTitle == 'price'){
  //             reqQty = barcode.substring(12 - 5);
  //             reqQtyDot = reqQty.substring(0,5);
  //             tmpPrice = reqQtyDot; 

  //           }else if(prodDetail.uomTitle == 'piece'){
  //             reqQty = barcode.substring(12 - 5);
  //             reqQtyDot = reqQty.substring(6 - 4);
  //             reqQtyDot = reqQtyDot.substring(0, 3);
  //             console.log(reqQtyDot);
  //             reqQty = reqQty.substring(0, 5);
  //             console.log(reqQty);
  //             prodQty = parseFloat(reqQty);

  //           }
  //           else{
  //               /////////// extracting quantity from special barcode based on UOM
  //             reqQty = barcode.substring(12 - 5);
  //             reqQtyDot = reqQty.substring(6 - 4);
  //             reqQtyDot = reqQtyDot.substring(0, 3);
  //             reqQty = reqQty.substring(0, 2);
  //             prodQty = parseFloat(reqQty + '.' + reqQtyDot);
  //           }

  //           /////////// verifying exists in already scanned products or not
  //           var condition = this.tableDataList.find(
  //             (x: any) => x.productID == prodDetail.productID
  //           );

  //           var index = this.tableDataList.indexOf(condition);

  //           if(condition == undefined ){

  //             /////////// inserting data into tableDataList
  //             this.global.getProdDetail(0, txtBCode).subscribe(
  //               (Response: any) => {
  //                  this.tableDataList.push({
  //                   rowIndex: this.tableDataList.length == 0 ? this.tableDataList.length + 1
  //                     : this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1
  //                       : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
  //                   productID: Response[0].productID,
  //                   productTitle: Response[0].productTitle,
  //                   barcode: Response[0].barcode,
  //                   productImage: Response[0].productImage,
  //                   quantity: prodQty || 1,
  //                   wohCP: Response[0].costPrice,
  //                   avgCostPrice: Response[0].avgCostPrice,
  //                   costPrice: Response[0].costPrice,
  //                   //salePrice: (tmpPrice / Response[0].salePrice) || Response[0].salePrice,
  //                   salePrice: tmpPrice  || Response[0].salePrice,
  //                   ovhPercent: 0,
  //                   ovhAmount: 0,
  //                   expiryDate: this.global.dateFormater(new Date(), '-'),
  //                   batchNo: '-',
  //                   batchStatus: '-',
  //                   uomID: Response[0].uomID,
  //                   gst: this.gstFeature ? Response[0].gst : 0,
  //                   et:Response[0].et,
  //                   packing: 1,
  //                   discInP: this.discFeature ?  Response[0].discPercentage : 0,
  //                   discInR: this.discFeature ?  Response[0].discRupees  : 0,
  //                   aq: Response[0].aq,
  //                   total:(Response[0].salePrice * qty) - (Response[0].discRupees * qty),
  //                   productDetail:'',

  //                 });

  //                 //this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex);
  //                 this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
  //                 this.getTotal();


  //                 this.productImage = Response[0].productImage;
  //               }
  //             )
  //           }else{
  //           /////////// changing qty if product already scanned
  //             if(prodDetail.uomTitle == 'price'){
  //               this.tableDataList[index].quantity = parseFloat(this.tableDataList[index].quantity) + 1;
  //             }else{
  //               this.tableDataList[index].quantity = parseFloat(this.tableDataList[index].quantity) + parseFloat(prodQty);
  //             }

  //             this.tableDataList[index].rowIndex = this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1 : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1;
  //             this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
  //             this.productImage = this.tableDataList[index].productImage;

  //           }


  //         }




  //       }else{
  //         this.msg.WarnNotify('Product Not Found');

  //       }


  //       this.PBarcode = '';
  //       this.getTotal();
  //       $('#psearchProduct').trigger('focus');

  //     }
  //   }


  // }

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
              this.searchSpecialBarcode(barcode, qty);
              return;
            } else {

              if (BType == 'price') {
                qty = qty / parseFloat(Response[0].salePrice);

              }

              /////// check already present in the table or not
              var condition = this.tableDataList.find(
                (x: any) => x.productID == Response[0].productID
              );

              var index = this.tableDataList.indexOf(condition);

              //// push the data using index
              if (condition == undefined) {

                this.tableDataList.push({
                  rowIndex: this.tableDataList.length == 0 ? this.tableDataList.length + 1
                    : this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1
                      : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
                  productID: Response[0].productID,
                  productTitle: Response[0].productTitle,
                  barcode: Response[0].barcode,
                  productImage: Response[0].productImage,
                  quantity: qty,
                  wohCP: Response[0].costPrice,
                  avgCostPrice: Response[0].avgCostPrice,
                  costPrice: Response[0].costPrice,
                  salePrice: Response[0].salePrice,
                  ovhPercent: 0,
                  ovhAmount: 0,
                  expiryDate: this.global.dateFormater(new Date(), '-'),
                  batchNo: '-',
                  batchStatus: '-',
                  uomID: Response[0].uomID,
                  gst: this.gstFeature ? Response[0].gst : 0,
                  et: Response[0].et,
                  packing: 1,
                  discInP: this.discFeature ? Response[0].discPercentage : 0,
                  discInR: this.discFeature ? Response[0].discRupees : 0,
                  aq: Response[0].aq,
                  total: (Response[0].salePrice * qty) - (Response[0].discRupees * qty),
                  productDetail: '',

                });

                //this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex);
                this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
                this.getTotal();
                this.productImage = Response[0].productImage;




              } else {
                if (this.PBarcode.split("/")[1] != undefined) {
                  qty = this.PBarcode.split("/")[1] / this.tableDataList[index].salePrice;
                }
                this.tableDataList[index].quantity = parseFloat(this.tableDataList[index].quantity) + qty;

                /////// Sorting Table
                this.tableDataList[index].rowIndex = this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1 : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1;
                this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
                this.productImage = this.tableDataList[index].productImage;
                this.getTotal();
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
          this.tableDataList.push({
            rowIndex: this.tableDataList.length == 0 ? this.tableDataList.length + 1
              : this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1
                : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
            productID: Response[0].productID,
            productTitle: Response[0].productTitle,
            barcode: Response[0].barcode,
            productImage: Response[0].productImage,
            quantity: prodQty || 1,
            wohCP: Response[0].costPrice,
            avgCostPrice: Response[0].avgCostPrice,
            costPrice: Response[0].costPrice,
            //salePrice: (tmpPrice / Response[0].salePrice) || Response[0].salePrice,
            salePrice: tmpPrice || Response[0].salePrice,
            ovhPercent: 0,
            ovhAmount: 0,
            expiryDate: this.global.dateFormater(new Date(), '-'),
            batchNo: '-',
            batchStatus: '-',
            uomID: Response[0].uomID,
            gst: this.gstFeature ? Response[0].gst : 0,
            et: Response[0].et,
            packing: 1,
            discInP: this.discFeature ? Response[0].discPercentage : 0,
            discInR: this.discFeature ? Response[0].discRupees : 0,
            aq: Response[0].aq,
            total: (Response[0].salePrice * qty) - (Response[0].discRupees * qty),
            productDetail: '',

          });
          //this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex);
          this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
          this.getTotal();
          this.productImage = Response[0].productImage;

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
          this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
          this.productImage = this.tableDataList[index].productImage;

        }



        this.getTotal();


      }
    )


  }


  holdDataFunction(data: any) {


    var condition = this.tableDataList.find(
      (x: any) => x.productID == data.productID
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
            productID: Response[0].productID,
            productTitle: Response[0].productTitle,
            barcode: Response[0].barcode,
            productImage: Response[0].productImage,
            quantity: 1,
            wohCP: Response[0].costPrice,
            costPrice: Response[0].costPrice,
            avgCostPrice: Response[0].avgCostPrice,
            salePrice: Response[0].salePrice,
            ovhPercent: 0,
            ovhAmount: 0,
            expiryDate: this.global.dateFormater(new Date(), '-'),
            batchNo: '-',
            batchStatus: '-',
            uomID: Response[0].uomID,
            gst: this.gstFeature ? Response[0].gst : 0,
            et: Response[0].et,
            packing: 1,
            discInP: this.discFeature ? Response[0].discPercentage : 0,
            discInR: this.discFeature ? Response[0].discRupees : 0,
            aq: Response[0].aq,
            total: (Response[0].salePrice * 1) - (Response[0].discRupees),

          });
          // this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex);
          this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
          this.getTotal();


          this.productImage = Response[0].productImage;
        }
      )
    } else {
      this.tableDataList[index].quantity = parseFloat(this.tableDataList[index].quantity) + 1;
      this.tableDataList[index].rowIndex = this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1 : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1;
      this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
      this.productImage = this.tableDataList[index].productImage;

    }

    this.app.stopLoaderDark();
    this.productName = '';
    this.getTotal();
    setTimeout(() => {
      $('#psearchProduct').trigger('focus');
    }, 500);

  }

  searchProductByName() {
    this.dialogue.open(ProductModalComponent, {
      width: '80%',
    }).afterClosed().subscribe(val => {
      if (val != '' && val != undefined) {
        this.holdDataFunction(val.data);
      }
    })
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
    this.change = parseFloat(this.cash) - this.netTotal;

    if (this.paymentType == 'Split') {
      this.bankCash = this.netTotal - parseFloat(this.cash);
    }
    if (this.paymentType == 'Bank') {
      this.bankCash = this.netTotal;
    }

    if (this.paymentType == 'Credit') {
      this.cash = 0;
      this.bankCoaID = 0;
      this.bankCash = 0;
    }

    if (this.paymentType !== 'Credit') {
      this.partyID = 0;
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

          if (value == "") {
            return Swal.showValidationMessage("Enter Valid Amount");
          }

          if (isNaN(value)) {
            return Swal.showValidationMessage("Enter Valid Amount");
          }

          if (value <= 0) {
            return Swal.showValidationMessage("Enter Valid Amount");
          }

          if (value < this.tableDataList[this.tableDataList.indexOf(this.tempProdData)].costPrice && this.LessToCostFeature == false) {
            return Swal.showValidationMessage("Sale Price Is Less Then Cost Price");
          }

          this.tableDataList[this.tableDataList.indexOf(this.tempProdData)].salePrice = value;
          this.getTotal();
          this.tempProdData = [];
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

          if (value == "") {
            return Swal.showValidationMessage("Enter Valid Amount");
          }

          if (isNaN(value)) {
            return Swal.showValidationMessage("Enter Valid Amount");
          }

          if (value < 0) {
            return Swal.showValidationMessage("Enter Valid Amount");
          }

          if (item.salePrice - value < item.costPrice) {
            return Swal.showValidationMessage("Discount Price Not Valid");
          }

          this.tableDataList[this.tableDataList.indexOf(this.tempProdData)].discInR = value;
          this.tableDataList[this.tableDataList.indexOf(this.tempProdData)].discInP = (value / item.salePrice) * 100;
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

  editDP(item: any) {
    if (this.editDiscFeature) {
      Swal.fire({
        title: "Enter Discount Percent",
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

          if (value < 0) {
            return Swal.showValidationMessage("Enter Valid Amount");
          }

          if (item.salePrice - ((item.salePrice * value) / 100) < item.costPrice) {
            return Swal.showValidationMessage("Discount % Not Valid");
          }

          this.tableDataList[this.tableDataList.indexOf(this.tempProdData)].discInP = value;
          this.tableDataList[this.tableDataList.indexOf(this.tempProdData)].discInR = (item.salePrice * value) / 100;
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


  editTotal(amount: any) {
    if (this.editSpFeature) {
      this.tableDataList[this.tableDataList.indexOf(this.tempProdData)].total = amount;
      this.tableDataList[this.tableDataList.indexOf(this.tempProdData)].quantity = (amount / (this.tableDataList[this.tableDataList.indexOf(this.tempProdData)].salePrice - this.tableDataList[this.tableDataList.indexOf(this.tempProdData)].discInR));

      this.getTotal();
      this.tempProdData = [];
    }




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


   


    this.isValidSale = true;
    this.tableDataList.forEach((p: any) => {

      p.quantity = parseFloat(p.quantity);
      p.salePrice = parseFloat(p.salePrice);
      p.costPrice = parseFloat(p.costPrice);

      if (!this.LessToCostFeature && (p.costPrice > p.salePrice || p.costPrice == 0 || p.costPrice == '0' || p.costPrice == '' || p.costPrice == undefined || p.costPrice == null)) {
        this.msg.WarnNotify('(' + p.productTitle + ') Cost Price greater than Sale Price');
        this.isValidSale = false;
        return;
      }else if (p.salePrice == 0 || p.salePrice == '0' || p.salePrice == '' || p.salePrice == undefined || p.salePrice == null) {
        this.msg.WarnNotify('(' + p.productTitle + ') Sale Price is not Valid');
        this.isValidSale = false;
        return;
      }else if (p.quantity == 0 || p.quantity == '0' || p.quantity == null || p.quantity == undefined || p.quantity == '') {
        this.msg.WarnNotify('(' + p.productTitle + ') Quantity is not Valid');
        this.isValidSale = false;
        return;
      }else if (!this.LessToCostFeature && (p.costPrice > (p.salePrice - p.discInR))) {
        this.msg.WarnNotify('(' + p.productTitle + ') Discount not valid');
        this.isValidSale = false; 
        return;
      }
    });

    if (this.isValidSale == true) {

      if (this.tableDataList == '') {
        this.msg.WarnNotify('No Product Seleted')
      }
      else if (paymentType == 'Cash' && this.partyID == 0 && (this.cash == 0 || this.cash == undefined || this.cash == null)) {
        this.msg.WarnNotify('Enter Cash')
      } else if (paymentType == 'Cash' && this.partyID == 0 && this.cash < this.netTotal) {
        this.msg.WarnNotify('Entered Cash is not Valid')
      } else if (paymentType == 'Split' && ((this.cash + this.bankCash) > this.netTotal || (this.cash + this.bankCash) < this.netTotal)) {
        this.msg.WarnNotify('Sum Of Both Amount must be Equal to Net Total')
      } else if (this.paymentType == 'Split' && this.cash <= 0) {
        this.msg.WarnNotify('Cash Amount is Not Valid')
      } else if (this.paymentType == 'Split' && this.bankCash <= 0) {
        this.msg.WarnNotify('Bank Amount is Not Valid')
      } else if ((this.bookerID == 0 || this.bookerID == undefined) && this.BookerFeature) {
        this.msg.WarnNotify('Select Booker')
      } else if (this.paymentType == 'Credit' && this.partyID == 0) {
        this.msg.WarnNotify('Select Customer');
      }else if (paymentType == 'Bank' && (this.bankCash < this.netTotal) || (this.bankCash > this.netTotal)) {
        this.msg.WarnNotify('Enter Valid Amount')
      } else {



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
        this.http.post(environment.mainApi + this.global.inventoryLink + 'InsertCashAndCarrySale', {
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
          BillDiscount: parseFloat(this.discount) + parseFloat(this.offerDiscount),
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
          UserID: this.global.getUserID()
        }).subscribe(
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
              this.isValidSale = true;
            } else {
              this.msg.WarnNotify(Response.msg);
              this.isValidSale = true;
            }
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
    // setTimeout(() => {   
    //   this.global.printData('#print-bill')
    // }, 200);

    // setTimeout(() => {
    //   this.billPrint.billType = 'Counter Copy';
    //  setTimeout(() => {
    //   this.global.printData('#print-bill');
    //  }, 100);
    // }, 200);



    // this.http.get(environment.mainApi + this.global.inventoryLink + 'PrintBill?BillNo=' + InvNo).subscribe(
    //   (Response: any) => {

    //     this.myPrintTableData = Response;
    //     this.myInvoiceNo = InvNo;
    //     this.myInvDate = Response[0].createdOn;
    //     this.myCounterName = Response[0].entryUser;
    //     this.mySubTotal = Response[0].billTotal;
    //     this.myNetTotal = Response[0].netTotal;
    //     this.myOtherCharges = Response[0].otherCharges;
    //     this.myRemarks = Response[0].remarks;
    //     this.myCash = Response[0].cashRec;
    //     this.myBank = Response[0].netTotal - Response[0].cashRec;
    //     this.myDiscount = Response[0].billDiscount;
    //     this.myChange = Response[0].change;
    //     this.myPaymentType = Response[0].paymentType;
    //     this.myCustomerName = Response[0].partyName;
    //     this.myBookerName = Response[0].bookerName;


    //     this.myQtyTotal = 0;
    //     Response.forEach((e: any) => {
    //       this.myQtyTotal += e.quantity;
    //       this.myOfferDiscount += e.discInR * e.quantity;
    //     });

    //     setTimeout(() => {
    //       this.global.printData('#cncBillPrint');
    //       this.global.printData('#cncBillPrint2');
    //     }, 2000);

    //   }
    // )



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
    this.getTotal();

  }


  changePayment(data:any){
    $('#SavedBillModal').hide();
    this.dialogue.open(PaymentMehtodComponent,{
      width:'30%',
      data:data
    }).afterClosed().subscribe(val=>{
      this.getSavedBill();
      $('#SavedBillModal').show();
    })
  
  }

}
