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
import { CustomerIssueBillPrintComponent } from '../../Inventory/CusotmerIssuance/customer-issue-bill-print/customer-issue-bill-print.component';
import { ProductionPrintComponent } from './production-print/production-print.component';


@Component({
  selector: 'app-production-item-receiving',
  templateUrl: './production-item-receiving.component.html',
  styleUrls: ['./production-item-receiving.component.scss']
})
export class ProductionItemReceivingComponent implements OnInit {


  apiReq: any = environment.mainApi + this.global.manufacturingLink;

  @ViewChild(ProductionPrintComponent) billPrint: any;

  crudList: any = { c: true, r: true, u: true, d: true };
  companyProfile: any = [];
  disableDateFeature = this.global.DisableInvDate;
  editSpFeature = this.global.editSpFeature;
  LessToCostFeature = this.global.LessToCostFeature;

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
    this.global.setHeaderTitle('Item Production');
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

projectList:any = [];
    getProjectList(){
    this.http.get(environment.mainApi+this.global.companyLink+'getproject').subscribe(
      (Response:any)=>{
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

    this.http.get(this.apiReq + 'GetAllMnuItems').subscribe(
      {
        next: (Response: any) => {
          if (Response.length > 0) {
            this.itemList = Response.filter((e: any) => e.activeStatus == true && e.approvedStatus == true);
          }
        },
        error: error => {
          console.log(error);
        }
      }
    )

  }





  searchByCode(e: any) {

    var barcode = this.PBarcode;
    var qty: number = 0;
    var BType = '';

    if (this.PBarcode !== '') {
      if (e.keyCode == 13) {

        var row = this.itemList.filter((e: any) => e.mnuItemCode == barcode);

        if (row.length > 0) {
          this.addMenuItem(row[0])
        } else {
          this.msg.WarnNotify('Item Not Found');
        }

      }
    }
  }



  getSingleMenuItem(item: any): Observable<any> {
    return this.http.get(this.apiReq + 'GetAllMnuItems?mnuItemID=' + item.mnuItemID).pipe(retry(3))
  }


  addMenuItem(data: any) {
    this.getSingleMenuItem(data).subscribe(
      {
        next: (Response: any) => {
          if (Response.length > 0) {
            var item = Response[0];
            var index = this.tableDataList.findIndex((e: any) => e.mnuItemID == item.mnuItemID);

            if (index != -1) {
              this.tableDataList[index].quantity += 1;
              this.PBarcode = '';
              $('.mbsearchProduct').trigger('focus');
              this.getTotal();
              return;


            }


            this.tableDataList.push({
              ProductID: 0,
              mnuItemID: item.mnuItemID,
              barcode: item.mnuItemCode,
              productTitle: item.mnuItemTitle,
              quantity: 1,
              mnuLabourCharges: item.mnuLabourCharges,
              costPrice: item.mnuItemCostPrice,
              avgCostPrice: item.mnuItemCostPrice,
              salePrice: item.mnuItemSalePrice
            })

            this.PBarcode = '';
            this.getTotal();

            $('.searchProduct').trigger('focus');

          }

        }
      }
    )
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

      this.subTotal += (Number(this.tableDataList[i].quantity) * Number(this.tableDataList[i].mnuLabourCharges));
      this.totalQty += Number(this.tableDataList[i].quantity);
      this.CostTotal += (Number(this.tableDataList[i].quantity) * Number(this.tableDataList[i].mnuLabourCharges));
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


    var inValidQtyProdList = this.tableDataList.filter((p: any) => p.quantity == 0 || p.quantity == '0' || p.quantity == null || p.quantity == undefined || p.quantity == '')

    if (inValidQtyProdList.length > 0) {
      this.msg.WarnNotify('(' + inValidQtyProdList[0].productTitle + ') Quantity is not Valid');
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

    if (this.partyID == undefined || this.partyID == 0) {
      this.msg.WarnNotify('Select Contractor');
      return;
    }

    var postData = {
      InvType: 'PRD',
      InvBillNo: this.invBillNo,
      InvDate: this.global.dateFormater(this.invoiceDate, '-'),
      PartyID: this.partyID,
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
      url = 'InsertMnuProduction';
    }
    if (type == 'update') {
      url = 'UpdateMnuProduction';
    }

    this.app.startLoaderDark();
    if (this.isProcessing) return;
    this.isProcessing = true;
    this.http.post(environment.mainApi + this.global.manufacturingLink + url, postData).subscribe(
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
    var url = `${environment.mainApi}${this.global.inventoryLink}GetIssueInventoryBillSingleDate?Type=${type}&creationdate=${date}`
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


        Response.forEach((e: any) => {
          this.totalQty += e.quantity;
          this.tableDataList.push({
            ProductID: 0,
            mnuItemID: e.mnuItemID,
            barcode: e.barcode,
            productTitle: e.productTitle,
            quantity: e.quantity,
            mnuLabourCharges: e.mnuLabourCharges,
            costPrice: e.costPrice,
            avgCostPrice: e.avgCostPrice,
            salePrice: e.salePrice

          })
        });

        this.getTotal();

      }
    )
  }


  public getBillDetail(billNo: any): Observable<any> {
    var url = `${this.apiReq}PrintMnuBill?BillNo=${billNo}`;
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
              this.FindSavedBills('HIC');
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
        this.http.post(this.apiReq + 'PostProductionBill', {
          InvBillNo: row.invBillNo,
          Remarks: '-',
          PinCode: pin,
          UserID: this.global.getUserID()
        }).subscribe(
          {
            next: (Response: any) => {
              if (Response.msg == 'Data Posted Successfully') {
                this.msg.SuccessNotify(Response.msg);
                this.FindSavedBills('PRD');
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