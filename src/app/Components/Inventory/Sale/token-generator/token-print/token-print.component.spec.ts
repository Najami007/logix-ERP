import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenPrintComponent } from './token-print.component';

describe('TokenPrintComponent', () => {
  let component: TokenPrintComponent;
  let fixture: ComponentFixture<TokenPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TokenPrintComponent]
    });
    fixture = TestBed.createComponent(TokenPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
