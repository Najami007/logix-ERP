import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictpwdComponent } from './restrictpwd.component';

describe('RestrictpwdComponent', () => {
  let component: RestrictpwdComponent;
  let fixture: ComponentFixture<RestrictpwdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestrictpwdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestrictpwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
