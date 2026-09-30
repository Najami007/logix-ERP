import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMenuBar2Component } from './navigation-menu-bar2.component';

describe('NavigationMenuBar2Component', () => {
  let component: NavigationMenuBar2Component;
  let fixture: ComponentFixture<NavigationMenuBar2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationMenuBar2Component]
    });
    fixture = TestBed.createComponent(NavigationMenuBar2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
