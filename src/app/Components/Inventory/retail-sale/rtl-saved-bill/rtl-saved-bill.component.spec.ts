import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtlSavedBillComponent } from './rtl-saved-bill.component';

describe('RtlSavedBillComponent', () => {
  let component: RtlSavedBillComponent;
  let fixture: ComponentFixture<RtlSavedBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RtlSavedBillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RtlSavedBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
