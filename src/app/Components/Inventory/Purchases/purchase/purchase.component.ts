import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';
import { PincodeComponent } from '../../../User/pincode/pincode.component';
import { error } from 'jquery';
import { Observable, retry } from 'rxjs';
import * as $ from 'jquery';
import Swal from 'sweetalert2';
import { AddpartyComponent } from '../../../Company/party/addparty/addparty.component';
import { MatSelect } from '@angular/material/select';
import { ProductModalComponent } from '../../Sale/SaleComFiles/product-modal/product-modal.component';
import { PurchaseBillPrintComponent } from '../purchase-bill-print/purchase-bill-print.component';
import { AddDocumentComponent } from 'src/app/Components/shared-components/add-document/add-document.component';


@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {


  @ViewChild(PurchaseBillPrintComponent) billPrint: any;
  @ViewChild(AddDocumentComponent) AddDocument: any;

  disableDateFeature = this.global.DisableInvDate;
  DetailedPurchaseFeature = this.global.DetailedPurchase;

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
    this.global.setHeaderTitle('Purchase');
    // this.getProducts();
    this.getSuppliers();
    $('.searchBarcode').trigger('focus');
    this.getProducts();
    this.global.getBookerList().subscribe((data: any) => { this.BookerList = data; });
    this.global.getWarehouseLocationList().subscribe((data: any) => {
      this.locationList = data;
      if (data.length > 0) {
        this.locationID = data[0].locationID
      }
    });


  }

  getProducts() {
    this.global.getProducts().subscribe(
      (data: any) => { this.productList = data; });
  }



  hideTotalFlag = true;

  projectID = this.global.getProjectID();
  holdBtnType: any = 'Hold';
  tabIndex: any;
  Date: Date = new Date()
  productImage: any;
  productName = '';
  PBarcode: string = '';   /// for Search barcode field
  productsData: any;   //// for showing the products
  tableDataList: any = [];          //////will hold data temporarily
  suppliersList: any = [];      //////  will shows the supplier list
  supplierDetail: any = [];

  myTotalQty: any = 0;
  subTotal = 0;

  myDue: any;
  holdBillList: any = [];

  refInvNo: any = '';
  invRemarks: any = '';
  locationID: any = 0;
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


  partyID = 0;               /////// will get the party id for Api
  invoiceDate = new Date;    //////////// invoice date for api



  productList: any = [];
  locationList: any = [];
  BookerList: any = [];


  discType: any = 'ad';


  onFieldsUpdate(type: any, item: any) {


    if(!this.DetailedPurchaseFeature) return;



    if (this.discType == 'ad') {

      var gstAmount = ((item.tempCostPrice * item.gst) / 100)
      var discP = ((item.tempCostPrice * item.discInP) / 100);
      var discR = (item.discInR / item.Quantity);
      var etAmount = (((Number(item.tempCostPrice) + Number(gstAmount) - discP - discR) * item.et) / 100);

      var totalCost = item.tempCostPrice * item.Quantity;
      var costWithDiscP = item.tempCostPrice - discP;
      var costWithDiscR = costWithDiscP - discR;
      var costWithGst = costWithDiscR + ((costWithDiscR * item.gst) / 100);
      var costWithEt = costWithGst + etAmount;

      console.log(costWithDiscP,costWithDiscR,costWithGst,costWithEt)
      item.CostPrice = costWithEt;
    }
    if (this.discType == 'bd') {

      var totalCost = item.tempCostPrice * item.Quantity;
      var gstAmount = ((item.tempCostPrice * item.gst) / 100);
      var etAmount = (((Number(item.tempCostPrice) + Number(gstAmount))  * item.et) / 100);
      var discP = (((item.tempCostPrice - gstAmount) * item.discInP) / 100);
      var discR = (item.discInR / item.Quantity);


      var costWithGst = Number(item.tempCostPrice) - Number(discR) + gstAmount;
      var costWithDisc = (Number(item.tempCostPrice) - Number(gstAmount)) - Number(discP) - Number(discR) + Number(gstAmount);

      item.CostPrice = item.discInP > 0
        ? costWithDisc + ((costWithDisc * item.et) / 100)
        : costWithGst + ((costWithGst * item.et) / 100);
    }
    this.getTotal();

  }



  changeOrder() {
    this.sortType = this.sortType == 'desc' ? 'asc' : 'desc';
    this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);

  }
  /////// to change the tab on edit

  changeTab(tabNum: any) {
    this.tabIndex = tabNum;

  }


  getSuppliers() {
    this.global.getSupplierList().subscribe((data: any) => { this.suppliersList = data; });

  }


  focusto(cls: any, e: any) {

    if (cls == '#prodName') {
      setTimeout(() => {
        e.preventDefault();
        $(cls).trigger('focus');
      }, 500);
    }

    if (cls == '#ovhd' && e.keyCode == 13) {
      if (e.target.value == '') {
        // alert();
        e.preventDefault();
        $(cls).trigger('select');
        $(cls).trigger('focus');

      }
    }

    if (cls == '#disc' && e.keyCode == 13) {
      e.preventDefault();
      $(cls).trigger('select');
      $(cls).trigger('focus');

    }

    if (cls == '#savebtn' && e.keyCode == 13) {
      e.preventDefault();
      // $(cls).trigger('select');
      $(cls).trigger('focus');

    }



  }




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
    var condition = this.tableDataList.find(
      (x: any) => x.ProductID == data.productID
    );

    var index = this.tableDataList.indexOf(condition);
    //// push the data using index
    if (condition == undefined) {

      this.tableDataList.push({
        rowIndex: this.tableDataList.length == 0 ? this.tableDataList.length + 1
          : this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1
            : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
        ProductID: data.productID,
        ProductTitle: data.productTitle,
        barcode: data.barcode,
        productImage: data.productImage,
        Quantity: qty,
        wohCP: data.costPrice,
        tempCostPrice: data.costPrice,
        margin:((data.salePrice  - data.costPrice) / data.costPrice) * 100,
        CostPrice: data.costPrice,
        SalePrice: data.salePrice,
        ovhPercent: 0,
        ovhAmount: 0,
        ExpiryDate: this.global.dateFormater(new Date(), '-'),
        BatchNo: '-',
        BatchStatus: '-',
        UomID: data.uomID,
        Packing: 1,
        discInP: 0,
        discInR: 0,
        AQ: data.aq,
        gst: data.gst,
        et: data.et,


      });

      //this.tableDataList.sort((a:any,b:any)=> b.rowIndex - a.rowIndex);
      this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
      this.getTotal();
      this.productImage = data.productImage;




    } else {
      if (this.PBarcode.split("/")[1] != undefined) {
        var total: any = this.PBarcode.split("/")[1];
        qty = total / this.tableDataList[index].SalePrice;
      }
      this.tableDataList[index].Quantity = parseFloat(this.tableDataList[index].Quantity) + qty;

      /////// Sorting Table
      this.tableDataList[index].rowIndex = this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1 : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1;
      this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
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
          (x: any) => x.ProductID == Response[0].productID
        );
        var index = this.tableDataList.indexOf(condition);
        if (condition == undefined) {
          /////////// inserting data into tableDataList
          Response[0].costPrice = tmpPrice || Response[0].costPrice;
          this.pushProdData(Response[0], prodQty || 1)

        } else {
          /////////// changing qty if product already scanned
          if (Response[0].uomTitle == 'price') {
            var total = (parseFloat(this.tableDataList[index].CostPrice) * parseFloat(this.tableDataList[index].Quantity));
            this.tableDataList[index].Quantity = parseFloat(this.tableDataList[index].Quantity) + 1;
            this.tableDataList[index].CostPrice = (total + parseFloat(tmpPrice)) / parseFloat(this.tableDataList[index].Quantity);
          } else {
            this.tableDataList[index].Quantity = parseFloat(this.tableDataList[index].Quantity) + parseFloat(prodQty);
          }
          this.tableDataList[index].rowIndex = this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1 : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1;
          this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
          this.productImage = this.tableDataList[index].productImage;

        }



        this.getTotal();


      }
    )


  }



  // searchByCode(e: any) {

  //   if (this.PBarcode !== '') {
  //     if (e.keyCode == 13) {
  //       ///// check the product in product list by barcode
  //       var row = this.productList.find((p: any) => p.barcode == this.PBarcode);
  //       /////// check already present in the table or not
  //       if (row !== undefined) {
  //         var condition = this.tableDataList.find(
  //           (x: any) => x.ProductID == row.productID
  //         );

  //         var index = this.tableDataList.indexOf(condition);

  //         //// push the data using index
  //         if (condition == undefined) {


  //           // this.app.startLoaderDark();
  //           this.global.getProdDetail(0, this.PBarcode).subscribe(
  //             (Response: any) => {

  //               this.tableDataList.push({
  //                 rowIndex: this.tableDataList.length == 0 ? this.tableDataList.length + 1
  //                   : this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1
  //                     : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
  //                 ProductID: Response[0].productID,
  //                 ProductTitle: Response[0].productTitle,
  //                 barcode: Response[0].barcode,
  //                 productImage: Response[0].productImage,
  //                 Quantity: 1,
  //                 wohCP: Response[0].costPrice,
  //                 CostPrice: Response[0].costPrice,
  //                 SalePrice: Response[0].salePrice,
  //                 ovhPercent: 0,
  //                 ovhAmount: 0,
  //                 ExpiryDate: this.global.dateFormater(new Date(), '-'),
  //                 BatchNo: '-',
  //                 BatchStatus: '-',
  //                 UomID: Response[0].uomID,
  //                 Packing: 1,
  //                 discInP: 0,
  //                 discInR: 0,
  //                 AQ: Response[0].aq,

  //               });

  //               this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
  //               this.getTotal();


  //               this.productImage = Response[0].productImage;
  //             }
  //           )



  //         } else {
  //           this.tableDataList[index].Quantity = parseFloat(this.tableDataList[index].Quantity) + 1;
  //           this.tableDataList[index].rowIndex = this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1 : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1;
  //           this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
  //           this.productImage = this.tableDataList[index].productImage;
  //         }
  //       } else {
  //         this.msg.WarnNotify('Product Not Found')
  //       }


  //       this.PBarcode = '';
  //       this.getTotal();
  //       $('#psearchProduct').trigger('focus');

  //     }
  //   }


  // }

  // holdDataFunction(data: any) {


  //   var condition = this.tableDataList.find(
  //     (x: any) => x.ProductID == data.productID
  //   );

  //   var index = this.tableDataList.indexOf(condition);



  //   if (condition == undefined) {

  //     this.app.startLoaderDark();

  //     this.global.getProdDetail(data.productID, '').subscribe(
  //       (Response: any) => {



  //         this.tableDataList.push({
  //           rowIndex: this.tableDataList.length == 0 ? this.tableDataList.length + 1
  //             : this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1
  //               : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
  //           ProductID: Response[0].productID,
  //           ProductTitle: Response[0].productTitle,
  //           barcode: Response[0].barcode,
  //           productImage: Response[0].productImage,
  //           Quantity: 1,
  //           wohCP: Response[0].costPrice,
  //           CostPrice: Response[0].costPrice,
  //           SalePrice: Response[0].salePrice,
  //           ovhPercent: 0,
  //           ovhAmount: 0,
  //           ExpiryDate: this.global.dateFormater(new Date(), '-'),
  //           BatchNo: '-',
  //           BatchStatus: '-',
  //           UomID: Response[0].uomID,
  //           Packing: 1,
  //           discInP: 0,
  //           discInR: 0,
  //           AQ: Response[0].aq,

  //         });

  //         this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
  //         this.getTotal();


  //         this.productImage = Response[0].productImage;
  //       }
  //     )
  //   } else {
  //     this.tableDataList[index].Quantity = parseFloat(this.tableDataList[index].Quantity) + 1;
  //     this.tableDataList[index].rowIndex = this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1 : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1;
  //     this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
  //     this.productImage = this.tableDataList[index].productImage;
  //   }
  //   this.app.stopLoaderDark();
  //   this.productName = '';
  //   this.getTotal();
  //   this.global.closeBootstrapModal('#prodModal', true);
  //   setTimeout(() => {
  //     $('#psearchProduct').trigger('focus');
  //   }, 500);

  // }






  searchProductByName() {
    this.global.openBootstrapModal('#prodModal', true, true);

    setTimeout(() => {
      $('#prodName').trigger('select');
      $('#prodName').trigger('focus');
    }, 500);

  }




  delRow(item: any) {
    this.global.confirmAlert().subscribe((Response: any) => {
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

  EmptyData() {
        if(this.tableDataList.length == 0) return;
        
    this.global.confirmAlert().subscribe((Response: any) => {
      if (Response == true) {
        this.reset();

      }
    })
  }


  showImg(item: any) {

    // this.global.getProdImage(item.productID).subscribe((data:any)=>{
    //   this.productImage = data[0].productImage;

    // });

    var index = this.tableDataList.findIndex((e: any) => e.ProductID == item.ProductID);
    this.productImage = this.tableDataList[index].productImage;

  }



  rowFocused = -1;
  prodFocusedRow = 0;
  changeFocus(e: any, cls: any) {

    if (e.target.value == '') {
      if (e.keyCode == 40) {
        if (this.tableDataList.length >= 1) {
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
          // e.which = 9;   
          // $('.prodRow0').trigger(e)  ;
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
          this.prodFocusedRow -= 1;
        } else {
          var clsName = cls + this.prodFocusedRow;
          //  alert(clsName);
          e.preventDefault();
          $(clsName).trigger('focus');
          //  e.keyCode = 9;    

        }
      }
      //  alert(this.prodFocusedRow);
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

    item.margin = ((Number(item.SalePrice) - Number(item.CostPrice)) / Number(item.CostPrice)) * 100

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
    } else if (this.bookerID == 0 || this.bookerID == undefined) {
      this.msg.WarnNotify("Select Purchaser")
    } else if (this.refInvNo == '' || this.refInvNo == undefined) {
      this.msg.WarnNotify('Enter Reference Invoice No')
    } else if (this.partyID == 0 || this.partyID == 0 || this.partyID == undefined) {
      this.msg.WarnNotify('Select Supplier Party')
    } else if (this.locationID == '' || this.locationID == undefined || this.locationID == 0) {
      this.msg.WarnNotify('Select Warehouse Location')
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


      var postData = {
        InvBillNo: this.holdInvNo,
        InvType: "P",
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
        discType: this.discType,
        InvDetail: JSON.stringify(this.tableDataList),
        UserID: this.global.getUserID()
      };


      if (this.validFlag == true) {
        this.validFlag = false;
        if (type == 'hold') {
          if (this.holdBtnType == 'Hold') {
            this.app.startLoaderDark();
            postData.InvType = 'HP';
            this.http.post(environment.mainApi + this.global.inventoryLink + 'InsertPurchase', postData).subscribe(
              (Response: any) => {
                if (Response.msg == 'Data Saved Successfully') {
                  this.msg.SuccessNotify(Response.msg);
                  this.reset();

                } else {
                  this.msg.WarnNotify(Response.msg);
                }
                this.app.stopLoaderDark();
                this.validFlag = true;
              },
              (Error: any) => {
                this.app.stopLoaderDark();
                this.validFlag = true;
              }
            )
          } else if (this.holdBtnType == 'ReHold') {
            this.global.openPinCode().subscribe(pin => {
              if (pin != '') {
                this.app.startLoaderDark();
                postData['PinCode'] = pin;
                this.http.post(environment.mainApi + this.global.inventoryLink + 'UpdateHoldInvoice', postData).subscribe(
                  (Response: any) => {
                    if (Response.msg == 'Data Updated Successfully') {
                      this.msg.SuccessNotify(Response.msg);
                      this.reset();

                    } else {
                      this.msg.WarnNotify(Response.msg);
                    }
                    this.app.stopLoaderDark();

                    this.validFlag = true;
                  },
                  (Error: any) => {
                    this.app.stopLoaderDark();
                    this.validFlag = true;
                  }
                )
              }else{
                this.validFlag = true;
              }
            })
          }

        } else if (type == 'purchase') {

          this.global.confirmAlert().subscribe(
            (Response: any) => {
              if (Response == true) {

                this.app.startLoaderDark();
                postData.InvType = 'P';
                this.http.post(environment.mainApi + this.global.inventoryLink + 'InsertPurchase', postData).subscribe(
                  (Response: any) => {
                    if (Response.msg == 'Data Saved Successfully') {
                      this.msg.SuccessNotify(Response.msg);
                      this.reset();

                    } else {
                      this.msg.WarnNotify(Response.msg);
                    }
                    this.app.stopLoaderDark();
                    this.validFlag = true;
                  },
                  (Error: any) => {
                    this.app.stopLoaderDark();
                    this.validFlag = true;
                  }
                )

              } else {
                this.validFlag = true;
              }
            }
          )
        }

      }
    }
  }


  reset() {
    this.PBarcode = '';
    this.invoiceDate = new Date();
    this.tableDataList = [];
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
    this.netTotal = 0;



  }


  netTotal = 0;

  getTotal() {

    // alert(this.overHead);
    // alert(this.discount);
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




  printBill(item: any) {

    this.billPrint.printBill(item);

  }

  cpTotal = 0;
  wohCPTotal = 0;
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

    this.onPartySelected();

    this.getBillDetail(item.invBillNo).subscribe(
      (Response: any) => {

        this.myTotalQty = 0;
        this.productImage = Response[Response.length - 1].productImage;
        this.discType = Response[0].discType;
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
            tempCostPrice: e.tempCostPrice,
            margin:((e.salePrice  - e.costPrice) / e.costPrice) * 100,
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
            gst: e.gst,
            et: e.et,
          })
        });

        this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
        this.getTotal();


      }
    )

  }


  public getBillDetail(billNo: any): Observable<any> {
    return this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSingleBillDetail?reqInvBillNo=' + billNo).pipe(retry(3));
  }


  searchBillType: any = 'Date';

  findHoldBills(type: any) {
    if (type == 'hp') {
      $('#edit').show();
    }

    if (type == 'p') {
      $('#edit').hide()
    }

    var date = this.searchBillType == 'Date' ? this.global.dateFormater(this.Date, '-') : '';

    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetInventoryBillSingleDate?Type=' + type + '&creationdate=' + date).subscribe(
      (Response: any) => {

        this.holdBillList = [];
        if (type == 'hp') {
          Response.forEach((e: any) => {
            if (e.approvedStatus == false) {
              this.holdBillList.push(e);
            }
          });
        }
        if (type == 'p') {
          this.holdBillList = Response;
        }
      }
    )
  }





  docInvBillNo = '';
  openDocumentModal(item: any) {
    this.docInvBillNo = item.invBillNo;
    this.AddDocument.getDocument(item.invBillNo);
    $('#holdModal').hide();
    $('#DocumentModal').show();

  }



  deleteProd(row: any) {

    $('#clsMdl').click();

    this.global.openPinCode().subscribe(pin => {
      if (pin != '') {
        //this.app.startLoaderDark();

        var postData = {
          InvBillNo: row.invBillNo,
          PinCode: pin,
          UserID: this.global.getUserID()
        }

        this.http.post(environment.mainApi + this.global.inventoryLink + 'DeleteBill', postData).subscribe((Response: any) => {
          if (Response.msg == 'Data Deleted Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.findHoldBills('hp');
            
            //this.app.stopLoaderDark();


          } else {
            this.msg.WarnNotify(Response.msg);
            //this.app.stopLoaderDark();
          }
        },
          (error: any) => {
            //this.app.stopLoaderDark();
          }
        )
      }
    })
  }



  editTotal(item: any) {

    if (this.DetailedPurchaseFeature) {
      return;
    }

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
        this.tableDataList[index].CostPrice = value / item.Quantity;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Price Updated",
          timer: 500,
        });
      }
    })
  }


  onMarginChange(item:any,index:any){
    var margin  =Number(item.margin);

    item.SalePrice = Number(item.CostPrice) + (Number(item.CostPrice) * (margin / 100));
    this.getTotal() ;

  }


}
