import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobUserListComponent } from './mob-user-list.component';

describe('MobUserListComponent', () => {
  let component: MobUserListComponent;
  let fixture: ComponentFixture<MobUserListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MobUserListComponent]
    });
    fixture = TestBed.createComponent(MobUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
