import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarqueeSaleComponent } from './marquee-sale.component';

describe('MarqueeSaleComponent', () => {
  let component: MarqueeSaleComponent;
  let fixture: ComponentFixture<MarqueeSaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarqueeSaleComponent]
    });
    fixture = TestBed.createComponent(MarqueeSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
