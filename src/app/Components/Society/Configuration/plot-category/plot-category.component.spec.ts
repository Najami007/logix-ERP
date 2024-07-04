import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotCategoryComponent } from './plot-category.component';

describe('PlotCategoryComponent', () => {
  let component: PlotCategoryComponent;
  let fixture: ComponentFixture<PlotCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlotCategoryComponent]
    });
    fixture = TestBed.createComponent(PlotCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
