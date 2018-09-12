import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popupbox',
  templateUrl: './popupbox.component.html',
  styleUrls: ['./popupbox.component.css']
})
export class PopupboxComponent implements OnInit {
  @Input('message') message?:string;
@Output() back = new EventEmitter()

  constructor() { }

  ngOnInit() {
    this.message = 'Request send success'
  }

  backParent(){
    this.back.emit(true);
  }
  

}
