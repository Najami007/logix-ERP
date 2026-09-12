import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidSale2Component } from './void-sale2.component';

describe('VoidSale2Component', () => {
  let component: VoidSale2Component;
  let fixture: ComponentFixture<VoidSale2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoidSale2Component]
    });
    fixture = TestBed.createComponent(VoidSale2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
