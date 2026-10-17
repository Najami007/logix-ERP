import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiningSaleReportComponent } from './mining-sale-report.component';

describe('MiningSaleReportComponent', () => {
  let component: MiningSaleReportComponent;
  let fixture: ComponentFixture<MiningSaleReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiningSaleReportComponent]
    });
    fixture = TestBed.createComponent(MiningSaleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
