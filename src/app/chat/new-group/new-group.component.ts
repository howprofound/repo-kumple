import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material'
@Component({
  selector: 'new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.scss']
})
export class NewGroupComponent {
	returnData = {
		selectedUsers: [],
		title: ""
	}
	constructor(@Inject(MAT_DIALOG_DATA) public data: any) { 
	}
	onUserSelect(user) {
		if(this.returnData.selectedUsers.includes(user._id)) {
			this.returnData.selectedUsers.filter(selUser => selUser !== user._id)
		}
		else {
			this.returnData.selectedUsers.push(user._id)
		}
	}
}
