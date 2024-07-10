import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileOwnershipComponent } from './file-ownership.component';

describe('FileOwnershipComponent', () => {
  let component: FileOwnershipComponent;
  let fixture: ComponentFixture<FileOwnershipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileOwnershipComponent]
    });
    fixture = TestBed.createComponent(FileOwnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
