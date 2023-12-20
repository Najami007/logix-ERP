import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleRptswingWiseComponent } from './sale-rptswing-wise.component';

describe('SaleRptswingWiseComponent', () => {
  let component: SaleRptswingWiseComponent;
  let fixture: ComponentFixture<SaleRptswingWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleRptswingWiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleRptswingWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
