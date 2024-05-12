import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAdjustmentComponent } from './account-adjustment.component';

describe('AccountAdjustmentComponent', () => {
  let component: AccountAdjustmentComponent;
  let fixture: ComponentFixture<AccountAdjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountAdjustmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
