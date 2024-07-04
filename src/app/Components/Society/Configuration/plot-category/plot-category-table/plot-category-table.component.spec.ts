import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotCategoryTableComponent } from './plot-category-table.component';

describe('PlotCategoryTableComponent', () => {
  let component: PlotCategoryTableComponent;
  let fixture: ComponentFixture<PlotCategoryTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlotCategoryTableComponent]
    });
    fixture = TestBed.createComponent(PlotCategoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
