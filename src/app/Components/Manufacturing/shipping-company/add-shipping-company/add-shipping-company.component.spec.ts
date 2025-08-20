import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShippingCompanyComponent } from './add-shipping-company.component';

describe('AddShippingCompanyComponent', () => {
  let component: AddShippingCompanyComponent;
  let fixture: ComponentFixture<AddShippingCompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddShippingCompanyComponent]
    });
    fixture = TestBed.createComponent(AddShippingCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
