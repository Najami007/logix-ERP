import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Voucher2Component } from './voucher2.component';

describe('Voucher2Component', () => {
  let component: Voucher2Component;
  let fixture: ComponentFixture<Voucher2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Voucher2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Voucher2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
