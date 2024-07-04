import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookerComponent } from './booker.component';

describe('BookerComponent', () => {
  let component: BookerComponent;
  let fixture: ComponentFixture<BookerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookerComponent]
    });
    fixture = TestBed.createComponent(BookerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
