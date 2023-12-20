import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkSaleComponent } from './park-sale.component';

describe('ParkSaleComponent', () => {
  let component: ParkSaleComponent;
  let fixture: ComponentFixture<ParkSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParkSaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
