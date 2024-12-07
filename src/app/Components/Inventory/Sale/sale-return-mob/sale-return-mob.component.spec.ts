import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturnMobComponent } from './sale-return-mob.component';

describe('SaleReturnMobComponent', () => {
  let component: SaleReturnMobComponent;
  let fixture: ComponentFixture<SaleReturnMobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleReturnMobComponent]
    });
    fixture = TestBed.createComponent(SaleReturnMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
