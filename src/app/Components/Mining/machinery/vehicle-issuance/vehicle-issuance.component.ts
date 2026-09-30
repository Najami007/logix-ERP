import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/Shared/service/notification.service';


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

interface IssuanceModel {
  vehicleId: number | null;
  location: string;
  date: Date | null;
  description: string;
}


interface IssuanceTotals {
  items: number;
  quantity: number;
  cost: number;
  sale: number;
}

type SortKey = 'date' | 'vehicle' | 'sale';
type SortDir = 'asc' | 'desc';

const MAX_SUGGESTIONS = 8;

/** Local date -> "yyyy-MM-dd" (avoids the time-zone shift toISOString() causes). */
function toIsoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function fromIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
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
  model: IssuanceModel = this.blankModel();
  lines: LineModel[] = [];
  editingId: number | null = null;
  private editingRecord: any | null = null;

  vehicleOptions: VehicleOption[] = [];
  private vehicles: any[] = [];

  // Product search
  private products: any[] = [];
  searchText = '';
  searchFocused = false;
  suggestions: any[] = [];
  activeIndex = -1;
  lastAddedId: number | null = null;

  // ---------------- Saved records ----------------
  records: any[] = [];
  visibleRecords: any[] = [];
  vehicleFilterOptions: { id: number; label: string }[] = [];
  visibleTotals: any = { items: 0, quantity: 0, cost: 0, sale: 0 };

  search = '';
  vehicleFilter: number | 'all' = 'all';
  fromDate: Date | null = null;
  toDate: Date | null = null;
  sortKey: SortKey = 'date';
  sortDir: SortDir = 'desc';
  expandedId: number | null = null;

  /** Lets the template call the totals helper. */
  readonly totals = this.issuanceTotals;

  constructor(
    public global: GlobalDataModule,
    private http: HttpClient,
    private msg: NotificationService
  ) {

  }
  ngOnInit(): void {
    this.getLocation();
    this.global.getProducts().subscribe((data: any) => { this.productList = data; })

  }



  round2: any = (n: number) => Math.round(n * 100) / 100;

  issuanceTotals(lines: any[]) {
    return {
      items: lines.length,
      quantity: this.round2(lines.reduce((sum, l) => sum + (Number(l.quantity) || 0), 0)),
      cost: this.round2(lines.reduce((sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.costPrice) || 0), 0)),
      sale: this.round2(lines.reduce((sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.salePrice) || 0), 0)),
    };
  }

  productList: any = [];
  locationList: any = [];
  getLocation() {
    this.global.getWarehouseLocationList().subscribe((data: any) => { this.locationList = data; });
  }




  get isEditing(): boolean {
    return this.editingId !== null;
  }

  get hasFilters(): boolean {
    return this.search.trim() !== '' || this.vehicleFilter !== 'all' || !!this.fromDate || !!this.toDate;
  }

  get formTotals(): any {
    const t = this.issuanceTotals(this.lines);
    return { ...t, profit: Math.round((t.sale - t.cost) * 100) / 100 };
  }

  get showSuggestions(): boolean {
    return this.searchFocused && this.searchText.trim().length > 0;
  }

  trackByProduct = (_: number, line: { productID: number }) => line.productID;
  trackById = (_: number, item: { id?: number }) => item.id;

  issueNo(id?: number): string {
    return `ISS-${String(id ?? 0).padStart(4, '0')}`;
  }

  // =============================== Product search ===============================

  onSearchChange(value: string): void {
    this.searchText = value ?? '';
    this.updateSuggestions();
  }

  /** Matches barcode, product ID and title (every typed word must appear in the title). Exact barcode first. */
  private updateSuggestions(): void {
    const q = this.searchText.trim().toLowerCase();
    if (!q) {
      this.suggestions = [];
      this.activeIndex = -1;
      return;
    }

    const words = q.split(/\s+/);
    const rank = (p: any): number => {
      const title = p.productTitle.toLowerCase();
      if (p.barcode === q) return 0;
      if (p.barcode.startsWith(q)) return 1;
      if (String(p.productID) === q) return 2;
      if (title.startsWith(q)) return 3;
      return 4;
    };

    this.suggestions = this.productList
      .filter((p) => {
        const title = p.productTitle.toLowerCase();
        return p.barcode.includes(q) || String(p.productID) === q || words.every((w) => title.includes(w));
      })
      .sort((a, b) => rank(a) - rank(b) || a.productTitle.localeCompare(b.productTitle))
      .slice(0, MAX_SUGGESTIONS);

    this.activeIndex = this.suggestions.length ? 0 : -1;
  }

  moveActive(step: number, event: any): void {
    event.preventDefault();

    if (!this.suggestions?.length) return;

    // Move through the complete suggestions array
    this.activeIndex += step;

    // Wrap to bottom
    if (this.activeIndex < 0) {
      this.activeIndex = this.productList.length - 1;
    }

    // Wrap to top
    if (this.activeIndex >= this.productList.length) {
      this.activeIndex = 0;
    }

    // Wait until Angular updates the active class
    setTimeout(() => {
      const activeElement = document.getElementById(
        `suggestion-${this.activeIndex}`
      );

      activeElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    });
  }

  /** Enter adds the exact barcode match (scanner), otherwise the highlighted suggestion. Never submits the form. */
  onSearchEnter(event: Event): void {
    event.preventDefault();
    const q = this.searchText.trim();
    if (!q) return;

    const exact = this.productList.find((p) => p.barcode === q);
    const pick = exact ?? this.suggestions[this.activeIndex];

    if (pick) {
      this.addProduct(pick);
      return;
    }

    this.snackBar.open(`No product found for "${q}".`, undefined, { duration: 3000 });
    if (/^\d+$/.test(q)) {
      this.clearSearch(); // looks like a scanned barcode: clear it so the next scan starts fresh
    }
  }

  addProduct(product: any): void {
    const existing = this.lines.find((l) => l.productID === product.productID);
    console.log(product);
    if (existing) {
      existing.quantity = (Number(existing.quantity) || 0) + 1;
    } else {
      this.lines = [
        ...this.lines,
        {
          productID: product.productID,
          productTitle: product.productTitle,
          quantity: 1,
          costPrice: product.costPrice,
          salePrice: product.salePrice,
          avgCostPrice: product.avgCostPrice,
        },
      ];
    }

    this.lastAddedId = product.productID;
    setTimeout(() => (this.lastAddedId = null), 1200);

    this.clearSearch();
    this.focusSearch();
  }

  inList(product: any): boolean {
    return this.lines.some((l) => l.productID === product.productID);
  }

  removeLine(line: LineModel): void {
    this.lines = this.lines.filter((l) => l !== line);
  }

  clearSearch(): void {
    this.searchText = '';
    this.updateSuggestions();
  }

  focusSearch(): void {
    this.searchInput?.nativeElement.focus();
  }

  // =============================== Form ===============================

  onSubmit(form: NgForm): void {
    form.form.markAllAsTouched();

    if (form.invalid || this.lines.length === 0) {
      const message = this.lines.length === 0 ? 'Add at least one product.' : 'Fix the highlighted fields to save this issuance.';
      this.snackBar.open(message, 'Dismiss', { duration: 4000 });
      return;
    }

    const vehicle = this.vehicleOptions.find((o) => o.id === this.model.vehicleId);
    if (!vehicle || !this.model.date) {
      return;
    }

    var payLoad = {
      id: this.editingId ?? undefined,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      vehicleNo: vehicle.no,
      location: this.model.location.trim(),
      date: toIsoDate(this.model.date),
      description: this.model.description.trim(),
      productDetail: this.lines.map((l) => ({
        productID: l.productID,
        productTitle: l.productTitle,
        quantity: Number(l.quantity),
        costPrice: Number(l.costPrice),
        salePrice: Number(l.salePrice),
        avgCostPrice: l.avgCostPrice,
      })),
    };

    this.snackBar.open(this.isEditing ? 'Issuance updated.' : 'Issuance saved.', undefined, { duration: 3000 });
    this.leaveForm(form);
    this.selectedTab = 1; // show the saved list
  }

  onCancel(form: NgForm): void {
    const wasEditing = this.isEditing;
    this.leaveForm(form);
    if (wasEditing) {
      this.selectedTab = 1;
    }
  }

  onEdit(record: any): void {
    this.editingId = record.id ?? null;
    this.editingRecord = record;
    this.model = {
      vehicleId: record.vehicleId,
      location: record.location,
      date: fromIsoDate(record.date),
      description: record.description,
    };
    this.lines = record.productDetail.map((l) => ({ ...l }));
    this.clearSearch();
    this.refreshVehicleOptions();
    this.issuanceForm?.form.markAsUntouched();
    this.selectedTab = 0;
  }

  private leaveForm(form: NgForm): void {
    this.editingId = null;
    this.editingRecord = null;
    this.model = this.blankModel();
    this.lines = [];
    this.clearSearch();
    this.refreshVehicleOptions();
    form.resetForm();
  }

  private blankModel(): IssuanceModel {
    return { vehicleId: null, location: '', date: new Date(), description: '' };
  }

  /** Only active vehicles can be picked, plus the vehicle of the record being edited (it may be inactive or deleted by now). */
  private refreshVehicleOptions(): void {
    const options: VehicleOption[] = this.vehicles
      .filter((v) => v.id != null && v.vehicleActiveStatus)
      .map((v) => ({ id: v.id!, name: v.vehicleName, no: v.vehicleNo }));

    const record = this.editingRecord;
    if (record && !options.some((o) => o.id === record.vehicleId)) {
      options.push({ id: record.vehicleId, name: record.vehicleName, no: record.vehicleNo });
    }

    this.vehicleOptions = options;
  }

 

  applyFilters(): void {
    const words = this.search.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const from = this.fromDate ? toIsoDate(this.fromDate) : null;
    const to = this.toDate ? toIsoDate(this.toDate) : null;

    const list = this.records.filter((r) => {
      if (this.vehicleFilter !== 'all' && r.vehicleId !== this.vehicleFilter) return false;
      if (from && r.date < from) return false;
      if (to && r.date > to) return false;
      if (!words.length) return true;

      const haystack = [
        this.issueNo(r.id),
        r.vehicleName,
        r.vehicleNo,
        r.location,
        r.description,
        r.date,
        ...r.productDetail.map((l) => `${l.productTitle} ${l.productID}`),
      ]
        .join(' ')
        .toLowerCase();

      return words.every((w) => haystack.includes(w));
    });

    const dir = this.sortDir === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      let result = 0;
      if (this.sortKey === 'date') result = a.date.localeCompare(b.date);
      else if (this.sortKey === 'vehicle') result = a.vehicleName.localeCompare(b.vehicleName);
      else result = this.issuanceTotals(a.productDetail).sale - this.issuanceTotals(b.productDetail).sale;

      return result * dir || (b.id ?? 0) - (a.id ?? 0);
    });

    this.visibleRecords = list;
    this.visibleTotals = this.issuanceTotals(list.flatMap((r) => r.productDetail));

    if (this.expandedId !== null && !list.some((r) => r.id === this.expandedId)) {
      this.expandedId = null;
    }
  }

  sortBy(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = key === 'vehicle' ? 'asc' : 'desc';
    }
    this.applyFilters();
  }

  ariaSort(key: SortKey): 'ascending' | 'descending' | 'none' {
    if (this.sortKey !== key) return 'none';
    return this.sortDir === 'asc' ? 'ascending' : 'descending';
  }

  toggleExpanded(record: any): void {
    this.expandedId = this.expandedId === record.id ? null : record.id ?? null;
  }

  clearFilters(): void {
    this.search = '';
    this.vehicleFilter = 'all';
    this.fromDate = null;
    this.toDate = null;
    this.applyFilters();
  }

  confirmDelete(record: any): void {

  }
}