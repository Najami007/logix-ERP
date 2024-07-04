import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotNatureComponent } from './plot-nature.component';

describe('PlotNatureComponent', () => {
  let component: PlotNatureComponent;
  let fixture: ComponentFixture<PlotNatureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlotNatureComponent]
    });
    fixture = TestBed.createComponent(PlotNatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
