import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupConversationComponent } from './group-conversation.component';

describe('GroupConversationComponent', () => {
  let component: GroupConversationComponent;
  let fixture: ComponentFixture<GroupConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupConversationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
