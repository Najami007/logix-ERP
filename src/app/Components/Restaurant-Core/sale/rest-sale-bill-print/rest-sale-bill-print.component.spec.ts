import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestSaleBillPrintComponent } from './rest-sale-bill-print.component';

describe('RestSaleBillPrintComponent', () => {
  let component: RestSaleBillPrintComponent;
  let fixture: ComponentFixture<RestSaleBillPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestSaleBillPrintComponent]
    });
    fixture = TestBed.createComponent(RestSaleBillPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
