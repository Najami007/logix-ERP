import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiningSaleComponent } from './mining-sale.component';

describe('MiningSaleComponent', () => {
  let component: MiningSaleComponent;
  let fixture: ComponentFixture<MiningSaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiningSaleComponent]
    });
    fixture = TestBed.createComponent(MiningSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
