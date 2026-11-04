import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBillTokenComponent } from './print-bill-token.component';

describe('PrintBillTokenComponent', () => {
  let component: PrintBillTokenComponent;
  let fixture: ComponentFixture<PrintBillTokenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintBillTokenComponent]
    });
    fixture = TestBed.createComponent(PrintBillTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
