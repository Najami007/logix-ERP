import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningStockAllComponent } from './opening-stock-all.component';

describe('OpeningStockAllComponent', () => {
  let component: OpeningStockAllComponent;
  let fixture: ComponentFixture<OpeningStockAllComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpeningStockAllComponent]
    });
    fixture = TestBed.createComponent(OpeningStockAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
