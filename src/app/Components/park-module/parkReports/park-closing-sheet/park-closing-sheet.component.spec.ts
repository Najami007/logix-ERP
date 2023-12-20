import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkClosingSheetComponent } from './park-closing-sheet.component';

describe('ParkClosingSheetComponent', () => {
  let component: ParkClosingSheetComponent;
  let fixture: ComponentFixture<ParkClosingSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParkClosingSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkClosingSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
