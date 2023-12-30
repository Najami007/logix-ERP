import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesummarydateuserwiseComponent } from './salesummarydateuserwise.component';

describe('SalesummarydateuserwiseComponent', () => {
  let component: SalesummarydateuserwiseComponent;
  let fixture: ComponentFixture<SalesummarydateuserwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesummarydateuserwiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesummarydateuserwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
