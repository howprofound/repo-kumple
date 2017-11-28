import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material'
@Component({
  selector: 'new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.scss']
})
export class NewGroupComponent {
	constructor(@Inject(MAT_DIALOG_DATA) public data: any) { 
	}
	onUserSelect(user) {
		console.log(user)
		if(user.isSelected) {
			user.isSelected = false
		}
		else {
			user.isSelected = true
		}
	}
}
