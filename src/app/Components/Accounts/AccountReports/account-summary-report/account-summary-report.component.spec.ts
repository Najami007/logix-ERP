import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSummaryReportComponent } from './account-summary-report.component';

describe('AccountSummaryReportComponent', () => {
  let component: AccountSummaryReportComponent;
  let fixture: ComponentFixture<AccountSummaryReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountSummaryReportComponent]
    });
    fixture = TestBed.createComponent(AccountSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
