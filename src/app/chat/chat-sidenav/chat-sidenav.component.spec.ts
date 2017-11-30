import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSidenavComponent } from './chat-sidenav.component';

describe('ChatSidenavComponent', () => {
  let component: ChatSidenavComponent;
  let fixture: ComponentFixture<ChatSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
