import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarmentSavedBillComponent } from './garment-saved-bill.component';

describe('GarmentSavedBillComponent', () => {
  let component: GarmentSavedBillComponent;
  let fixture: ComponentFixture<GarmentSavedBillComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GarmentSavedBillComponent]
    });
    fixture = TestBed.createComponent(GarmentSavedBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
