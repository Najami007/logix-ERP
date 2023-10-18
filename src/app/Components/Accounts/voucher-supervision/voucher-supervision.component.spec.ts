import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherSupervisionComponent } from './voucher-supervision.component';

describe('VoucherSupervisionComponent', () => {
  let component: VoucherSupervisionComponent;
  let fixture: ComponentFixture<VoucherSupervisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherSupervisionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherSupervisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
