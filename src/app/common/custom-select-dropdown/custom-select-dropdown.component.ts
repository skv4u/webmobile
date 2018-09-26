import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-custom-select-dropdown',
  templateUrl: './custom-select-dropdown.component.html',
  styleUrls: ['./custom-select-dropdown.component.css']
})
export class CustomSelectDropdownComponent implements OnInit {
  outsideClick: Function;
  
  MasterChipList: any[] = [
    { "key": "Chip1", "text": "Chip1" },
    { "key": "Chip2", "text": "Chip2 chip2" },
    { "key": "Chip3", "text": "Chip3 chip3 chip3" },
    { "key": "Chip4", "text": "Chip4 chip4 chip4" }
  ];
  chipList: any[] = [
    { "key": "Chip1", "text": "Chip1", "active": false },
    { "key": "Chip2", "text": "Chip2 chip2", "active": false },
    { "key": "Chip3", "text": "Chip3 chip3 chip3", "active": false },
    { "key": "Chip4", "text": "Chip4 chip4 chip4", "active": false }
  ];
  selectedList: any[] = [
    // { "key": "Chip1", "text": "Chip1" },
    // { "key": "Chip2", "text": "Chip2 chip2" }
  ];
  ChipInput: string = '';
  IsChipListVisibile: boolean = false;
  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.filterSelected();
  }
  filterSelected() {
    let selectedList: string[] = [];
    for (let m of this.selectedList) {
      selectedList.push(m.key);
    }
    this.chipList = this.chipList.filter((v) => {
      return selectedList.indexOf(v.key) == -1
    });

    this.chipList[0].active = true;
  }
  removeItem(chip: any) {
    this.selectedList = this.selectedList.filter((v) => {
      return v.key != chip.key
    });
    this.chipList.push({ "key": chip.key, "text": chip.text });
    // this.chipList[0].active = true;

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
    this.IsChipListVisibile = true;
  //  this.outsideClick = this.outSideClick();
  }
  inputBoxFocus(isFocus: boolean) {
    console.log(event.target);
    this.IsChipListVisibile = isFocus;
    // this.outsideClick = this.outSideClick();
  }
  listPosition(elem: any) {
    console.log(elem);
    if (elem.keyCode == 13) { //Enter key
      if (this.chipList.length){
        let currentIndex:number=-1;
        for(let m in this.chipList){
          if(this.chipList[m].active){
            currentIndex = Number(m);
          }
        }
        if(currentIndex > -1)
        this.pushtoselected(this.chipList[currentIndex]);
      }
    } else if (elem.keyCode == 40) { //down arrow
      this.moveActive('down');
    }
    else if (elem.keyCode == 38) { //up arrow
      this.moveActive('up');
      
    }
    else if (elem.keyCode == 8) { //up arrow
      this.removeItem(this.selectedList[this.selectedList.length - 1]);
    }
  }
  moveActive(type:string){
    let currentIndex:number=0;
    for(let m in this.chipList){
      if(this.chipList[m].active){
        currentIndex = Number(m);
      }
      this.chipList[m].active = false;
    }
    if(type == 'down'){

    
    if(currentIndex == this.chipList.length - 1){
      this.chipList[this.chipList.length - 1].active = true;
    }
    else {
      this.chipList[currentIndex+1].active = true;
    }
  }
  else {
    if(currentIndex == 0){
      this.chipList[0].active = true;
    }
    else {
      this.chipList[currentIndex-1].active = true;
    }
  }
  }
  // outSideClick() {
   

  //   return this.renderer.listen('body', 'click', event => {
  //     console.log(event.target);
  //     let target = event.target.classList.contains('chips') || event.target.classList.contains('chips');
  //     if(target){
  //       this.IsChipListVisibile = true;
  //     }
  //     else{
  //       this.IsChipListVisibile = false;
  //       this.outsideClick();
  //     }
  //   });
  // }
}
