import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleVehicleComponent } from './sale-vehicle.component';

describe('SaleVehicleComponent', () => {
  let component: SaleVehicleComponent;
  let fixture: ComponentFixture<SaleVehicleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleVehicleComponent]
    });
    fixture = TestBed.createComponent(SaleVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
