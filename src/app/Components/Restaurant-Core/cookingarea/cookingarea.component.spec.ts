import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookingareaComponent } from './cookingarea.component';

describe('CookingareaComponent', () => {
  let component: CookingareaComponent;
  let fixture: ComponentFixture<CookingareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CookingareaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookingareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
