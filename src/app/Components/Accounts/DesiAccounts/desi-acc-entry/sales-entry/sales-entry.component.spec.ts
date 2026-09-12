import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesEntryComponent } from './sales-entry.component';

describe('SalesEntryComponent', () => {
  let component: SalesEntryComponent;
  let fixture: ComponentFixture<SalesEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesEntryComponent]
    });
    fixture = TestBed.createComponent(SalesEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
