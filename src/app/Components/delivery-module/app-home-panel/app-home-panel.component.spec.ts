import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppHomePanelComponent } from './app-home-panel.component';

describe('AppHomePanelComponent', () => {
  let component: AppHomePanelComponent;
  let fixture: ComponentFixture<AppHomePanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppHomePanelComponent]
    });
    fixture = TestBed.createComponent(AppHomePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
