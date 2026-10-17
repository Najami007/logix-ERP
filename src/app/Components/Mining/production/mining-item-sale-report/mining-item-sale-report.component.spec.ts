import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiningItemSaleReportComponent } from './mining-item-sale-report.component';

describe('MiningItemSaleReportComponent', () => {
  let component: MiningItemSaleReportComponent;
  let fixture: ComponentFixture<MiningItemSaleReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiningItemSaleReportComponent]
    });
    fixture = TestBed.createComponent(MiningItemSaleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
