import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
} from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';

export type OwnershipType = 'Owner' | 'Rental';
export type WagesType = 'Hourly' | 'Daily' | 'Weekly' | 'Monthly';



@Component({
  selector: 'app-add-vehicle',
  standalone: false,

  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss'],
})
export class AddVehicleComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);


  public readonly global = inject(GlobalDataModule);
  public readonly msg = inject(NotificationService)
  /** Pass a vehicle to edit it; leave empty to add a new one. */


  @Output() cancelled = new EventEmitter<void>();
  @Output() saveVehicle = new EventEmitter();

  readonly ownershipTypes: OwnershipType[] = ['Owner', 'Rental'];
  readonly wagesTypes: WagesType[] = ['Hourly', 'Daily', 'Weekly', 'Monthly'];




  getDefaultFormFields() {
    return {
      vehicleID: 0,
      vehicleName: '',
      vehicleNo: '',
      vehicleBrand: '',
      ownershipType: 'Owner' as OwnershipType,
      wagesType: 'Monthly',
      wagesAmount: '',
      rentalCompanyName: '',
      rentalCompanyContactNo: '',
      rentalCompanyAddress: '',
      description: '',
      vehicleActiveStatus: true,
      avgPerLiter: '',
    };
  }

  formFields = this.getDefaultFormFields()


  validateVehicle(requiredFields: string[]): boolean {

    for (const field of requiredFields) {

      const value = this.formFields[field as keyof typeof this.formFields];

      if (value === null || value === undefined || String(value).trim() === '') {

        const fieldName = this.getFieldLabel(field);

        this.msg.WarnNotify(`Enter ${fieldName}`);
        return false;
      }
    }




    return true;
  }


  getFieldLabel(field: string): string {

    const labels: { [key: string]: string } = {
      vehicleName: 'Vehicle Name',
      vehicleNo: 'Vehicle No',
      vehicleBrand: 'Vehicle Brand',
      ownershipType: 'Ownership Type',
      wagesType: 'Wages Type',
      wagesAmount: 'Wages Amount',
      rentalCompanyName: 'Rental Company Name',
      rentalCompanyContactNo: 'Rental Company Contact No',
      rentalCompanyAddress: 'Rental Company Address',
      description: 'Description',
      avgPerLiter: 'Average Per Liter'
    };

    return labels[field] || field;
  }


  get isRental(): boolean {
    return this.formFields.ownershipType === 'Rental';
  }

  get wagesUnit(): string {
    switch (this.formFields.wagesType) {
      case 'Hourly':
        return 'per hour';

      case 'Daily':
        return 'per day';

      case 'Weekly':
        return 'per week';

      case 'Monthly':
        return 'per month';

      default:
        return '';
    }
  }

  ngOnInit(): void {

    this.toggleRentalFields(this.isRental);
  }

  private toggleRentalFields(enable: boolean): void {
    const { rentalCompanyName, rentalCompanyContactNo, rentalCompanyAddress } = this.formFields;
    const rentalControls = [rentalCompanyName, rentalCompanyContactNo, rentalCompanyAddress];


  }

  onSubmit(): void {


    const requiredFields = [
      'vehicleName',
      'vehicleNo',
      'vehicleBrand',
      'avgPerLiter'
    ];

    if (this.formFields.ownershipType === 'Rental') {
      requiredFields.push(
        'wagesAmount',
        'rentalCompanyName',
        'rentalCompanyContactNo',
        'rentalCompanyAddress'
      );
    }

    if (!this.validateVehicle(requiredFields)) {
      return;
    }


    // getRawValue() keeps disabled controls (as empty strings) so the shape stays consistent.
    const raw = this.formFields
    const payload = {
      VehicleID: raw.vehicleID,
      VehicleName: raw.vehicleName!.trim(),
      VehicleNo: raw.vehicleNo!.trim().toUpperCase(),
      VehicleBrand: raw.vehicleBrand!.trim(),
      OwnershipType: raw.ownershipType!,
      WagesType: raw.wagesType!,
      WagesAmount: this.isRental ? Number(raw.wagesAmount) : 0,
      RentalCompanyName: this.isRental ? raw.rentalCompanyName!.trim() : null,
      RentalCompanyContactNo: this.isRental ? raw.rentalCompanyContactNo!.trim() : null,
      RentalCompanyAddress: this.isRental ? raw.rentalCompanyAddress?.trim() || '' : null,
      Description: raw.description?.trim() || '',
      VehicleActiveStatus: !!raw.vehicleActiveStatus,
      AvgPerLiter: Number(raw.avgPerLiter),
      PinCode: '',
      UserID: this.global.getUserID()
    };

    if (this.formFields.vehicleID > 0) {
      this.global.openPinCode().subscribe(pin => {
        if (pin !== '') {
          payload.PinCode = pin;
          this.saveVehicle.emit({ type: 'update', load: payload });
        }
      })
    } else {
      this.saveVehicle.emit({ type: 'insert', load: payload });
    }




    this.snackBar.open('Vehicle saved.', undefined, { duration: 3000 });
  }


  editVehicle(item: any) {
    this.formFields = {
      vehicleID: item.vehicleID ?? 0,
      vehicleName: item.vehicleName ?? '',
      vehicleNo: item.vehicleNo ?? '',
      vehicleBrand: item.vehicleBrand ?? '',
      ownershipType: item.ownershipType ?? 'Owner',
      wagesType: item.wagesType ?? 'Monthly',
      wagesAmount: item.wagesAmount ?? '',
      rentalCompanyName: item.rentalCompanyName ?? '',
      rentalCompanyContactNo: item.rentalCompanyContactNo ?? '',
      rentalCompanyAddress: item.rentalCompanyAddress ?? '',
      description: item.description ?? '',
      vehicleActiveStatus: item.vehicleActiveStatus ?? true,
      avgPerLiter: item.avgPerLiter ?? ''
    };
  }


  onCancel(): void {
    this.formFields = this.getDefaultFormFields();

  }




}