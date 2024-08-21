import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sale2Component } from './sale2.component';

describe('Sale2Component', () => {
  let component: Sale2Component;
  let fixture: ComponentFixture<Sale2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Sale2Component]
    });
    fixture = TestBed.createComponent(Sale2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
