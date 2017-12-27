import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMembersDialogComponent } from './edit-members-dialog.component';

describe('EditMembersDialogComponent', () => {
  let component: EditMembersDialogComponent;
  let fixture: ComponentFixture<EditMembersDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMembersDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMembersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
