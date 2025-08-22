import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturingSaleCategoryComponent } from './manufacturing-sale-category.component';

describe('ManufacturingSaleCategoryComponent', () => {
  let component: ManufacturingSaleCategoryComponent;
  let fixture: ComponentFixture<ManufacturingSaleCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManufacturingSaleCategoryComponent]
    });
    fixture = TestBed.createComponent(ManufacturingSaleCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
