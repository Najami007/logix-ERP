import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

import { Router } from '@angular/router';
import { Observable, retry } from 'rxjs';
import { AdjBillPrintComponent } from '../../InvAdjustment/adj-bill-print/adj-bill-print.component';
import { PurchaseBillPrintComponent } from '../purchase-bill-print/purchase-bill-print.component';
import { POBillPrintComponent } from './pobill-print/pobill-print.component';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {

  @ViewChild(POBillPrintComponent) billPrint: any;

  crudList: any = { c: true, r: true, u: true, d: true };
  companyProfile: any = [];

  disableDateFeature = this.global.DisableInvDate;
  ImageUrlFeature = this.global.ImageUrlFeature;
  PONewCostFeature = this.global.PONewCostFeature;

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
    this.global.setHeaderTitle('Purchase Order');
    this.getLocation();
    $('.searchProduct').trigger('focus');
    this.getSuppliers();

    this.global.getProducts().subscribe(
      (data: any) => { this.productList = data; })
  }


  sortType = 'desc';

  btnType = 'Save';
  Date: Date = new Date();
  invBillNo = '-';
  holdBtnType = 'Hold';
  invoiceDate: Date = new Date();
  locationID = 0;
  locationList: any = [];
  invRemarks: any;
  PBarcode: any;
  productList: any = [];
  tableDataList: any = [];

  productImage: any;
  subTotal: number = 0;
  totalQty: number = 0;
  adjustmentType = 'OS';
  IssueBillList: any = [];

  salePriceTotal = 0;
  CostTotal = 0;
  newCostTotal = 0;


  projectID = this.global.getProjectID();
  partyID: any = 0;
  bookerID = 1;

  suppliersList: any = []

  getSuppliers() {
    this.global.getSupplierList().subscribe((data: any) => { this.suppliersList = data; });

  }

  changeOrder() {
    this.sortType = this.sortType == 'desc' ? 'asc' : 'desc';
    this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);

  }


  getLocation() {
    this.global.getWarehouseLocationList().subscribe((data: any) => { this.locationList = data; });
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
        $('#searchProduct').trigger('focus');

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
    this.getTotal();
    this.global.closeBootstrapModal('#prodModal', true);
    setTimeout(() => {
      $('#searchProduct').trigger('focus');
    }, 500);


  }


  pushProdData(data: any, qty: any) {

    if (this.partyID == 0) {
      this.msg.WarnNotify('Select Supplier');
      return;

    }



    /////// check already present in the table or not
    var condition = this.tableDataList.find(
      (x: any) => x.productID == data.productID
    );

    var index = this.tableDataList.indexOf(condition);
    //// push the data using index
    if (condition == undefined) {

      this.tableDataList.push({
        rowIndex: this.tableDataList.length == 0 ? this.tableDataList.length + 1
          : this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1
            : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1,
        productID: data.productID,
        productTitle: data.productTitle,
        barcode: data.barcode,
        productImage: this.ImageUrlFeature ? data.imagesPath : data.productImage,
        quantity: qty,
        wohCP: data.costPrice,
        tempCostPrice: data.costPrice,
        costPrice: data.costPrice,
        avgCostPrice: data.avgCostPrice,
        newCostPrice: data.costPrice,
        salePrice: data.salePrice,
        ovhPercent: 0,
        ovhAmount: 0,
        expiryDate: this.global.dateFormater(new Date(), '-'),
        batchNo: '-',
        batchStatus: '-',
        uomID: data.uomID,
        packing: data.packing,
        discInP: 0,
        discInR: 0,
        aq: data.aq,
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
        qty = total / this.tableDataList[index].salePrice;
      }
      this.tableDataList[index].quantity = parseFloat(this.tableDataList[index].quantity) + qty;

      /////// Sorting Table
      this.tableDataList[index].rowIndex = this.sortType == 'desc' ? this.tableDataList[0].rowIndex + 1 : this.tableDataList[this.tableDataList.length - 1].rowIndex + 1;
      this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
      this.productImage = this.tableDataList[index].productImage;
      this.getTotal();
    }

    this.PBarcode = '';

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



  showImg(item: any) {

    var index = this.tableDataList.findIndex((e: any) => e.productID == item.productID);
    this.productImage = this.tableDataList[index].productImage;

  }

  getTotal() {
    this.subTotal = 0;
    this.totalQty = 0;
    this.CostTotal = 0;
    this.newCostTotal = 0;
    this.salePriceTotal = 0;
    for (var i = 0; i < this.tableDataList.length; i++) {

      this.subTotal += (parseFloat(this.tableDataList[i].quantity) * parseFloat(this.tableDataList[i].costPrice));
      this.totalQty += parseFloat(this.tableDataList[i].quantity);
      this.CostTotal += (parseFloat(this.tableDataList[i].quantity) * parseFloat(this.tableDataList[i].costPrice));
      this.newCostTotal += (parseFloat(this.tableDataList[i].quantity) * parseFloat(this.tableDataList[i].newCostPrice));

      this.salePriceTotal += (parseFloat(this.tableDataList[i].quantity) * parseFloat(this.tableDataList[i].salePrice))
      // this.myTotal = this.mySubtoatal - this.myDiscount;
      // this.myDue = this.myPaid - this.myTotal;\



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
      e.preventDefault();
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


  SaveBill(type: any) {
    var isValidFlag = true;
    // this.tableDataList.forEach((p: any) => {

    //   p.quantity = parseFloat(p.quantity);
    //   p.salePrice = parseFloat(p.salePrice);
    //   p.costPrice = parseFloat(p.costPrice);


    //   if (p.quantity == 0 || p.quantity == '0' || p.quantity == '' || p.quantity == undefined || p.quantity == null) {
    //     this.msg.WarnNotify('(' + p.productTitle + ') Quantity is not Valid');
    //     isValidFlag = false;
    //     return;
    //   }


    // });

    var productList = this.tableDataList.filter((e: any) => Number(e.quantity) > 0)
    if (productList.length == 0) {
      this.msg.WarnNotify('No Quantity added of any product');
      return;
    }

    var postData: any = {
      InvType: 'PO',
      InvDate: this.global.dateFormater(this.invoiceDate, '-'),
      InvBillNo: this.invBillNo,
      LocationID: this.locationID,
      ProjectID: this.projectID,
      PartyID: this.partyID,
      BookerID: this.bookerID,
      BillTotal: this.subTotal,
      NetTotal: this.subTotal,
      Remarks: this.invRemarks || '-',
      InvoiceDocument: "-",
      InvDetail: JSON.stringify(productList),
      UserID: this.global.getUserID(),
    };


    if (this.tableDataList == '') {
      this.msg.WarnNotify('Atleast One Product Must Be Selected')
    } else if (this.partyID == 0) {
      this.msg.WarnNotify('Select Supplier')
    } else {


      if (isValidFlag == true) {


        if (this.btnType == 'Save') {
          this.app.startLoaderDark();
          this.http.post(environment.mainApi + this.global.inventoryLink + 'InsertPurchaseOrder', postData).subscribe(
            (Response: any) => {
              if (Response.msg == 'Data Saved Successfully') {
                this.msg.SuccessNotify(Response.msg);
                this.reset();
                this.app.stopLoaderDark();

              } else {
                this.msg.WarnNotify(Response.msg);
                this.app.stopLoaderDark();
              }
            },
            (Error: any) => {
              console.log(Error);
              this.msg.WarnNotify(Error);
              this.app.stopLoaderDark();
            }
          )
        }

        if (this.btnType == 'Update') {
          this.global.openPinCode().subscribe(pin => {
            if (pin != '') {
              this.app.startLoaderDark();

              postData['PinCode'] = pin;

              this.http.post(environment.mainApi + this.global.inventoryLink + 'UpdatePurchaseOrder', postData).subscribe(
                (Response: any) => {
                  if (Response.msg == 'Data Updated Successfully') {
                    this.msg.SuccessNotify(Response.msg);
                    this.reset();
                    this.app.stopLoaderDark();

                  } else {
                    this.msg.WarnNotify(Response.msg);
                    this.app.stopLoaderDark();
                  }
                },
                (Error: any) => {
                  console.log(Error);
                  this.msg.WarnNotify(Error);
                  this.app.stopLoaderDark();
                }
              )
            }
          })
        }


      }



    }



  }


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
    this.adjustmentType = '';
    this.CostTotal = 0;
    this.salePriceTotal = 0;
    this.newCostTotal = 0;

  }


  searchBillType: any = 'Date';

  FindSavedBills() {
    var date = this.searchBillType == 'Date' ? this.global.dateFormater(this.Date, '-') : '';
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetInventoryBillSingleDate?Type=PO&creationdate=' + date).subscribe(
      (Response: any) => {
        this.IssueBillList = Response;

      },
      (error: any) => {
        this.msg.WarnNotify(error.error.msg);
        console.log(error)
        this.app.stopLoaderDark();
      }
    )
  }



  printBill(item: any, type: any) {
    this.billPrint.printBill(item);
    this.billPrint.hidePrices = type == 'all' ? false : true;

  }

  retriveBill(item: any) {

    this.tableDataList = [];
    this.btnType = 'Update';
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
            productImage: e.productImage,
            quantity: e.quantity,
            avgCostPrice: e.avgCostPrice,
            costPrice: e.costPrice,
            salePrice: e.salePrice,
            newCostPrice:e.newCostPrice,
            expiryDate: this.global.dateFormater(new Date(e.expiryDate), '-'),
            batchNo: e.batchNo,
            batchStatus: e.batchStatus,
            uomID: e.uomID,
            packing: e.packing,
            discInP: e.discInP,
            discInR: e.discInR,
            aq: e.qtyIn - e.qtyOut,
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
    return this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSingleBillDetail?reqInvBillNo=' + billNo).pipe(retry(3));
  }


  //  DeleteInv(row:any){
  //   $('#holdModal').hide();
  //   this.global.openPinCode().subscribe(pin=>{
  //     $('#holdModal').show();
  //     if(pin != ''){
  //       this.app.startLoaderDark();
  //       this.http.post(environment.mainApi+this.global.inventoryLink+'DeleteBill',{
  //         InvBillNo: row.invBillNo,
  //         PinCode: pin,
  //         UserID: this.global.getUserID()
  //       }).subscribe(
  //         (Response:any)=>{
  //           if(Response.msg == 'Data Deleted Successfully'){

  //             this.msg.SuccessNotify(Response.msg);
  //             this.FindSavedBills();
  //             this.app.stopLoaderDark();

  //           }else{
  //             this.msg.WarnNotify(Response.msg)
  //           }


  //         }
  //       )
  //     }
  //   })
  //  }


  approveBill(row: any) {
    // alert(row.invBillNo);
    $('#holdModal').hide();
    this.global.openPinCode().subscribe(pin => {
      $('#holdModal').show();
      if (pin != '') {
        this.app.startLoaderDark();

        var postData = {
          InvBillNo: row.invBillNo,
          Remarks: '-',
          PinCode: pin,
          UserID: this.global.getUserID()
        }
        this.http.post(environment.mainApi + this.global.inventoryLink + 'ApproveInventoryBill', postData).subscribe(
          (Response: any) => {
            if (Response.msg == 'Bill Approved Successfully') {

              this.msg.SuccessNotify(Response.msg);
              this.FindSavedBills();


            } else {
              this.msg.WarnNotify(Response.msg)
            }


            this.app.stopLoaderDark();


          },
          (Error: any) => {
            this.msg.WarnNotify(Error);
            this.app.stopLoaderDark();
          }
        )
      }
    })
  }

  EmptyData() {
    if (this.tableDataList.length == 0) return;
    this.global.confirmAlert().subscribe(
      (Response: any) => {
        if (Response == true) {
          this.reset();
        }
      })
  }




  getSupplierProductList() {

    if (this.partyID == 0) {
      this.msg.WarnNotify('Select Supplier');
      return;
    }
    this.http.get(environment.mainApi + this.global.inventoryLink + 'GetSupplierProducts_17?reqSupId=' + this.partyID).subscribe(
      {
        next: (Response: any) => {
          if (Response.length > 0) {
            Response.forEach((e: any) => {
              this.pushProdData(e, 0);
            })
          } else {
            this.msg.WarnNotify('No Products Found')
          }
        }
      }
    )
  }





}
