import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POBillPrintComponent } from './pobill-print.component';

describe('POBillPrintComponent', () => {
  let component: POBillPrintComponent;
  let fixture: ComponentFixture<POBillPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [POBillPrintComponent]
    });
    fixture = TestBed.createComponent(POBillPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
