import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeReportComponent } from './barcode-report.component';

describe('BarcodeReportComponent', () => {
  let component: BarcodeReportComponent;
  let fixture: ComponentFixture<BarcodeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarcodeReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarcodeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
