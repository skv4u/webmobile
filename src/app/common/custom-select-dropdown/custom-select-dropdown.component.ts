import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-select-dropdown',
  templateUrl: './custom-select-dropdown.component.html',
  styleUrls: ['./custom-select-dropdown.component.css']
})
export class CustomSelectDropdownComponent implements OnInit {
  chipList:any[]=[
    {"key":"Chip1","text":"Chip1"},
    {"key":"Chip2","text":"Chip2"},
    {"key":"Chip3","text":"Chip3"},
  ];
  constructor() { }

  ngOnInit() {
  }

}
