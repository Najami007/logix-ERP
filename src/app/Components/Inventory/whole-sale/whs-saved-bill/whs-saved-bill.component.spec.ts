import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhsSavedBillComponent } from './whs-saved-bill.component';

describe('WhsSavedBillComponent', () => {
  let component: WhsSavedBillComponent;
  let fixture: ComponentFixture<WhsSavedBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhsSavedBillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhsSavedBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
