import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionReportComponent } from './production-report.component';

describe('ProductionReportComponent', () => {
  let component: ProductionReportComponent;
  let fixture: ComponentFixture<ProductionReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductionReportComponent]
    });
    fixture = TestBed.createComponent(ProductionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
