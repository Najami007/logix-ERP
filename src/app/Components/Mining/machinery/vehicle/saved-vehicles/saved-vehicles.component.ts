import { Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator, } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { MatButtonModule } from '@angular/material/button';

import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

type StatusFilter = 'all' | 'active' | 'inactive';
type OwnershipFilter = 'all' | 'Owner' | 'Rental';

interface Filters {
  text: string;
  status: StatusFilter;
  ownership: OwnershipFilter;
}


@Component({
  selector: 'app-saved-vehicles',
  standalone: false,

  templateUrl: './saved-vehicles.component.html',
  styleUrls: ['./saved-vehicles.component.scss'],
})
export class SavedVehiclesComponent implements OnInit {


  public readonly global = inject(GlobalDataModule)
  public readonly msg = inject(NotificationService)

  @Input() set vehicles(list: any[] | null) {
    this.vehicleList = list;
    this.tmpVehicleList = list;
  }

  @Output() edit = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>();
  @Output() statusChange = new EventEmitter<{ vehicle: any; active: boolean }>();
  @Output() refreshList = new EventEmitter();



  tmpVehicleList: any = [];
  vehicleList: any = [];

  get total(): any {
    return 0;
  }

  get shown(): any {
    return 0;
  }

  get hasFilters(): boolean {
    return (
      this.rentalType !== 'all' || this.activeStatus !== 'all'
    );
  }

  ngOnInit(): void {
    this.tableSize = this.global.paginationDefaultTalbeSize;
    this.tableSizes = this.global.paginationTableSizes;

  }

  searchVehicleText = '';
  activeStatus = 'all';
  rentalType = 'all';

  applyFilters() {

    this.vehicleList = this.tmpVehicleList.filter((e: any) => {

      const activeMatch =
        this.activeStatus === 'all' ||
        e.vehicleActiveStatus === this.activeStatus;

      const rentalMatch =
        this.rentalType === 'all' ||
        e.ownershipType === this.rentalType;

      return activeMatch && rentalMatch;
    });

  }

  clearFilters(): void {
    this.rentalType = 'all';
    this.activeStatus = 'all';
    this.vehicleList = this.tmpVehicleList;

  }

  confirmDelete(vehicle: any): void {

    var payLoad = {
      VehicleID: vehicle.vehicleID,
      PinCode: '',
      UserID: this.global.getUserID(),

    }

    this.global.openPinCode().subscribe(pin => {
      if (pin !== '') {
        payLoad.PinCode = pin;
        this.remove.emit({ type: 'delete', load: payLoad });
      }
    })

  }






  page: number = 1;
  count: number = 0;

  tableSize: number = 0;
  tableSizes: any = [];
  jumpPage: any = 0;
  tmpPage: number = 0;

  onTableDataChange(event: any) {

    this.page = event;
    this.refreshList.emit();
    setTimeout(() => {
      this.applyFilters();
    }, 500);
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.refreshList.emit();
    setTimeout(() => {
      this.applyFilters();
    }, 500);
  }

  goToPage(): void {
    var count = this.vehicleList.length / this.tableSize;
    if (parseFloat(this.jumpPage) > count) {
      this.msg.WarnNotify('Invalid Value')
      return;
    }

    if (this.jumpPage >= 1) {
      this.page = this.jumpPage;
      this.refreshList.emit();
      setTimeout(() => {
        this.applyFilters();
      }, 500);
    }
  }

  onProdSearchKeyup(e: any, value: any) {

    if (e.target.value.length == 0 && this.tmpPage == 0) {
      this.tmpPage = this.page;
      this.page = 1;
    }
    if (e.key == 'Backspace') {
      if (value.length == 1) {
        this.page = this.tmpPage;
        this.tmpPage = 0;
      }
    }


  }



}