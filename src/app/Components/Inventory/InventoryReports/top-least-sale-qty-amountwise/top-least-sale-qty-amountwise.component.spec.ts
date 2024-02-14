import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopLeastSaleQtyAmountwiseComponent } from './top-least-sale-qty-amountwise.component';

describe('TopLeastSaleQtyAmountwiseComponent', () => {
  let component: TopLeastSaleQtyAmountwiseComponent;
  let fixture: ComponentFixture<TopLeastSaleQtyAmountwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopLeastSaleQtyAmountwiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopLeastSaleQtyAmountwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
