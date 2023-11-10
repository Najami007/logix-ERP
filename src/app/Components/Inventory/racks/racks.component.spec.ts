import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RacksComponent } from './racks.component';

describe('RacksComponent', () => {
  let component: RacksComponent;
  let fixture: ComponentFixture<RacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RacksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
