import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImgComponent } from './product-img.component';

describe('ProductImgComponent', () => {
  let component: ProductImgComponent;
  let fixture: ComponentFixture<ProductImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductImgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
