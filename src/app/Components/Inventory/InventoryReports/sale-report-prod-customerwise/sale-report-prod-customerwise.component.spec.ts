import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReportProdCustomerwiseComponent } from './sale-report-prod-customerwise.component';

describe('SaleReportProdCustomerwiseComponent', () => {
  let component: SaleReportProdCustomerwiseComponent;
  let fixture: ComponentFixture<SaleReportProdCustomerwiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleReportProdCustomerwiseComponent]
    });
    fixture = TestBed.createComponent(SaleReportProdCustomerwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
