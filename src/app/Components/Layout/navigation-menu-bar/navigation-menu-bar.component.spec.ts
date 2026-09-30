import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMenuBarComponent } from './navigation-menu-bar.component';

describe('NavigationMenuBarComponent', () => {
  let component: NavigationMenuBarComponent;
  let fixture: ComponentFixture<NavigationMenuBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationMenuBarComponent]
    });
    fixture = TestBed.createComponent(NavigationMenuBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
