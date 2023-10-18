import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoaNotesComponent } from './coa-notes.component';

describe('CoaNotesComponent', () => {
  let component: CoaNotesComponent;
  let fixture: ComponentFixture<CoaNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoaNotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoaNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
