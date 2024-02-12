import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleRptOrderTypewiseComponent } from './sale-rpt-order-typewise.component';

describe('SaleRptOrderTypewiseComponent', () => {
  let component: SaleRptOrderTypewiseComponent;
  let fixture: ComponentFixture<SaleRptOrderTypewiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleRptOrderTypewiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleRptOrderTypewiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
