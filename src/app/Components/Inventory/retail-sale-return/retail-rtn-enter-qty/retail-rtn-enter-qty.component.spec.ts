import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailRtnEnterQtyComponent } from './retail-rtn-enter-qty.component';

describe('RetailRtnEnterQtyComponent', () => {
  let component: RetailRtnEnterQtyComponent;
  let fixture: ComponentFixture<RetailRtnEnterQtyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailRtnEnterQtyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailRtnEnterQtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
