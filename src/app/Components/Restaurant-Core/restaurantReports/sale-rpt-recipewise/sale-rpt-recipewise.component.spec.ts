import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleRptRecipewiseComponent } from './sale-rpt-recipewise.component';

describe('SaleRptRecipewiseComponent', () => {
  let component: SaleRptRecipewiseComponent;
  let fixture: ComponentFixture<SaleRptRecipewiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleRptRecipewiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleRptRecipewiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
