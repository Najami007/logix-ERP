import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeComparisonComponent } from './recipe-comparison.component';

describe('RecipeComparisonComponent', () => {
  let component: RecipeComparisonComponent;
  let fixture: ComponentFixture<RecipeComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeComparisonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
