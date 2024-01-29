import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkDashBoardComponent } from './park-dash-board.component';

describe('ParkDashBoardComponent', () => {
  let component: ParkDashBoardComponent;
  let fixture: ComponentFixture<ParkDashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParkDashBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
