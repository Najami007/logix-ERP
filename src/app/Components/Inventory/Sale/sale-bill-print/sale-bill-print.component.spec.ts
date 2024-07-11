import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleBillPrintComponent } from './sale-bill-print.component';

describe('SaleBillPrintComponent', () => {
  let component: SaleBillPrintComponent;
  let fixture: ComponentFixture<SaleBillPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleBillPrintComponent]
    });
    fixture = TestBed.createComponent(SaleBillPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
