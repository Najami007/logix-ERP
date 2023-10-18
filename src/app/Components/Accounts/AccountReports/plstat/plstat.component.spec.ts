import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PLStatComponent } from './plstat.component';

describe('PLStatComponent', () => {
  let component: PLStatComponent;
  let fixture: ComponentFixture<PLStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PLStatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PLStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
