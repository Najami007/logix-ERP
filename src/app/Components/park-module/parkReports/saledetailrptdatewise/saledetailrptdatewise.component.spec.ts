import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaledetailrptdatewiseComponent } from './saledetailrptdatewise.component';

describe('SaledetailrptdatewiseComponent', () => {
  let component: SaledetailrptdatewiseComponent;
  let fixture: ComponentFixture<SaledetailrptdatewiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaledetailrptdatewiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaledetailrptdatewiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
