import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiningCategorySaleReportComponent } from './mining-category-sale-report.component';

describe('MiningCategorySaleReportComponent', () => {
  let component: MiningCategorySaleReportComponent;
  let fixture: ComponentFixture<MiningCategorySaleReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiningCategorySaleReportComponent]
    });
    fixture = TestBed.createComponent(MiningCategorySaleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
