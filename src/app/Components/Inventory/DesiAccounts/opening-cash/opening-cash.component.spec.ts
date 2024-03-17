import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningCashComponent } from './opening-cash.component';

describe('OpeningCashComponent', () => {
  let component: OpeningCashComponent;
  let fixture: ComponentFixture<OpeningCashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpeningCashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpeningCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
