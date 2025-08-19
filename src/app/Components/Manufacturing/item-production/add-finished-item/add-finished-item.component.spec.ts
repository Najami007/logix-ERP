import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFinishedItemComponent } from './add-finished-item.component';

describe('AddFinishedItemComponent', () => {
  let component: AddFinishedItemComponent;
  let fixture: ComponentFixture<AddFinishedItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddFinishedItemComponent]
    });
    fixture = TestBed.createComponent(AddFinishedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
