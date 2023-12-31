import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesummaryrptswingwiseComponent } from './salesummaryrptswingwise.component';

describe('SalesummaryrptswingwiseComponent', () => {
  let component: SalesummaryrptswingwiseComponent;
  let fixture: ComponentFixture<SalesummaryrptswingwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesummaryrptswingwiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesummaryrptswingwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
