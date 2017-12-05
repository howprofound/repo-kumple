import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatMessages'
})
export class FormatMessagesPipe implements PipeTransform {

  transform(messages: Array<any>): Array<any> {
    let messagesToDisplay = []
    messages.forEach(message => {
      message.date = new Date(message.date)
      if(messagesToDisplay.length === 0 || messagesToDisplay[messagesToDisplay.length - 1][0].author._id !== message.author._id) {
        messagesToDisplay.push([message])
      }
      else {
        messagesToDisplay[messagesToDisplay.length - 1].push(message)
      }
    })
    return messagesToDisplay
  }
}
