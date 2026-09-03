import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentCardNewComponent } from './comment-card-new.component';

describe('CommentCardNewComponent', () => {
  let component: CommentCardNewComponent;
  let fixture: ComponentFixture<CommentCardNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommentCardNewComponent]
    });
    fixture = TestBed.createComponent(CommentCardNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
