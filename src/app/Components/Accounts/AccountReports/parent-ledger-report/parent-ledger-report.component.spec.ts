import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentLedgerReportComponent } from './parent-ledger-report.component';

describe('ParentLedgerReportComponent', () => {
  let component: ParentLedgerReportComponent;
  let fixture: ComponentFixture<ParentLedgerReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParentLedgerReportComponent]
    });
    fixture = TestBed.createComponent(ParentLedgerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
