import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailSaleReturnComponent } from './retail-sale-return.component';

describe('RetailSaleReturnComponent', () => {
  let component: RetailSaleReturnComponent;
  let fixture: ComponentFixture<RetailSaleReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailSaleReturnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailSaleReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
