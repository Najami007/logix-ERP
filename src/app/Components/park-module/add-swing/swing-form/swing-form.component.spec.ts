import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwingFormComponent } from './swing-form.component';

describe('SwingFormComponent', () => {
  let component: SwingFormComponent;
  let fixture: ComponentFixture<SwingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwingFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
