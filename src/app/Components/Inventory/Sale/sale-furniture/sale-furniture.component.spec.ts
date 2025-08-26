import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleFurnitureComponent } from './sale-furniture.component';

describe('SaleFurnitureComponent', () => {
  let component: SaleFurnitureComponent;
  let fixture: ComponentFixture<SaleFurnitureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleFurnitureComponent]
    });
    fixture = TestBed.createComponent(SaleFurnitureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
