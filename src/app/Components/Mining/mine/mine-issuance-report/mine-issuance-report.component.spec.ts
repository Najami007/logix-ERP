import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MineIssuanceReportComponent } from './mine-issuance-report.component';

describe('MineIssuanceReportComponent', () => {
  let component: MineIssuanceReportComponent;
  let fixture: ComponentFixture<MineIssuanceReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MineIssuanceReportComponent]
    });
    fixture = TestBed.createComponent(MineIssuanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
