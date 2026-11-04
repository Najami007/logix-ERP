import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerVehicleComponent } from './customer-vehicle.component';

describe('CustomerVehicleComponent', () => {
  let component: CustomerVehicleComponent;
  let fixture: ComponentFixture<CustomerVehicleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerVehicleComponent]
    });
    fixture = TestBed.createComponent(CustomerVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
