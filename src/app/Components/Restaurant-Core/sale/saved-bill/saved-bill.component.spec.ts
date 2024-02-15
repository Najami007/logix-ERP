import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedBillComponent } from './saved-bill.component';

describe('SavedBillComponent', () => {
  let component: SavedBillComponent;
  let fixture: ComponentFixture<SavedBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedBillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
