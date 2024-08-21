import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sale1Component } from './sale1.component';

describe('Sale1Component', () => {
  let component: Sale1Component;
  let fixture: ComponentFixture<Sale1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Sale1Component]
    });
    fixture = TestBed.createComponent(Sale1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
