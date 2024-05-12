import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitWithdrawalComponent } from './profit-withdrawal.component';

describe('ProfitWithdrawalComponent', () => {
  let component: ProfitWithdrawalComponent;
  let fixture: ComponentFixture<ProfitWithdrawalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitWithdrawalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfitWithdrawalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
