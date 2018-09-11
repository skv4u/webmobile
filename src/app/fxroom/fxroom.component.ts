import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonService } from './../shared/common.service';


@Component({
  selector: 'app-fxroom',
  templateUrl: './fxroom.component.html',
  styleUrls: ['./fxroom.component.css'],
  providers:[CommonService]
})
export class FxroomComponent implements OnInit {

  isCreateVisible: boolean = true;
  error: boolean = false;
  isProcessing: boolean = false;
  pageNotFound: boolean = false;
  currentTab:string = "ServiceRequest";
  tabs:any = [{
    "tabName":"Service Request",
    "tabKey":"ServiceRequest",
    "IsActive":true
  },
  {
    "tabName":"Feedback",
    "tabKey":"Feedback",
    "IsActive":false
  },
  {
  
    "tabName":"Offers",
    "tabKey":"Offers",
    "IsActive":false
  }];
  hotelData: any = {
    "FullName": "",
    "Name": "",
    "Logo": ""
  };
  queryData: any = {};
serviceList:any;
  constructor(private _title: Title,public commonService: CommonService) {
    this.queryData = this.queryParam(window.top.location.href);
    if (this.queryData)
      this.listHotelData((sucess)=>{
        if(sucess){
          this.listServices();
        }
      });
    else
      this.pageNotFound = true;
   }

  ngOnInit() {
    this._title.setTitle('FX-Service : Service Request');
  }
  listHotelData(callback) {
    this.isProcessing = true;
    this.commonService.GetMethod("hotel-info/" + this.queryData.p, "Admin").subscribe(
      data => {
        if (data && data.Data) {
          this.hotelData.FullName = data.Data.PropertyName;
          this.hotelData.Name = data.Data.PropertyName;
          this.hotelData.Logo = data.Data.ShortLogo;

        }
        else {
          this.pageNotFound = true;
        }
        this.isProcessing = false;
        callback(true);
      },
      error =>{
        callback(false);
      }
      
    )
  }
  listServices(){
    this.isProcessing = true;
    this.commonService.GetMethod(this.queryData.p + '/' + this.queryData.e, "Datahub").subscribe(
      data => {
       console.log(data);
       if(data && data.departments){
        this.serviceList = data.departments;
       }
        this.isProcessing = false;       
      }      
    )
  }
  queryParam(myvar) {
    let urls = myvar;
    let myurls = urls.split("?");
    let queryString = myurls[1];
    if (queryString)
      return JSON.parse('{"' + queryString.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
    else
      return null;
  }
  viewTabDetail(key:string,index:number){
    for(let i=0; i<this.tabs.length; i++){
      this.tabs[i].IsActive = false;
    }
    this.tabs[index].IsActive = true;

    this.currentTab = key;
    this._title.setTitle('FX-Service : ' + this.tabs[index].tabName);
  }

}
