import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationBodyComponent } from './conversation-body.component';

describe('ConversationBodyComponent', () => {
  let component: ConversationBodyComponent;
  let fixture: ComponentFixture<ConversationBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
