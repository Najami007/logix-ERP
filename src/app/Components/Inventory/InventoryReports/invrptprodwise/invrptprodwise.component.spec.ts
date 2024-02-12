import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvrptprodwiseComponent } from './invrptprodwise.component';

describe('InvrptprodwiseComponent', () => {
  let component: InvrptprodwiseComponent;
  let fixture: ComponentFixture<InvrptprodwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvrptprodwiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvrptprodwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
