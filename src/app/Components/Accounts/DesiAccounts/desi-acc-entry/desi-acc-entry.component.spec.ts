import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesiAccEntryComponent } from './desi-acc-entry.component';

describe('DesiAccEntryComponent', () => {
  let component: DesiAccEntryComponent;
  let fixture: ComponentFixture<DesiAccEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesiAccEntryComponent]
    });
    fixture = TestBed.createComponent(DesiAccEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
