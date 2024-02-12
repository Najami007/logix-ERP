import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleRptTablewiseComponent } from './sale-rpt-tablewise.component';

describe('SaleRptTablewiseComponent', () => {
  let component: SaleRptTablewiseComponent;
  let fixture: ComponentFixture<SaleRptTablewiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleRptTablewiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleRptTablewiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
