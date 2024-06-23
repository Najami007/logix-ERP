import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReportCustomerwiseComponent } from './sale-report-customerwise.component';

describe('SaleReportCustomerwiseComponent', () => {
  let component: SaleReportCustomerwiseComponent;
  let fixture: ComponentFixture<SaleReportCustomerwiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleReportCustomerwiseComponent]
    });
    fixture = TestBed.createComponent(SaleReportCustomerwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
