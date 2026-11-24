import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarbleSaleComponent } from './marble-sale.component';

describe('MarbleSaleComponent', () => {
  let component: MarbleSaleComponent;
  let fixture: ComponentFixture<MarbleSaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarbleSaleComponent]
    });
    fixture = TestBed.createComponent(MarbleSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
