import { Component, OnInit, Renderer2,Input, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-select-dropdown',
  templateUrl: './custom-select-dropdown.component.html',
  styleUrls: ['./custom-select-dropdown.component.css']
})
export class CustomSelectDropdownComponent implements OnInit {
  @Input('placeholder') placehoder?:string;
  @Input('chipList') chipList:any[] = [];
  @Input('selectedList') selectedList:any[] = [];
  @Output() selectedListParent= new EventEmitter();
  outsideClick: Function;
  ChipInput: string = '';
  IsChipListVisibile: boolean = false;
  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.listGenerate();
    this.filterSelected();
  }
  listGenerate(){
    if(this.chipList.length){     
      for(let m of this.chipList){
        m.active = false;
      }
    }
    if(!this.placehoder){
      this.placehoder = 'Select data';
    }
    // if(!this.selectedList.length)
   
    //this.selectedList = [
      // { "key": "Chip1", "text": "Chip1" },
      // { "key": "Chip2", "text": "Chip2 chip2" }
    //];
  }
  filterSelected() {
    let selectedList: string[] = [];
    for (let m of this.selectedList) {
      selectedList.push(m.key);
    }
    this.chipList = this.chipList.filter((v) => {
      return selectedList.indexOf(v.key) == -1
    });
    if(this.chipList.length)
    this.chipList[0].active = true;
  }
  removeItem(chip: any) {
    this.selectedList = this.selectedList.filter((v) => {
      return v.key != chip.key
    });
    this.chipList.push({ "key": chip.key, "text": chip.text });
    // this.selectedList = this.selectedList.slice();
    this.valueChanges();

  }
  pushtoselected(chip: any) {
    this.chipList = this.chipList.filter((v) => {
      return v.key != chip.key
    });
    this.selectedList.push({ "key": chip.key, "text": chip.text });
    this.ChipInput = '';
    if (this.chipList.length) {
      this.chipList[0].active = true;
    }

    if (this.outsideClick == undefined)
      this.outsideClick = this.outSideClick();
  }
  inputBoxFocus(isFocus: boolean) {
    
    this.IsChipListVisibile = isFocus;
    if (this.outsideClick == undefined)
    this.outsideClick = this.outSideClick();
    
  }
  listPosition(elem: any) {
    if (elem.keyCode == 13) { //Enter key
      if (this.chipList.length) {
        let currentIndex: number = -1;
        for (let m in this.chipList) {
          if (this.chipList[m].active) {
            currentIndex = Number(m);
          }
        }
        if (currentIndex > -1)
          this.pushtoselected(this.chipList[currentIndex]);
      }
    } else if (elem.keyCode == 40) { //down arrow
      this.moveActive('down');
    }
    else if (elem.keyCode == 38) { //up arrow
      this.moveActive('up');
    }
    else if (elem.keyCode == 8) { //backspace
      let len = elem.target.value.length;
      if (len == 0 && this.selectedList.length) {
        this.removeItem(this.selectedList[this.selectedList.length - 1]);
      }
    }
  }
  moveActive(type: string) {
    let currentIndex: number = -1;
    for (let m in this.chipList) {
      if (this.chipList[m].active) {
        currentIndex = Number(m);
      }
      this.chipList[m].active = false;
    }
    if (currentIndex > -1) {
      if (type == 'down') {
        if (currentIndex == this.chipList.length - 1) {
          this.chipList[this.chipList.length - 1].active = true;
        }
        else {
          this.chipList[currentIndex + 1].active = true;
        }
      }
      else {
        if (currentIndex == 0) {
          this.chipList[0].active = true;
        }
        else {
          this.chipList[currentIndex - 1].active = true;
        }
      }
    }
  }
  outSideClick() {
    return this.renderer.listen('body', 'click', event => {
      let target = event.target.classList.contains('chips') || event.target.classList.contains('chip-input');
      if (!target) {
        this.IsChipListVisibile = false;
        this.outsideClick();
        this.outsideClick = undefined;
      }
    });
  }

  valueChanges(){
    this.selectedListParent.emit(this.selectedList);
  }

}
