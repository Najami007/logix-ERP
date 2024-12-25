import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProdSubCategoryComponent } from './add-prod-sub-category.component';

describe('AddProdSubCategoryComponent', () => {
  let component: AddProdSubCategoryComponent;
  let fixture: ComponentFixture<AddProdSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProdSubCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProdSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
