import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReportBookerwiseComponent } from './sale-report-bookerwise.component';

describe('SaleReportBookerwiseComponent', () => {
  let component: SaleReportBookerwiseComponent;
  let fixture: ComponentFixture<SaleReportBookerwiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleReportBookerwiseComponent]
    });
    fixture = TestBed.createComponent(SaleReportBookerwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
