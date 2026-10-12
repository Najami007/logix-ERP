import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';
import { AppComponent } from 'src/app/app.component';
import { Observable, retry } from 'rxjs';
import * as $ from 'jquery';


interface VehicleOption {
  id: number;
  name: string;
  no: string;
}

/** A product line while it is being edited: number inputs can be empty (null) until validated. */
interface LineModel {
  productID: number;
  productTitle: string;
  quantity: number | null;
  costPrice: number | null;
  salePrice: number | null;
  avgCostPrice: number;
}



@Component({
  selector: 'app-vehicle-issuance',
  standalone: false,

  templateUrl: './vehicle-issuance.component.html',
  styleUrls: ['./vehicle-issuance.component.scss'],
})
export class VehicleIssuanceComponent implements OnInit {




  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  @ViewChild('issuanceForm') issuanceForm?: NgForm;
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  selectedTab = 0;

  // ---------------- Form (template-driven, bound with [(ngModel)]) ----------------
  model: any = this.blankModel();
  tableDataList: any = [];
  editingId: any = null;
  private editingRecord: any | null = null;

  vehicleOptions: VehicleOption[] = [];
  vehicles: any[] = [];

  // Product search
  private products: any[] = [];
  searchText = '';
  PBarcode = '';
  searchFocused = false;
  suggestions: any[] = [];
  activeIndex = -1;
  lastAddedId: number | null = null;

  // ---------------- Saved records ----------------

  vehicleFilterOptions: any = [];

  search = '';
  vehicleFilter: number | 'all' = 'all';
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

  expandedId: number | null = null;

  /** Lets the template call the totals helper. */
  readonly totals = this.issuanceTotals;

  constructor(
    public global: GlobalDataModule,
    private http: HttpClient,
    private msg: NotificationService,
    private app: AppComponent
  ) {

  }
  ngOnInit(): void {
    this.global.setHeaderTitle('Vehicle Issuance')
    this.getLocation();
    this.getVehileList();
    this.getSavedIssuance();
    this.global.getProducts().subscribe((data: any) => { this.productList = data; })

  }



  round2: any = (n: number) => Math.round(n * 100) / 100;

  issuanceTotals(lines: any[]) {
    return {
      items: lines.length,
      quantity: this.round2(lines.reduce((sum, l) => sum + (Number(l.quantity) || 0), 0)),
      costTotal: this.round2(lines.reduce((sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.costPrice) || 0), 0)),
      saleTotal: this.round2(lines.reduce((sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.salePrice) || 0), 0)),
      avgCostTotal: this.round2(lines.reduce((sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.avgCostPrice) || 0), 0)),
    };
  }

  productList: any = [];
  locationList: any = [];
  getLocation() {
    this.global.getWarehouseLocationList().subscribe((data: any) => { this.locationList = data; });
  }




  get isEditing(): boolean {
    return this.model.invBillNo != '';
  }

  get hasFilters(): boolean {
    return this.search.trim() !== '' || this.FilterVehicleID !== 0;
  }

  get formTotals(): any {
    const t = this.issuanceTotals(this.tableDataList);
    return { ...t, profit: Math.round((t.saleTotal - t.costTotal) * 100) / 100 };
  }


  // searchText = '';
  // searchFocused = false;
  // activeIndex = -1;
  // suggestions: any[] = [];

  get showSuggestions(): boolean {
    return this.searchFocused && this.searchText.trim().length > 0;
  }

  onSearchChange(value: string): void {
    this.searchText = value ?? '';
    this.activeIndex = -1;          // nothing highlighted until arrow down
    this.updateSuggestions();
  }

  private updateSuggestions(): void {
    const term = this.searchText.trim().toLowerCase();
    if (!term) {
      this.suggestions = [];
      return;
    }
    this.suggestions = (this.productList ?? [])
      .filter((p: any) =>
        [p.productTitle, p.barcode, p.productID].some((v) =>
          String(v ?? '').toLowerCase().includes(term)
        )
      )
      .slice(0, 25);
  }

  moveActive(step: number, event: Event): void {
    event.preventDefault();
    const count = this.suggestions.length;
    if (!count) {
      this.rowFocused = 0;
      event.preventDefault();
      $('.qty0').trigger('select');
      $('.qty0').trigger('focus');

      return
    }

    if (this.activeIndex === -1) {
      // first press: down -> first item, up -> last item
      this.activeIndex = step > 0 ? 0 : count - 1;
    } else {
      // move one step and wrap around at both ends
      this.activeIndex = (this.activeIndex + step + count) % count;
    }

    setTimeout(() => {
      document
        .getElementById(`suggestion-${this.activeIndex}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  selectActive(event: Event): void {
    event.preventDefault();
    if (this.activeIndex >= 0) {
      this.addProduct(this.suggestions[this.activeIndex]);
    } else if (this.suggestions.length === 1) {
      // handy for barcode scanners: one match + Enter adds it
      this.addProduct(this.suggestions[0]);
    }
  }

  clearSearch(): void {
    this.searchText = '';
    this.suggestions = [];
    this.activeIndex = -1;
  }



  // get showSuggestions(): boolean {
  //   return this.searchFocused && this.searchText.trim().length > 0;
  // }


  // // =============================== Product search ===============================

  // onSearchChange(value: string): void {
  //   this.searchText = value ?? '';
  // }



  // moveActive(step: number, event: any): void {
  //   event.preventDefault();

  //   if (!this.suggestions?.length) return;

  //   // Move through the complete suggestions array
  //   this.activeIndex += step;

  //   // Wrap to bottom
  //   if (this.activeIndex < 0) {
  //     this.activeIndex = this.productList.length - 1;
  //   }

  //   // Wrap to top
  //   if (this.activeIndex >= this.productList.length) {
  //     this.activeIndex = 0;
  //   }

  //   // Wait until Angular updates the active class
  //   setTimeout(() => {
  //     const activeElement = document.getElementById(
  //       `suggestion-${this.activeIndex}`
  //     );

  //     activeElement?.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'nearest'
  //     });
  //   });
  // }



  addProduct(product: any): void {
    const existing = this.tableDataList.find((l) => l.productID === product.productID);
    // console.log(product);
    if (existing) {
      existing.quantity = (Number(existing.quantity) || 0) + 1;
    } else {
      this.tableDataList = [
        ...this.tableDataList,
        {
          productID: product.productID,
          productTitle: product.productTitle,
          quantity: 1,
          costPrice: product.costPrice,
          salePrice: product.salePrice,
          avgCostPrice: product.avgCostPrice,
          uomID: product.uomID,
          packing: product.packing

        },
      ];
    }

    this.lastAddedId = product.productID;
    setTimeout(() => (this.lastAddedId = null), 1200);

    this.clearSearch();
    this.focusSearch();
  }

  // inList(product: any): boolean {
  //   return this.tableDataList.some((l) => l.productID === product.productID);
  // }

  removeLine(line: LineModel): void {
    this.tableDataList = this.tableDataList.filter((l) => l !== line);
  }

  // clearSearch(): void {
  //   this.searchText = '';
  // }

  focusSearch(): void {
    this.searchInput?.nativeElement.focus();
  }



  /** Only active vehicles can be picked, plus the vehicle of the record being edited (it may be inactive or deleted by now). */

  FilterVehicleID = 0
  getVehileList() {

    var url = `${environment.mainApi + this.global.miningLink}GetVehicle?VehicleID=0`

    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          this.vehicles = Response.filter((e: any) => e.vehicleActiveStatus);
          this.vehicleFilterOptions = this.vehicles;
        },
        error: (error: any) => {
          console.log('error occured while loading vehicle list' + error);
        }
      }
    )

  }

  savedDataList: any = [];
  tmpSavedDataList: any = [];

  getSavedIssuance() {

    var fromDate = this.global.dateFormater(this.fromDate, '')
    var toDate = this.global.dateFormater(this.toDate, '')

    var url = `${environment.mainApi + this.global.miningLink}GetVehicleIssuanceReport?VehicleID=0
    &ReportType=Summary&FromDate=${fromDate}&ToDate=${toDate}&FromTime=00:00&ToTime=23:59:59`;


    this.http.get(url).subscribe(
      {
        next: (Response: any) => {
          // console.log(Response, 'Issuance');
          this.tmpSavedDataList = Response;
          this.savedDataList = Response;
        }
      }
    )
  }

  // =============================== Form ===============================

  onSubmit(form: NgForm): void {
    form.form.markAllAsTouched();

    if (form.invalid || this.tableDataList.length === 0) {
      const message = this.tableDataList.length === 0 ? 'Add at least one product.' : 'Fix the highlighted fields to save this issuance.';
      this.snackBar.open(message, 'Dismiss', { duration: 4000 });
      return;
    }

    var data: any = this.model;

    if (!data.vehicleID) {
      this.msg.WarnNotify('Select Vehicle');
      return;
    }

    if (!data.locationID) {
      this.msg.WarnNotify('Select Location');
      return;
    }



    if (!data.invDate) {
      this.msg.WarnNotify('Select Invoice date');
      return;
    }

    if (this.tableDataList.length == 0) {
      this.msg.WarnNotify('Select Atleast One product');
      return;
    }

    var prodDetail = this.tableDataList;

    var totals = this.issuanceTotals(this.tableDataList);


    var payLoad = {
      InvBillNo: this.model.invBillNo,
      InvType: 'I',
      VehicleID: data.vehicleID,
      LocationID: data.locationID,
      ProjectID: this.global.getProjectID(),
      InvDate: this.global.dateFormater(data.invDate, ''),
      Remarks: data.remarks.trim() || '',
      BillTotal: totals.avgCostTotal,
      NetTotal: totals.avgCostTotal,
      InvDetail: JSON.stringify(prodDetail),
      UserID: this.global.getUserID(),
      PinCode: '',
    };
    // console.log(payLoad);
    // console.log(this.model);
    if (data.invBillNo) {
      this.global.openPinCode().subscribe(pin => {
        if (pin != '') {
          payLoad.PinCode = pin;

          this.saveIssuance('update', payLoad);
        }
      })
    } else {
      this.saveIssuance('insert', payLoad);
    }


    this.selectedTab = 1; // show the saved list
  }

  saveIssuance(type: any, payload: any) {
    this.app.startLoaderDark();
    const insertType = {
      insert: 'InsertVehicleIssuance',
      update: 'UpdateVehicleIssuance',
      delete: 'DeleteVehicleIssuance',
      post: 'PostVehicleIssuance',
    }[type];


    var url = `${environment.mainApi + this.global.miningLink}${insertType}`;

    // console.log(url, payload);

    this.http.post(url, payload).subscribe(
      {
        next: (Response: any) => {
          if (Response.msg == 'Data Saved Successfully'
            || Response.msg == 'Data Updated Successfully'
            || Response.msg == 'Data Deleted Successfully'
            || Response.msg == 'Data Posted Successfully') {
            this.msg.SuccessNotify(Response.msg);
            this.getSavedIssuance();
            this.selectedTab = 1; // show the saved list

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

  confirmApproval(item: any) {

    var payLoad = {
      InvBillNo: item.invBillNo,
      Remarks: '-',
      PinCode: '',
      UserID: this.global.getUserID()
    }

    this.global.openPinCode().subscribe(pin => {
      if (pin != '') {
        payLoad.PinCode = pin;
        this.saveIssuance('post', payLoad);
      }
    })
  }





  onCancel(form: NgForm): void {
    const wasEditing = this.isEditing;
    // this.leaveForm(form);
    this.model = this.blankModel();
    this.tableDataList = [];
    // if (wasEditing) {
    //   this.selectedTab = 1;
    // }
  }

  onEdit(item: any): void {
    // this.editingId = item.invBillNo;
    this.model.invBillNo = item.invBillNo;
    this.model.vehicleID = item.vehicleID;
    this.model.locationID = item.locationID;
    this.model.invDate = new Date(item.invDate);
    this.model.remarks = item.remarks;

    this.getBillDetail(item.invBillNo).subscribe(
      {
        next: (Response: any) => {
          // console.log(Response, 'Issueance Detail')
          this.tableDataList = Response.map((e: any) => {
            e.productID = e.productID;
            e.productTitle = e.productTitle;
            e.quantity = e.quantity;
            e.costPrice = e.costPrice;
            e.salePrice = e.salePrice;
            e.avgCostPrice = e.avgCostPrice;
            e.uomID = e.uomID;
            e.packing = e.packing;

            return e;
          })
        }
      }


    )
    this.clearSearch();
    this.issuanceForm?.form.markAsUntouched();
    this.selectedTab = 0;
  }

  confirmDelete(item: any): void {


    var payLoad = {
      InvBillNo: item.invBillNo,
      Remarks: '-',
      PinCode: '',
      UserID: this.global.getUserID()
    }

    this.global.openPinCode().subscribe(pin => {
      if (pin != '') {
        payLoad.PinCode = pin;
        this.saveIssuance('delete', payLoad);
      }
    })

  }


  public getBillDetail(billNo: any): Observable<any> {
    return this.http.get(environment.mainApi + this.global.inventoryLink + 'GetIssueSingleBillDetail?reqInvBillNo=' + billNo).pipe(retry(3));
  }


  private leaveForm(form: NgForm): void {
    this.editingId = null;
    this.editingRecord = null;
    this.model = this.blankModel();
    this.tableDataList = [];
    this.clearSearch();
    form.resetForm();
  }

  private blankModel() {
    return { invBillNo: '', vehicleID: null, locationID: '', invDate: new Date(), remarks: '', };
  }





  applyFilters(): void {
    const from = this.toDate_(this.fromDate);
    const to = this.toDate_(this.toDate);
    if (from) from.setHours(0, 0, 0, 0);
    if (to) to.setHours(23, 59, 59, 999);

    this.savedDataList = this.tmpSavedDataList.filter((e: any) => {
      const vehicleMatch = !this.FilterVehicleID || e.vehicleID === this.FilterVehicleID;
      return vehicleMatch;
    });

  }

  private toDate_(value: any): Date | null {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }


  tmpProductDetailList: any = [];

  toggleExpanded(record: any): void {
    this.expandedId = this.expandedId === record.invBillNo ? null : record.invBillNo ?? null;

    this.getBillDetail(record.invBillNo).subscribe(
      {
        next: (Response: any) => {
          this.tmpProductDetailList = Response;
        }
      }
    )
  }

  clearFilters(): void {
    this.search = '';
    this.FilterVehicleID = 0;
    this.savedDataList = this.tmpSavedDataList;
    this.applyFilters();
  }





  rowFocused = -1;
  prodFocusedRow = 0;
  changeFocusToQty(e: any, cls: any) {

    if (e.target.value == '') {
      if (e.keyCode == 40) {

        if (this.tableDataList.length >= 1) {
          this.rowFocused = 0;
          e.preventDefault();
          $('.qty0').trigger('select');
          $('.qty0').trigger('focus');

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
      this.removeLine(item);
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


}