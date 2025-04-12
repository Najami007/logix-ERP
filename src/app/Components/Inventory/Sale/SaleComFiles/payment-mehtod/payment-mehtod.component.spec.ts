import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMehtodComponent } from './payment-mehtod.component';

describe('PaymentMehtodComponent', () => {
  let component: PaymentMehtodComponent;
  let fixture: ComponentFixture<PaymentMehtodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentMehtodComponent]
    });
    fixture = TestBed.createComponent(PaymentMehtodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
