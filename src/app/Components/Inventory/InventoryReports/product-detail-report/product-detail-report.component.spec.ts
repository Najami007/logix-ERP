import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailReportComponent } from './product-detail-report.component';

describe('ProductDetailReportComponent', () => {
  let component: ProductDetailReportComponent;
  let fixture: ComponentFixture<ProductDetailReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductDetailReportComponent]
    });
    fixture = TestBed.createComponent(ProductDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
