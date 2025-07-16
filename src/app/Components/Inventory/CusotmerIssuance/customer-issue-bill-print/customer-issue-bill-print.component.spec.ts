import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerIssueBillPrintComponent } from './customer-issue-bill-print.component';

describe('CustomerIssueBillPrintComponent', () => {
  let component: CustomerIssueBillPrintComponent;
  let fixture: ComponentFixture<CustomerIssueBillPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerIssueBillPrintComponent]
    });
    fixture = TestBed.createComponent(CustomerIssueBillPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
