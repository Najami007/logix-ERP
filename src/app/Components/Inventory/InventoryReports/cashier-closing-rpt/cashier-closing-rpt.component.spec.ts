import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierClosingRptComponent } from './cashier-closing-rpt.component';

describe('CashierClosingRptComponent', () => {
  let component: CashierClosingRptComponent;
  let fixture: ComponentFixture<CashierClosingRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashierClosingRptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashierClosingRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
