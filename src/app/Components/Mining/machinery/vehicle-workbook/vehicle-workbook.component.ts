import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';


interface VehicleOption {
  id: number;
  name: string;
  no: string;
}

interface EntryModel {
  vehicleId: number | null;
  workingHour: any;
  description: string;
  date: Date | null;
}

type SortKey = 'date' | 'vehicle' | 'hours';
type SortDir = 'asc' | 'desc';

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
  selector: 'app-vehicle-workbook',
  standalone: false,
  templateUrl: './vehicle-workbook.component.html',
  styleUrls: ['./vehicle-workbook.component.scss'],
})
export class VehicleWorkbookComponent {

  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  @ViewChild('entryForm') entryForm?: NgForm;

  selectedTab = 0;

  // ---- Form (template-driven, bound with [(ngModel)]) ----
  model: EntryModel = this.blankModel();
  editingId: number | null = null;
  private editingEntry: any | null = null;
  vehicleOptions: VehicleOption[] = [];
  private vehicles: any[] = [];

  // ---- Saved records ----
  entries: any[] = [];
  visibleEntries: any[] = [];
  vehicleFilterOptions: { id: number; label: string }[] = [];
  totalHours = 0;

  search = '';
  vehicleFilter: number | 'all' = 'all';
  fromDate: Date | null = null;
  toDate: Date | null = null;
  sortKey: SortKey = 'date';
  sortDir: SortDir = 'desc';

  constructor() {
    
  }

  get isEditing(): boolean {
    return this.editingId !== null;
  }

  get hasFilters(): boolean {
    return this.search.trim() !== '' || this.vehicleFilter !== 'all' || !!this.fromDate || !!this.toDate;
  }

  trackById = (_: number, item: { id?: number }) => item.id;

  // ================= Form =================

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.snackBar.open('Fix the highlighted fields to save this entry.', 'Dismiss', { duration: 4000 });
      return;
    }

    const vehicle = this.vehicleOptions.find((o) => o.id === this.model.vehicleId);
    if (!vehicle || !this.model.date) {
      return;
    }

    var payLoad ={
      id: this.editingId ?? undefined,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      vehicleNo: vehicle.no,
      workingHour: Number(this.model.workingHour),
      description: this.model.description.trim(),
      date: toIsoDate(this.model.date),
    };

    this.snackBar.open(this.isEditing ? 'Entry updated.' : 'Entry saved.', undefined, { duration: 3000 });
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

  onEdit(entry: any): void {
   
  }

  private leaveForm(form: NgForm): void {
    this.editingId = null;
    this.editingEntry = null;
    this.model = this.blankModel();
    this.refreshVehicleOptions();
    form.resetForm();
  }

  private blankModel(): EntryModel {
    return { vehicleId: 0, workingHour: '', description: '', date: new Date() };
  }

  /** Only active vehicles can be picked, plus the vehicle of the entry being edited (it may be inactive or deleted by now). */
  private refreshVehicleOptions(): void {
    const options: VehicleOption[] = this.vehicles
      .filter((v) => v.id != null && v.vehicleActiveStatus)
      .map((v) => ({ id: v.id!, name: v.vehicleName, no: v.vehicleNo }));

    const entry = this.editingEntry;
    if (entry && !options.some((o) => o.id === entry.vehicleId)) {
      options.push({ id: entry.vehicleId, name: entry.vehicleName, no: entry.vehicleNo });
    }

    this.vehicleOptions = options;
  }

  // ================= Saved records =================

  private refreshFilterOptions(): void {
    const seen = new Map<number, string>();
    this.entries.forEach((e) => seen.set(e.vehicleId, `${e.vehicleName} (${e.vehicleNo})`));
    this.vehicleFilterOptions = [...seen.entries()]
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => a.label.localeCompare(b.label));

    if (this.vehicleFilter !== 'all' && !seen.has(this.vehicleFilter)) {
      this.vehicleFilter = 'all';
    }
  }

  applyFilters(): void {
    const words = this.search.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const from = this.fromDate ? toIsoDate(this.fromDate) : null;
    const to = this.toDate ? toIsoDate(this.toDate) : null;

    const list = this.entries.filter((e) => {
      if (this.vehicleFilter !== 'all' && e.vehicleId !== this.vehicleFilter) return false;
      if (from && e.date < from) return false;
      if (to && e.date > to) return false;
      if (!words.length) return true;

      const haystack = [e.vehicleName, e.vehicleNo, e.description, e.date].join(' ').toLowerCase();
      return words.every((w) => haystack.includes(w));
    });

    const dir = this.sortDir === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      let result = 0;
      if (this.sortKey === 'date') result = a.date.localeCompare(b.date);
      else if (this.sortKey === 'vehicle') result = a.vehicleName.localeCompare(b.vehicleName);
      else result = a.workingHour - b.workingHour;

      return result * dir || (b.id ?? 0) - (a.id ?? 0);
    });

    this.visibleEntries = list;
    this.totalHours = Math.round(list.reduce((sum, e) => sum + e.workingHour, 0) * 100) / 100;
  }

  sortBy(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = key === 'date' ? 'desc' : 'asc';
    }
    this.applyFilters();
  }

  ariaSort(key: SortKey): 'ascending' | 'descending' | 'none' {
    if (this.sortKey !== key) return 'none';
    return this.sortDir === 'asc' ? 'ascending' : 'descending';
  }

  clearFilters(): void {
    this.search = '';
    this.vehicleFilter = 'all';
    this.fromDate = null;
    this.toDate = null;
    this.applyFilters();
  }

  confirmDelete(entry: any): void {
    
  }
}