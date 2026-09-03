import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRecipeComponent } from './product-recipe.component';

describe('ProductRecipeComponent', () => {
  let component: ProductRecipeComponent;
  let fixture: ComponentFixture<ProductRecipeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductRecipeComponent]
    });
    fixture = TestBed.createComponent(ProductRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
