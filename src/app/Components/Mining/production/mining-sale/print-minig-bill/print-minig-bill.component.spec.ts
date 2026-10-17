import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintMinigBillComponent } from './print-minig-bill.component';

describe('PrintMinigBillComponent', () => {
  let component: PrintMinigBillComponent;
  let fixture: ComponentFixture<PrintMinigBillComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintMinigBillComponent]
    });
    fixture = TestBed.createComponent(PrintMinigBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
