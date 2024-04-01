import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WholeSaleComponent } from './whole-sale.component';

describe('WholeSaleComponent', () => {
  let component: WholeSaleComponent;
  let fixture: ComponentFixture<WholeSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WholeSaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WholeSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
