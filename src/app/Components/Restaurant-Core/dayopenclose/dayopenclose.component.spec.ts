import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayopencloseComponent } from './dayopenclose.component';

describe('DayopencloseComponent', () => {
  let component: DayopencloseComponent;
  let fixture: ComponentFixture<DayopencloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayopencloseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayopencloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
