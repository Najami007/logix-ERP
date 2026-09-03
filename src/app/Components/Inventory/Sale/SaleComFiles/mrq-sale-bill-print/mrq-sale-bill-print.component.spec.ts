import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrqSaleBillPrintComponent } from './mrq-sale-bill-print.component';

describe('MrqSaleBillPrintComponent', () => {
  let component: MrqSaleBillPrintComponent;
  let fixture: ComponentFixture<MrqSaleBillPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MrqSaleBillPrintComponent]
    });
    fixture = TestBed.createComponent(MrqSaleBillPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
