import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment.development';

import { Router } from '@angular/router';
import { Observable, retry } from 'rxjs';
import { AddpartyComponent } from 'src/app/Components/Company/party/addparty/addparty.component';
import Swal from 'sweetalert2';
import { ProductionPrintComponent } from '../production-print/production-print.component';

@Component({
  selector: 'app-production-receiving',
  templateUrl: './production-receiving.component.html',
  styleUrls: ['./production-receiving.component.scss']
})
export class ProductionReceivingComponent implements OnInit {


  apiReq: any = environment.mainApi + this.global.inventoryLink;

  @ViewChild(ProductionPrintComponent) billPrint: any;

  crudList: any = { c: true, r: true, u: true, d: true };
  companyProfile: any = [];
  disableDateFeature = this.global.DisableInvDate;
  editSpFeature = this.global.editSpFeature;
  LessToCostFeature = this.global.LessToCostFeature;

  ImageUrlFeature = this.global.ImageUrlFeature;


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
    this.global.setHeaderTitle('Production Receiving');
    this.getLocation();
    this.getPartyList();
    this.getItemList();
    this.getProjectList();
    $('.searchProduct').trigger('focus');

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
  invLocationID = 0;
  locationList: any = [];
  invRemarks: any;
  PBarcode: any;
  productList: any = [];
  tableDataList: any = [];
  partyList: any = []

  productImage: any;
  subTotal: number = 0;
  totalQty: number = 0;
  SavedBillList: any = [];

  roleTypeID = this.global.getRoleTypeID();

  salePriceTotal = 0;
  CostTotal = 0;

  projectID = this.global.getProjectID();
  bookerID = 1;
  partyID = 0;


  changeOrder() {
    this.sortType = this.sortType == 'desc' ? 'asc' : 'desc';
    this.sortType == 'desc' ? this.tableDataList.sort((a: any, b: any) => b.rowIndex - a.rowIndex) : this.tableDataList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);

  }


  getLocation() {
    this.global.getWarehouseLocationList().subscribe((data: any) => {
      this.locationList = data;

    });
  }

  projectList: any = [];
  getProjectList() {
    this.http.get(environment.mainApi + this.global.companyLink + 'getproject').subscribe(
      (Response: any) => {
        this.projectList = Response;
      }
    )
  }



  ////////////////////////////// getting list of Customer ///////
  getPartyList() {
    this.http.get(environment.mainApi + this.global.companyLink + 'getParty').subscribe(
      {
        next: (Response: any) => {
          if (Response.length > 0) {
            this.partyList = Response.filter((e: any) => e.partyType == 'Labour');

          }
        },
        error: (error: any) => {
          console.log(error);
        }
      }
    )
  }


  ///////////////////////////////////////////


  itemList: any = [];

  getItemList() {

    this.http.get(this.apiReq + 'GetProductRecipeList').subscribe(
      {
        next: (Response: any) => {
          if (Response.length > 0) {
            this.itemList = Response;
          }
        },
        error: error => {
          console.log(error);
        }
      }
    )

  }





  ////////////////////// sarch Product By Barcode Funct //////////

  searchByCode(e: any) {

    var barcode = this.PBarcode;
    var qty: number = 1;
    var BType = '';

    if (this.PBarcode !== '') {
      if (e.keyCode == 13) {


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
    this.global.getProdDetail(data.productRecipeID, '').subscribe(
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
    if (data.productNature !== 'Finished') {
      this.msg.WarnNotify('Product Not Found');
      return;
    }
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
        salePrice: data.salePrice,
        ovhPercent: 0,
        ovhAmount: 0,
        expiryDate: this.global.dateFormater(new Date(), '-'),
        uomID: data.uomID,
        packing: 1,
        aq: data.aq,
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







  ///////////////////// Getting Total From Table Data List Common Funcion /////////

  getTotal() {
    this.subTotal = 0;
    this.totalQty = 0;
    this.CostTotal = 0;
    this.salePriceTotal = 0;
    for (var i = 0; i < this.tableDataList.length; i++) {

      this.subTotal += (Number(this.tableDataList[i].quantity) * Number(this.tableDataList[i].avgCostPrice));
      this.totalQty += Number(this.tableDataList[i].quantity);
      this.CostTotal += (Number(this.tableDataList[i].quantity) * Number(this.tableDataList[i].avgCostPrice));
      this.salePriceTotal += (Number(this.tableDataList[i].quantity) * Number(this.tableDataList[i].salePrice));


      // this.myTotal = this.mySubtoatal - this.myDiscount;
      // this.myDue = this.myPaid - this.myTotal;\
    }
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
  SaveBill() {


    var inValidQtyProdList = this.tableDataList.filter((p: any) => Number(p.quantity) == 0 || p.quantity == '0' || p.quantity == null || p.quantity == undefined || p.quantity == '')
    var invalidCostPrice = this.tableDataList.filter((p: any) => Number(p.avgCostPrice ) > Number(p.salePrice) || p.avgCostPrice == 0 || p.avgCostPrice == '0' || p.avgCostPrice == null || p.avgCostPrice == undefined || p.avgCostPrice == '')

    if (inValidQtyProdList.length > 0) {
      this.msg.WarnNotify('(' + inValidQtyProdList[0].productTitle + ') Quantity is not Valid');
      return;
    }
       if (invalidCostPrice.length > 0) {
      this.msg.WarnNotify('(' + invalidCostPrice[0].productTitle + ') Cost is not Valid');
      return;
    }



    if (this.tableDataList == '') {
      this.msg.WarnNotify('Atleast One Product Must Be Selected');
      return;
    }
    if (this.locationID == undefined || this.locationID == 0) {
      this.msg.WarnNotify('Select Location');
      return;
    }

    var postData = {
      InvType: 'MFG',
      InvBillNo: this.invBillNo,
      InvDate: this.global.dateFormater(this.invoiceDate, '-'),
      LocationID: this.locationID,
      ProjectID: this.projectID,
      BillTotal: this.subTotal,
      NetTotal: this.subTotal,
      Remarks: this.invRemarks || '-',

      SaleDetail: JSON.stringify(this.tableDataList),
      PinCode: '',
      UserID: this.global.getUserID(),
    }

    if (this.btnType == 'Save') {
      this.insert('insert', postData);
    }

    if (this.btnType == 'Update') {

      this.global.openPinCode().subscribe(pin => {
        if (pin !== '') {
          postData.PinCode = pin;
          this.insert('update', postData);
        }
      });


    }



  }



  ///////////////// Insert Data to API ///////////////////////

  isProcessing = false;


  insert(type: any, postData: any) {

    var url = '';
    if (type == 'insert') {
      url = 'InsertManufacturing';
    }
    if (type == 'update') {
      url = 'UpdateManufacturing';
    }

    this.app.startLoaderDark();
    if (this.isProcessing) return;
    this.isProcessing = true;
    this.http.post(this.apiReq + url, postData).subscribe(
      (Response: any) => {
        if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
          this.msg.SuccessNotify(Response.msg);
          this.reset();

        } else {
          this.msg.WarnNotify(Response.msg);
        }
        this.app.stopLoaderDark();

        this.isProcessing = false
      },
      (Error: any) => {
        this.msg.WarnNotify(Error);
        this.app.stopLoaderDark();
        this.isProcessing = false
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
    this.SavedBillList = [];
    this.CostTotal = 0;
    this.salePriceTotal = 0;
    this.partyID = 0;

  }



  //////////////////////////// Getting Saved Bill Function ///////////////////

  searchBillType: any = 'Date';

  FindSavedBills(type: any) {

    var date = this.searchBillType == 'Date' ? this.global.dateFormater(this.Date, '-') : '';
    var url = `${environment.mainApi + this.global.inventoryLink}GetIssueInventoryBillSingleDate?Type=${type}&creationdate=${date}`
    this.http.get(url).subscribe(
      (Response: any) => {
        this.SavedBillList = Response;

      },
      (Error: any) => {
        this.msg.WarnNotify(Error);
        console.log(Error);
      }
    )
  }



  printBill(item: any) {
    this.billPrint.printBill(item);
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
        if (Response.length > 0) {
          Response.forEach((e: any) => {
            this.pushProdData(e, e.quantity);
          })
        }

        this.getTotal();

      }
    )
  }


  public getBillDetail(billNo: any): Observable<any> {
    var url = `${this.apiReq}GetSingleBillDetail?reqInvBillNo=${billNo}`;
    return this.http.get(url).pipe(retry(3));
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
              this.FindSavedBills('MFG');
            } else {
              this.msg.WarnNotify(Response.msg)
            }
            this.app.stopLoaderDark();

          },
          (Error: any) => {
            console.log(Error);
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




  /////////////////////////////////////////////////////


  approveBill(row: any) {
    // alert(row.invBillNo);
    $('#holdModal').hide();
    this.global.openPinCode().subscribe(pin => {
      $('#holdModal').show();
      if (pin != '') {
        this.app.startLoaderDark();

        var postData = {
          InvBillNo: row.invBillNo,
          InvDate: this.global.dateFormater(new Date(), ''),
          InvType: 'MFG',
          LocationID: row.locationID,
          ProjectID: row.projectID,
          BillTotal: 0,
          NetTotal: 0,
          Remarks: '-',
          PinCode: pin,
          UserID: this.global.getUserID()
        }


        this.http.post(this.apiReq + 'PostManufacturing', postData).subscribe(
          {
            next: (Response: any) => {
              if (Response.msg == 'Data Posted Successfully') {
                this.msg.SuccessNotify(Response.msg);
                this.FindSavedBills('MFG');
              } else {
                this.msg.WarnNotify(Response.msg)
              }
              this.app.stopLoaderDark();
            },
            error: (Error: any) => {
              console.log(Error);
              this.msg.WarnNotify(Error);
              this.app.stopLoaderDark();
            }
          }
        )
      }
    })
  }





}
