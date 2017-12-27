import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material'
import { ChatService } from '../../chat.service'

@Component({
  selector: 'app-edit-members-dialog',
  templateUrl: './edit-members-dialog.component.html',
  styleUrls: ['./edit-members-dialog.component.scss']
})
export class EditMembersDialogComponent {
	selectedUser;  
	constructor(@Inject(MAT_DIALOG_DATA) public data: any, private chatService: ChatService) { 
	}
	onDeleteUser(user) {
		this.chatService.deleteUserFromGroup(this.data.groupId, user)
	}
	onAddUser() {
		if(this.selectedUser && !this.data.users.find(user => user._id === this.selectedUser._id)) {
			this.chatService.addUserToGroup(this.data.groupId, this.selectedUser)
		}
	}
}
