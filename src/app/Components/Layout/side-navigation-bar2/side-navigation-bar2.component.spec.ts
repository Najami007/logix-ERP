import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavigationBar2Component } from './side-navigation-bar2.component';

describe('SideNavigationBar2Component', () => {
  let component: SideNavigationBar2Component;
  let fixture: ComponentFixture<SideNavigationBar2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SideNavigationBar2Component]
    });
    fixture = TestBed.createComponent(SideNavigationBar2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
