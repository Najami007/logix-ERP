import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductImagesComponent } from './add-product-images.component';

describe('AddProductImagesComponent', () => {
  let component: AddProductImagesComponent;
  let fixture: ComponentFixture<AddProductImagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddProductImagesComponent]
    });
    fixture = TestBed.createComponent(AddProductImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
