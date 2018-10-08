import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popupbox',
  templateUrl: './popupbox.component.html',
  styleUrls: ['./popupbox.component.css']
})
export class PopupboxComponent implements OnInit {
  @Input('message') message:string;
  @Input('type') type?:string;
@Output() back = new EventEmitter()

  constructor() { }

  ngOnInit() {
    // this.message = 'Request send success'
    if(this.type == undefined || this.type == 'undefined'){
      this.type = 'success';
    }
  }

  backParent(){
    this.back.emit(true);
  }
  

}
