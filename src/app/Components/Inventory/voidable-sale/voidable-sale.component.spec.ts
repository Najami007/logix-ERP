import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidableSaleComponent } from './voidable-sale.component';

describe('VoidableSaleComponent', () => {
  let component: VoidableSaleComponent;
  let fixture: ComponentFixture<VoidableSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoidableSaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoidableSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
