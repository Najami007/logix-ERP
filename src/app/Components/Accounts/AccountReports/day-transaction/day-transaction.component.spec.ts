import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTransactionComponent } from './day-transaction.component';

describe('DayTransactionComponent', () => {
  let component: DayTransactionComponent;
  let fixture: ComponentFixture<DayTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
