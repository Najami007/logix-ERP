import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerIssueReturnComponent } from './customer-issue-return.component';

describe('CustomerIssueReturnComponent', () => {
  let component: CustomerIssueReturnComponent;
  let fixture: ComponentFixture<CustomerIssueReturnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerIssueReturnComponent]
    });
    fixture = TestBed.createComponent(CustomerIssueReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
