import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestKotPrintComponent } from './rest-kot-print.component';

describe('RestKotPrintComponent', () => {
  let component: RestKotPrintComponent;
  let fixture: ComponentFixture<RestKotPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestKotPrintComponent]
    });
    fixture = TestBed.createComponent(RestKotPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
