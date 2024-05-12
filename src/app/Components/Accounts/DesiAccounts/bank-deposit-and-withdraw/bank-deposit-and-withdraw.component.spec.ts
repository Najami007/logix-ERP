import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDepositAndWithdrawComponent } from './bank-deposit-and-withdraw.component';

describe('BankDepositAndWithdrawComponent', () => {
  let component: BankDepositAndWithdrawComponent;
  let fixture: ComponentFixture<BankDepositAndWithdrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankDepositAndWithdrawComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankDepositAndWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
