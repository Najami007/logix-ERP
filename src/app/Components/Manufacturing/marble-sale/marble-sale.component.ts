import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AppComponent } from "src/app/app.component";
import { AddpartyComponent } from "src/app/Components/Company/party/addparty/addparty.component";
import { GlobalDataModule } from "src/app/Shared/global-data/global-data.module";
import { NotificationService } from "src/app/Shared/service/notification.service";
import { environment } from "src/environments/environment.development";
import { DeliveryChallanComponent } from "../ManufacturingComFiles/delivery-challan/delivery-challan.component";
import { OrderPrintComponent } from "../ManufacturingComFiles/order-print/order-print.component";
import { MnuInvoicePrintComponent } from "../ManufacturingComFiles/mnu-invoice-print/mnu-invoice-print.component";
import { Observable, retry } from "rxjs";



@Component({
  selector: 'app-marble-sale',
  templateUrl: './marble-sale.component.html',
  styleUrls: ['./marble-sale.component.scss']
})
export class MarbleSaleComponent implements OnInit {

  @ViewChild(DeliveryChallanComponent) deliveryChallan: any;
  @ViewChild(OrderPrintComponent) orderPrint: any;
  @ViewChild(MnuInvoicePrintComponent) saleInvoicePrint: any;

  apiReq = environment.mainApi + this.global.manufacturingLink;

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

  }
  ngOnInit(): void {
    this.getSavedOrder();
    this.getSavedSale();
    this.global.setHeaderTitle('Sale');
    this.getItemList();
    this.getShippingCompany();
    this.getPartyList();

  }


  txtSearch: any = '';
  curDate = new Date();
  startDate: Date = new Date(this.curDate.getFullYear(), this.curDate.getMonth(), 1);
  endDate: Date = new Date(this.curDate.getFullYear(), this.curDate.getMonth() + 1, 0);
  saleStartDate: Date = new Date(this.curDate.getFullYear(), this.curDate.getMonth(), 1);
  saleEndDate: Date = new Date(this.curDate.getFullYear(), this.curDate.getMonth() + 1, 0);

  btnType = 'Save';
  invBillNo = '';
  PBarcode: any = '';
  productList: any = [];
  customerPreviousBalance: any = [];
  orderRefrence: any = '';
  partyID: any = 0;
  invoiceDate: any = new Date();
  partyList: any = [];
  deliverTo: any = '';
  deliveryContactNo: any = '';
  deliveryAddress: any = ''
  deliveryRemarks: any = '';
  scAutoID: any = 0;
  deliveryDate: any = new Date();
  remarks: any = '';
  netTotal = 0;
  projectID = this.global.getProjectID();


  getPartyList() {
    this.global.getCustomerList().subscribe((data: any) => { this.partyList = data; });
  }




  @ViewChild('customer') myParty: any;
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



  shippingCompanyList: any = [];
  getShippingCompany() {
    this.http.get(environment.mainApi + this.global.manufacturingLink + 'GetShpCompanies').subscribe(
      {
        next: (Response: any) => {
          this.shippingCompanyList = Response;
        },
        error: (error: any) => {
          console.log(error);
        }
      }
    )
  }



  rowFocused = -1;
  prodFocusedRow = 0;
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
        e.preventDefault();
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
        if (this.itemList.length >= 1) {
          e.preventDefault();
          $('.prodRow0').trigger('focus');
        }
      }
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
        this.getTotal();
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

  tableDataList: any = [];

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
              mnuItemID: item.mnuItemID,
              productTitle: item.mnuItemTitle,
              quantity: 1,
              costPrice: item.mnuItemCostPrice,
              salePrice: item.mnuItemSalePrice
            })


            this.PBarcode = '';
            this.getTotal();

            $('.searchProduct').trigger('focus');

          }else{
            this.msg.WarnNotify('No Product Found')
          }

        }
      }
    )


    this.PBarcode = '';
    this.getTotal();

    $('.mbsearchProduct').trigger('focus');


  }


  getTotal() {

    this.netTotal = 0;

    this.tableDataList.forEach((e: any) => {
      this.netTotal += e.salePrice * e.quantity;
    });

  }



  save() {


    var inValidQty = this.tableDataList.filter((e: any) => e.quantity == '0' || e.quantity == 0 || e.quantity == '');

    if (inValidQty.length > 0) {
      this.msg.WarnNotify(`${inValidQty[0].productTitle} Quantity is not valid`);
      return;
    }


    if (this.tableDataList.length == 0) {
      this.msg.WarnNotify('No Item Entered');
      return;
    }

    if (this.partyID == 0 || this.partyID == undefined) {
      this.msg.WarnNotify('Select Customer');
      return;
    }

    if (this.deliverTo == '' || this.deliverTo == undefined) {
      this.msg.WarnNotify('Select Enter Delivery To');
      return;
    }
    if (this.deliveryContactNo == '' || this.deliveryContactNo == undefined) {
      this.msg.WarnNotify('Select Enter Delivery To Contact No');
      return;
    }

    if (this.deliveryAddress == '' || this.deliveryAddress == undefined) {
      this.msg.WarnNotify('Select Enter Delivery Address');
      return;
    }




    var postData = {
      InvBillNo: this.invBillNo,
      InvDate: this.global.dateFormater(this.invoiceDate, ''),
      PartyID: this.partyID,
      InvType: "ORDER",
      ProjectID: this.projectID,
      Remarks: this.remarks || '-',
      NetTotal: this.netTotal,

      SCAutoID: this.scAutoID,
      DeliveryDate: this.global.dateFormater(this.deliveryDate, ''),
      DeliverTo: this.deliverTo,
      DeliveryContactNo: this.deliveryContactNo,
      DeliveryAddress: this.deliveryAddress,
      DeliveryRemarks: this.deliveryRemarks || '-',

      SaleDetail: JSON.stringify(this.tableDataList),
      UserID: this.global.getUserID()

    }

    if (this.btnType == 'Save') {
      this.insert('insert', postData);
    }

    if (this.btnType == 'Update') {

      this.global.openPinCode().subscribe(pin => {
        if (pin != '') {
          postData['PinCode'] = pin;
          this.insert('update', postData);
        }
      })


    }

  }

  isProcessing = false;

  insert(type: any, postData: any) {

    var url = '';

    if (type == 'insert') {
      url = 'InsertOrder';
    }
    if (type == 'update') {
      url = 'UpdateOrder';
    }

    if (this.isProcessing) return;
    this.app.startLoaderDark();
    this.isProcessing = true;
    this.http.post(this.apiReq + url, postData).subscribe(
      {
        next: (Response: any) => {
          if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.reset();
            this.getSavedOrder();
          } else {
            this.msg.WarnNotify(Response.msg);
          }
          this.app.stopLoaderDark();
          this.isProcessing = false;
        },
        error: error => {
          console.log(error);
          this.app.stopLoaderDark();
          this.isProcessing = false;


        }
      }
    )


  }



  reset() {
    this.invoiceDate = new Date();
    this.partyID = 0;
    this.remarks = '';
    this.netTotal = 0;
    this.scAutoID = 0;
    this.billTotal = 0;
    this.billDiscount = 0;
    this.deliveryDate = new Date();
    this.deliverTo = '';
    this.deliveryContactNo = '';
    this.deliveryAddress = '';
    this.deliveryRemarks = '';
    this.tableDataList = [];
    this.customerPreviousBalance = 0;
    this.btnType = 'Save';
    this.PBarcode = '';


  }


  edit(item: any) {
    this.reset();
    this.invBillNo = item.invBillNo;
    this.invoiceDate = new Date(item.invDate);
    this.partyID = item.partyID;
    this.projectID = item.projectID;
    this.remarks = item.remarks;
    this.netTotal = item.netTotal;
    this.scAutoID = item.scAutoID;
    this.btnType = 'Update';
    this.getInvDetail(item.invBillNo);
    this.changeTab(0)

  }


  getInvDetail(orderNo: any) {
    this.http.get(this.apiReq + `GetOrderDetail?BillNo=${orderNo}`).subscribe(
      {
        next: (Response: any) => {
          this.tableDataList = [];
          if (Response.length > 0) {
            Response.forEach((e: any) => {
              this.tableDataList.push({
                mnuItemID: e.mnuItemID, productTitle: e.productTitle, quantity: e.quantity, costPrice: e.costPrice, salePrice: e.salePrice
              })

              this.deliveryDate = new Date(Response[0].deliveryDate);
              this.deliverTo = Response[0].deliverTo;
              this.deliveryContactNo = Response[0].deliveryContactNo;
              this.deliveryAddress = Response[0].deliveryAddress;
              this.deliveryRemarks = Response[0].deliveryRemarks;
              this.scAutoID = Response[0].scAutoID;
            })
          }
        },
        error: error => {
          console.log(error);
        }
      }
    )
  }


  savedDataList: any = [];

  getSavedOrder() {

    var fromDate = this.global.dateFormater(this.startDate, '');
    var toDate = this.global.dateFormater(this.endDate, '');
    this.http.get(this.apiReq + `GetOrder?reqUID=0&FromDate=${fromDate}&ToDate=${toDate}&FromTime=00:00&ToTime=23:59:59`).subscribe(
      {
        next: (Response: any) => {
          this.savedDataList = Response;
        },
        error: error => {
          console.log(error);
        }
      }
    )
  }

  saleSavedDataList: any = [];
  getSavedSale() {

    var fromDate = this.global.dateFormater(this.saleStartDate, '');
    var toDate = this.global.dateFormater(this.saleEndDate, '');
    this.http.get(this.apiReq + `GetMnuSale?reqUID=0&FromDate=${fromDate}&ToDate=${toDate}&FromTime=00:00&ToTime=23:59:59`).subscribe(
      {
        next: (Response: any) => {
          this.saleSavedDataList = Response;
        },
        error: error => {
          console.log(error);
        }
      }
    )
  }




  tabIndex = 0;
  changeTab(tabNum: any) {
    this.tabIndex = tabNum;

  }


  billTotal = 0;
  billDiscount = 0;


  approveOrder(item: any) {

    if (item.approvedStatus) return;


    this.invBillNo = item.invBillNo;
    this.partyID = item.partyID;
    this.projectID = item.projectID;
    this.billTotal = item.netTotal;
    this.netTotal = item.netTotal;
    this.scAutoID = item.scAutoID;
    this.getInvDetail(item.invBillNo);

    this.global.openBootstrapModal('#saleModal', true);


  }



  saveSale() {


    if (this.tableDataList.length == 0) {
      this.msg.WarnNotify('No Item Entered');
      return;
    }

    if (this.partyID == 0 || this.partyID == undefined) {
      this.msg.WarnNotify('Select Customer');
      return;
    }


    var postData = {
      HoldInvNo: this.invBillNo,
      InvDate: this.global.dateFormater(this.invoiceDate, '-'),
      PartyID: this.partyID,
      InvType: "S",
      ProjectID: this.projectID,
      BookerID: 1,
      PaymentType: "Credit",
      Remarks: this.remarks,
      GstAmount: 0,
      GstValue: 0,
      BillTotal: this.billTotal,
      BillDiscount: this.billDiscount,
      OtherCharges: 0,
      NetTotal: this.billTotal - Number(this.billDiscount),
      CashRec: 0,
      Change: 0,
      BankCoaID: 0,
      BankCash: 0,
      InvoiceDocument: "-",
      SaleDetail: JSON.stringify(this.tableDataList),
      UserID: this.global.getUserID()
    }

    this.global.closeBootstrapModal('#saleModal', true);

    this.global.openPinCode().subscribe(pin => {
      if (pin != '') {
        postData['PinCode'] = pin;
        this.insertSale(postData);
      }
    })



  }


  insertSale(postData: any) {
    this.http.post(this.apiReq + 'InsertMnuSale', postData).subscribe(
      {
        next: (Response: any) => {
          if (Response.msg == 'Data Saved Successfully' || Response.msg == 'Data Updated Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.reset();
            this.getSavedOrder();
            this.getSavedSale();
            this.global.closeBootstrapModal('#saleModal', true);
          } else {
            this.msg.WarnNotify(Response.msg);
            this.global.openBootstrapModal('#saleModal', true);
          }
          this.app.stopLoaderDark();
          this.isProcessing = false;
        },
        error: error => {
          console.log(error);
          this.app.stopLoaderDark();
          this.isProcessing = false;


        }
      }
    )
  }



  print(id: any) {
    this.global.printData(id);
  }



  printChallan(item: any) {

    this.deliveryChallan.printChallan(item.invBillNo);

  }


  printOrder(item: any) {

    this.orderPrint.printChallan(item.invBillNo);

  }

  printSaleInvoice(item: any) {

    this.saleInvoicePrint.printChallan(item.invBillNo);

  }



}

