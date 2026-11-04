import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerVehicleComponent } from './add-customer-vehicle.component';

describe('AddCustomerVehicleComponent', () => {
  let component: AddCustomerVehicleComponent;
  let fixture: ComponentFixture<AddCustomerVehicleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCustomerVehicleComponent]
    });
    fixture = TestBed.createComponent(AddCustomerVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
