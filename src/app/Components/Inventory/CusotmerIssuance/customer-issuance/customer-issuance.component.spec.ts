import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerIssuanceComponent } from './customer-issuance.component';

describe('CustomerIssuanceComponent', () => {
  let component: CustomerIssuanceComponent;
  let fixture: ComponentFixture<CustomerIssuanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerIssuanceComponent]
    });
    fixture = TestBed.createComponent(CustomerIssuanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
