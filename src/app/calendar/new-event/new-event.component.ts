import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material'
@Component({
  selector: 'new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss']
})
export class NewEventComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
  returnData = {
    title: "",
    place: "",
    description:  "",
    startDate: new Date(),
    endDate: new Date(),
    selectedUsers: []
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
