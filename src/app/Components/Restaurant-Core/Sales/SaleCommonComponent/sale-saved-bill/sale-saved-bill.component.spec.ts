import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleSavedBillComponent } from './sale-saved-bill.component';

describe('SaleSavedBillComponent', () => {
  let component: SaleSavedBillComponent;
  let fixture: ComponentFixture<SaleSavedBillComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleSavedBillComponent]
    });
    fixture = TestBed.createComponent(SaleSavedBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
