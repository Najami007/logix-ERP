import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KOTPrintComponent } from './kotprint.component';

describe('KOTPrintComponent', () => {
  let component: KOTPrintComponent;
  let fixture: ComponentFixture<KOTPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KOTPrintComponent]
    });
    fixture = TestBed.createComponent(KOTPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
