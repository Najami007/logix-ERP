import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiryItemReportComponent } from './expiry-item-report.component';

describe('ExpiryItemReportComponent', () => {
  let component: ExpiryItemReportComponent;
  let fixture: ComponentFixture<ExpiryItemReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpiryItemReportComponent]
    });
    fixture = TestBed.createComponent(ExpiryItemReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
