import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarmentSaleComponent } from './garment-sale.component';

describe('GarmentSaleComponent', () => {
  let component: GarmentSaleComponent;
  let fixture: ComponentFixture<GarmentSaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GarmentSaleComponent]
    });
    fixture = TestBed.createComponent(GarmentSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
