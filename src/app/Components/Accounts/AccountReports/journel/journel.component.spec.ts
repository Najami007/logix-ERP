import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournelComponent } from './journel.component';

describe('JournelComponent', () => {
  let component: JournelComponent;
  let fixture: ComponentFixture<JournelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JournelComponent]
    });
    fixture = TestBed.createComponent(JournelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
