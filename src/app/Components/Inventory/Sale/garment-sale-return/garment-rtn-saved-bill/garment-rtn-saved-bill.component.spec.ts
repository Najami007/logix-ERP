import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarmentRtnSavedBillComponent } from './garment-rtn-saved-bill.component';

describe('GarmentRtnSavedBillComponent', () => {
  let component: GarmentRtnSavedBillComponent;
  let fixture: ComponentFixture<GarmentRtnSavedBillComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GarmentRtnSavedBillComponent]
    });
    fixture = TestBed.createComponent(GarmentRtnSavedBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
