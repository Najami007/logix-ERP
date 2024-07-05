import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarmentSaleReturnComponent } from './garment-sale-return.component';

describe('GarmentSaleReturnComponent', () => {
  let component: GarmentSaleReturnComponent;
  let fixture: ComponentFixture<GarmentSaleReturnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GarmentSaleReturnComponent]
    });
    fixture = TestBed.createComponent(GarmentSaleReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
