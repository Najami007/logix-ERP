import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdddwComponent } from './adddw.component';

describe('AdddwComponent', () => {
  let component: AdddwComponent;
  let fixture: ComponentFixture<AdddwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdddwComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdddwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
