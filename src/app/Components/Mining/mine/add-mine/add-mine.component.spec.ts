import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMineComponent } from './add-mine.component';

describe('AddMineComponent', () => {
  let component: AddMineComponent;
  let fixture: ComponentFixture<AddMineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMineComponent]
    });
    fixture = TestBed.createComponent(AddMineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
