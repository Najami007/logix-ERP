import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyPaymentScheduleComponent } from './party-payment-schedule.component';

describe('PartyPaymentScheduleComponent', () => {
  let component: PartyPaymentScheduleComponent;
  let fixture: ComponentFixture<PartyPaymentScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartyPaymentScheduleComponent]
    });
    fixture = TestBed.createComponent(PartyPaymentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
