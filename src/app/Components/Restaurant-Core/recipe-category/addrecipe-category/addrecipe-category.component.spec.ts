import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddrecipeCategoryComponent } from './addrecipe-category.component';

describe('AddrecipeCategoryComponent', () => {
  let component: AddrecipeCategoryComponent;
  let fixture: ComponentFixture<AddrecipeCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddrecipeCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddrecipeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
