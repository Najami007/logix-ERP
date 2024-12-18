import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabletSaleComponent } from './tablet-sale.component';

describe('TabletSaleComponent', () => {
  let component: TabletSaleComponent;
  let fixture: ComponentFixture<TabletSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabletSaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabletSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
