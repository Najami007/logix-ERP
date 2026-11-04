import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { error } from 'jquery';
import { Observable, retry } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';
import { PrintMinigBillComponent } from './print-minig-bill/print-minig-bill.component';
import { PrintBillTokenComponent } from './print-bill-token/print-bill-token.component';

export interface ProductDetail {
  mnuItemID: number;
  mnuItemTitle: string;
  mnuItemCode: string;
  quantity: number;
  costPrice: number;
  avgCostPrice: number;
  salePrice: number;
}

export interface SaleInvoice {
  invoiceNo: string;
  invoiceDate: any;
  partyID: number | null;
  vehicleDetail: string;
  remarks: string;
  deliveryDate: any;
  deliverTo: string;
  contactNo: string;
  deliveryAddress: string;
  transportCharges: number;
  labourCharges: number;
  transportPartyID: number | null;
  productDetail: any[];
  paymentType: string;
  billDiscount: number | null;
  cashAmount: number | null;
  bankAmount: number | null;
  bankCoaID: number | null
}

@Component({
  selector: 'app-mining-sale',
  templateUrl: './mining-sale.component.html',
  styleUrls: ['./mining-sale.component.scss']
})
export class MiningSaleComponent implements OnInit {

  @ViewChild(PrintMinigBillComponent) invoicePrint!: PrintMinigBillComponent;
   @ViewChild(PrintBillTokenComponent) tokenPrint!: PrintBillTokenComponent; 

  ngOnInit(): void {
    this.global.setHeaderTitle('Mining Sale');
    this.getProductList();
    this.getPartyList();
    this.getTransporterList();
    this.getBankList();
    this.getSavedInvoices();
  }



  public http = inject(HttpClient);
  public global = inject(GlobalDataModule);
  public msg = inject(NotificationService);
  public app = inject(AppComponent);


  // ---- Replace these with data loaded from your API ----
  parties: any = [];
  shippingCompanies: any = [];
  menuItems: any = [];
  // -------------------------------------------------------


  customerVehicleList:any = [];
  
  getCustomerVehicleList() {
    var url = `${environment.mainApi + this.global.miningLink}GetMine`;
    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          this.customerVehicleList = Response;
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }


  @ViewChild('customerVehicle') myAddVehicle: any;

  addCustomerVehicle(status: any) {
    if (status == 'open') {
      setTimeout(() => {
        this.myAddVehicle.close()
      }, 200);
      this.global.openBootstrapModal('#addCustomerVehicleModal', true);
    }
    if (status == 'close') {
      this.global.closeBootstrapModal('#addCustomerVehicleModal', true);
      this.getCustomerVehicleList();
    }
  }


  getProductList() {
    this.http.get(environment.mainApi + this.global.miningLink + 'GetMiningProductionItem').subscribe(
      {
        next: (Response: any) => {
          console.log(Response);
          this.menuItems = Response.filter((e:any)=> e.activeStatus);
        },
        error: (error) => {
          console.log(error);

        }
      }
    )
  }

  getPartyList() {
    this.global.getCustomerList().subscribe((data: any) => { this.parties = data; });
  }


  getTransporterList() {

    this.global.getPartyList().subscribe((data: any) => {
      if (data.length > 0) {
        this.shippingCompanies = data.filter((e: any) => e.partyType == 'Transporter');
      }
    })
  }


  curDate = new Date();
  fromDate: any = this.setDates('start');
  toDate: any = this.setDates('end');

  setDates(type: 'start' | 'end'): Date {
    const y = this.curDate.getFullYear();
    const m = this.curDate.getMonth();

    return type === 'start'
      ? new Date(y, m, 1)        // first day of the month
      : new Date(y, m + 1, 0);   // day 0 of next month = last day of this month
  }

  filterPartyID: any = 0;

  clearFilters(): void {
    this.invoiceSearch = '';
    this.filterPartyID = 0;
    this.savedDataList = this.tmpSavedDataList;
    this.applyFilters();
  }

  get hasFilters(): boolean {
    return this.invoiceSearch.trim() !== '' || this.filterPartyID !== 0;
  }

  editingId: any = null;
  expandedId: number | null = null;

  selectedTab = 0;
  model: SaleInvoice = this.emptyInvoice();
  invoices: SaleInvoice[] = [];
  editIndex = -1;
  invoiceCounter = 1;

  itemSearch = '';
  invoiceSearch = '';

  today(): string {
    return new Date().toISOString().substring(0, 10);
  }

  emptyInvoice(): SaleInvoice {
    return {
      invoiceNo: '',
      invoiceDate: this.today(),
      partyID: 0,
      vehicleDetail: '',
      remarks: '',
      deliveryDate: this.today(),
      deliverTo: '',
      contactNo: '',
      deliveryAddress: '',
      transportCharges: 0,
      transportPartyID: 0,
      labourCharges: 0,
      productDetail: [],
      paymentType: 'Cash',
      billDiscount: 0,
      cashAmount: 0,
      bankAmount: 0,
      bankCoaID: 0,
    };
  }

  onPaymentTypeChange() {
    const total = this.invoiceGrandTotal(this.model);
    if (this.model.paymentType === 'Cash') {
      this.model.cashAmount = 0;
      this.model.bankAmount = 0;
      this.model.bankCoaID = 0;
    } else if (this.model.paymentType === 'Bank') {
      this.model.cashAmount = 0;
      this.model.bankAmount = total;
    }
  }
  bankCoaList: any = [];

  getBankList() {

    this.global.getBankList().subscribe((data: any) => {
      this.bankCoaList = data;
    });

  }



  addItem(item: any): void {
    const existing = this.model.productDetail.find(p => p.mnuItemID === item.mnuItemID);
    if (existing) {
      existing.quantity++;
    } else {
      this.model.productDetail.push({ ...item, quantity: 1 });
    }
    this.itemSearch = '';
    $('#searchItem').trigger('focus');
  }

  removeItem(index: number): void {
    this.model.productDetail.splice(index, 1);
  }

  // ---------- totals ----------
  lineTotal(p: any): number {
    return (p.quantity || 0) * (p.mnuItemSalePrice || 0);
  }

  invoiceSubTotal(inv: SaleInvoice): number {
    return inv.productDetail.reduce((s, p) => s + this.lineTotal(p), 0);
  }

  invoiceGrandTotal(inv: SaleInvoice): number {
    return this.invoiceSubTotal(inv) - Number(inv.billDiscount || 0) + (inv.transportCharges + inv.labourCharges || 0);
  }

  invoiceProfit(inv: SaleInvoice): number {
    return inv.productDetail.reduce(
      (s, p) => s + (p.quantity || 0) * ((p.salePrice || 0) - (p.avgCostPrice || 0)), 0);
  }

  get totalQty(): number {
    return this.model.productDetail.reduce((s, p) => s + (p.quantity || 0), 0);
  }

  // ---------- lookups ----------
  partyName(id: number | null): string {
    return this.parties.find(p => p.id === id)?.name ?? '';
  }

  shippingName(id: number | null): string {
    return this.shippingCompanies.find(s => s.id === id)?.name ?? '';
  }

  getSavedInvoices() {

    var fromDate = this.global.dateFormater(this.fromDate, '')
    var toDate = this.global.dateFormater(this.toDate, '')

    var url = `${environment.mainApi + this.global.miningLink}GetMiningSale?reqUID=0
        &FromDate=${fromDate}&ToDate=${toDate}&FromTime=00:00&ToTime=23:59:59`;


    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          console.log(Response, 'Saved Invoices');
          this.tmpSavedDataList = Response;
          this.savedDataList = Response;
        }
      }
    )

  }


  savedDataList: any = [];
  tmpSavedDataList: any = [];
  tmpProductDetailList: any = [];
  applyFilters(): void {



    this.savedDataList = this.tmpSavedDataList.filter((e: any) => {
      const partyMatch = !this.filterPartyID || e.partyID === this.filterPartyID;
      return partyMatch;
    });

  }


  toggleExpanded(record: any): void {
    this.expandedId = this.expandedId === record.invBillNo ? null : record.invBillNo ?? null;

    this.getBillDetail(record.invBillNo).subscribe(
      {
        next: (Response: any) => {
          console.log(Response, 'Bill Detail')
          this.tmpProductDetailList = Response;
        }
      }
    )
  }

  public getBillDetail(billNo: any): Observable<any> {
    return this.http.get(environment.mainApi + this.global.miningLink + 'PrintMiningBill?InvBillNo=' + billNo).pipe(retry(3));
  }



  // ---------- save / edit / delete ----------
  save(): void {
    var data: any = this.model;
    var billTotal = this.invoiceSubTotal(this.model);
    var billDiscount = 0;
    var tmpNetTotal = this.invoiceGrandTotal(this.model);
    var tmpChange = tmpNetTotal - ((data.cashAmount || 0) + (data.bankAmount || 0));





    if (this.model.productDetail.length === 0) {
      this.msg.WarnNotify('Please add at least one item to the invoice.');
      return;
    }



    var validateQty = this.model.productDetail.filter((e: any) => e.quantity == 0);
    var validateSalePrice = this.model.productDetail.filter((e: any) => e.mnuItemSalePrice == 0);
    var validateLessThanCost = this.model.productDetail.filter((e: any) => e.mnuItemSalePrice < e.mnuItemCostPrice);

    if (validateSalePrice.length > 0) {
      this.msg.WarnNotify(`${validateSalePrice[0].mnuItemTitle} Sale Price Not Valid`);
      return;
    }

    if (validateLessThanCost.length > 0) {
      this.msg.WarnNotify(`${validateLessThanCost[0].mnuItemTitle} Sale Price Less than Cost Price`);
      return;
    }

    if (validateQty.length > 0) {
      this.msg.WarnNotify(`${validateQty[0].mnuItemTitle} quantity Not Valid`);
      return;
    }


    if (data.paymentType == 'Cash' && (data.cashAmount == 0 || data.cashAmount == null || data.cashAmount == '')) {
      this.msg.WarnNotify('Enter Cash Amount');
      return;
    }

    if (data.paymentType == 'Cash' && data.cashAmount < data.tmpNetTotal) {
      this.msg.WarnNotify('Cash Amount Not valid');
      return;
    }



    if (data.paymentType == 'Bank' && (data.bankAmount == 0 || data.bankAmount == null || data.bankAmount == '')) {
      this.msg.WarnNotify('Enter Bank Amount');
      return;
    }



    if (data.paymentType == 'Bank' && (data.bankCoaID == 0 || data.bankCoaID == null || data.bankCoaID == undefined)) {
      this.msg.WarnNotify('Select Bank');
      return;
    }

    if (data.paymentType == 'Credit' && data.partyID == 0) {
      this.msg.WarnNotify('Credit type require to select customer.');
      return;
    }


    if (data.paymentType == 'Credit' && (data.cashAmount + data.bankAmount) > data.tmpNetTotal) {
      this.msg.WarnNotify('Amounts Not valid');
      return;
    }

    if (data.bankAmount > 0 &&  (data.bankCoaID == 0 || data.bankCoaID == null || data.bankCoaID == undefined)) {
      this.msg.WarnNotify('Select Bank');
      return;
    }








    var miningSaleDetail: any = this.model.productDetail.map((e: any) => {
      return {
        ProductID: e.mnuItemID,
        MnuItemID: e.mnuItemID,
        ProductTitle: e.mnuItemTitle,
        Quantity: e.quantity,
        CostPrice: e.mnuItemCostPrice,
        AvgCostPrice: e.mnuItemAvgCostPrice,
        SalePrice: e.mnuItemSalePrice
      };
    });

    var postData = {
      InvBillNo: data.invoiceNo,
      InvDate: this.global.dateFormater(data.invoiceDate, '-'),
      PartyID: data.partyID || 0,
      InvType: "S",
      ProjectID: this.global.getProjectID(),
      PaymentType: data.paymentType,
      BookerID: 1,
      VehicleDetail: data.vehicleDetail || '-',
      Remarks: data.remarks || '-',
      GstAmount: 0,
      GstValue: 0,
      BillTotal: billTotal,
      BillDiscount: data.billDiscount || 0,
      OtherCharges: 0,
      NetTotal: tmpNetTotal,
      CashRec: data.cashAmount || 0,
      Change: tmpChange || 0,
      BankCoaID: data.bankCoaID || 0,
      BankCash: data.bankAmount || 0,
      InvoiceDocument: "-",
      TransportPartyID: data.transportPartyID || 0,
      LabourCharges: data.labourCharges || 0,
      TransportCharges: data.transportCharges || 0,
      PinCode: '',
      DeliveryDate: this.global.dateFormater(data.deliveryDate, '-'),
      DeliverTo: data.deliverTo || '-',
      DeliveryContactNo: data.contactNo || '-',
      DeliveryAddress: data.deliveryAddress || '-',
      DeliveryRemarks: '-',
      MiningSaleDetail: JSON.stringify(miningSaleDetail),
      LocationID: 1,
      UserID: this.global.getUserID(),
    }



    console.log(postData, 'postData');

    if (data.invoiceNo) {
      this.global.openPinCode().subscribe(pin => {
        if (pin != '') {
          postData.PinCode = pin;
          this.insert('update', postData);
        }
      })
    } else {
      this.insert('insert', postData);
    }


  }


  insert(type: any, payload: any) {

    const insertType = {
      insert: 'InsertMiningSale',
      update: 'UpdateMiningSale',
      delete: 'DeleteMiningSale',
      post: 'postMiningSale'
    }[type];


    var url = `${environment.mainApi + this.global.miningLink + insertType}`;
    console.log(payload, url);
    this.app.startLoaderDark();
    this.http.post(url, payload).subscribe(
      {
        next: (Response: any) => {
          if (Response.msg == 'Data Saved Successfully'
            || Response.msg == 'Data Updated Successfully'
            || Response.msg == 'Data Deleted Successfully'
            || Response.msg == 'Item Activated Successfully'
            || Response.msg == 'Item Deactivated Successfully'
          ) {
            this.msg.SuccessNotify(Response.msg);
            this.getSavedInvoices();
            this.reset();

          } else {
            this.msg.WarnNotify(Response.msg);
          }
          this.app.stopLoaderDark();
        },
        error: (error) => {
          console.log(error);
          this.app.stopLoaderDark();
        }
      }
    )


  }


  edit(item: any): void {
    // this.editIndex = this.invoices.indexOf(inv);
    // this.model = JSON.parse(JSON.stringify(inv));
    console.log(item, 'Edit')
    this.model = {
      invoiceNo: item.invBillNo,
      invoiceDate: new Date(item.invDate),
      partyID: item.partyID,
      vehicleDetail: item.vehicleDetail,
      remarks: item.remarks,
      deliveryDate: new Date(item.deliveryDate),
      deliverTo: item.deliverTo,
      contactNo: item.deliveryContactNo,
      deliveryAddress: item.deliveryAddress,
      transportCharges: item.transportCharges,
      transportPartyID: item.transportPartyID,
      labourCharges: item.labourCharges,
      productDetail: [],
      paymentType: item.paymentType,
      billDiscount: item.billDiscount,
      cashAmount: item.cashRec,
      bankAmount: item.bankCash,
      bankCoaID: item.banCoaID,
    }

    this.getBillDetail(item.invBillNo).subscribe(
      {
        next: (Response: any) => {
          console.log(Response, "Bill Detail Edit")
          if (Response.length > 0) {
            this.model.bankAmount = Response[0].bankCash;
            this.model.bankCoaID = Response[0].coaID;
            this.model.productDetail = Response.map((e: any) => {

              return {
                mnuItemID: e.mnuItemID,
                mnuItemTitle: e.productTitle,
                quantity: e.quantity,
                mnuItemCostPrice: e.costPrice,
                mnuItemSalePrice: e.salePrice,
                mnuItemAvgCostPrice: e.avgCostPrice,
              }
            })

            this.selectedTab = 0;
          }
        },
        error: (error) => {
          console.log(error);

        }
      }
    )


  }

  delete(inv: SaleInvoice): void {
    if (!confirm('Delete invoice ' + inv.invoiceNo + '?')) return;
    const i = this.invoices.indexOf(inv);
    if (i >= 0) this.invoices.splice(i, 1);
    if (this.editIndex === i) this.reset();
    // TODO: call your API delete here
  }

  postSaleBill(item: any) {

    if (item.approvedStatus) return;

    Swal.fire({
      title: `Do you really want to ${item.approvedStatus ? 'Unpost' : 'Post'}?`,
      showCancelButton: true,
      confirmButtonText: "Confirm",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        if (!item.approvedStatus) {
          this.global.postSaleInvoice(item).subscribe(
            (Response: any) => {
              if (Response.msg == 'Posted Successfully') {
                this.msg.SuccessNotify(Response.msg);
                this.getSavedInvoices();
              } else {
                this.msg.WarnNotify(Response.msg);
              }
            }
          );
        }

      }

    });


  }

  reset(): void {
    this.model = this.emptyInvoice();
    this.itemSearch = '';
  }



  get totalSales(): number {
    return this.invoices.reduce((s, i) => s + this.invoiceGrandTotal(i), 0);
  }



  rowFocused = -1;

  handleUpdown(item: any, e: KeyboardEvent, cls: string, index: number): void {
    const container = $(".lines-table");
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

      $('#searchInput').trigger('select').trigger('focus');


      return;
    }

    // Delete key → Remove the row
    if (key === 46) {
      e.preventDefault();
      var index = this.model.productDetail.indexOf(item);
      this.removeItem(index);
      this.rowFocused = 0;
      return;
    }

    // Arrow Down → Move to next row
    if (key === 40) {
      if (this.model.productDetail.length > 1) {
        this.rowFocused = Math.min(this.rowFocused + 1, this.model.productDetail.length - 1);
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
        $("#searchInput").trigger('select').trigger('focus');
      }
      return;
    }

    // Allowed keys
    const allowedKeys = [
      'Backspace', 'Tab', 'Enter', 'Shift', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown',
      'Delete', '.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Numpad0', 'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4', 'Numpad5', 'Numpad6', 'Numpad7', 'Numpad8', 'Numpad9', 'Decimal'
    ];

    // Block keys not allowed
    if (!allowedKeys.includes(e.key)) {
      e.preventDefault();
      return;
    }
  }

  prodFocusedRow = 0;
  changeFocus(e: any, cls: any) {

    if (e.target.value == '') {
      if (e.keyCode == 40) {

        if (this.menuItems.length >= 1) {
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
        if (this.menuItems.length >= 1) {
          e.preventDefault();
          $('.prodRow0').trigger('focus');


        }
      }
    }
  }

  handleProdFocus(item: any, e: any, cls: any, endFocus: any, prodList: any[]) {
    const key = e.keyCode;

    if (key === 9) {
      this.prodFocusedRow += e.shiftKey ? -1 : 1;
      return;
    }

    if (key === 40 && this.prodFocusedRow < prodList.length - 1) {
      this.prodFocusedRow++;
    } else if (key === 38) {
      if (this.prodFocusedRow === 0) {
        e.preventDefault();
        $(endFocus).trigger('focus');
        return;
      }
      this.prodFocusedRow--;
    } else {
      return;
    }

    e.preventDefault();
    $(cls + this.prodFocusedRow).trigger('focus');
  }




  printSaleInvoice(item: any) {

    this.invoicePrint.printSaleBill(item.invBillNo);

  }

  printToken(item:any){
        this.tokenPrint.printInvoice(item.invBillNo);

  }

  onTransporterChange() {
    if (this.model.transportPartyID == 0) {
      this.model.labourCharges = 0;
      this.model.transportCharges = 0;
    }
  }


}