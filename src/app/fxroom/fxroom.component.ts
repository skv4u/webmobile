import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonService } from './../shared/common.service';
import { error } from 'selenium-webdriver';


@Component({
  selector: 'app-fxroom',
  templateUrl: './fxroom.component.html',
  styleUrls: ['./fxroom.component.css'],
  providers: [CommonService]
})
export class FxroomComponent implements OnInit {

  isCreateVisible: boolean = true;
  error: boolean = false;
  isProcessing: boolean = false;
  pageNotFound: boolean = false;
  currentTab: string = "ServiceRequest";
  tabs: any = [{
    "tabName": "Service Request",
    "tabKey": "ServiceRequest",
    "IsActive": true
  },
  {
    "tabName": "Feedback",
    "tabKey": "Feedback",
    "IsActive": false
  },
  {

    "tabName": "Offers",
    "tabKey": "Offers",
    "IsActive": false
  }];
  hotelData: any = {
    "FullName": "",
    "Name": "",
    "Logo": ""
  };
  queryData: any = {};
  serviceList: any;
  saveSuccess:boolean = false;
  responseMessage:string = "";
  popupVisibility:boolean =false;

  constructor(private _title: Title, public commonService: CommonService) {
    this.queryData = this.queryParam(window.top.location.href);
    if (this.queryData)
      this.listHotelData((sucess) => {
        if (sucess) {
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
        // else {
        //   this.pageNotFound = true;
        // }
        this.isProcessing = false;
        callback(true);
      },
      error => {
        callback(false);
      }

    )
  }
  listServices() {
    this.isProcessing = true;
    this.commonService.GetMethod("masterservices/" + this.queryData.p + '/' + this.queryData.e, "Datahub").subscribe(
      data => {
        if (data && data.departments) {
          for (let m of data.departments) {
            for (let n of m.requests) {
              n.IsChecked = false;
            }
          }
          this.serviceList = data.departments;
          // console.log(this.serviceList);

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
  viewTabDetail(key: string, index: number) {
    for (let i = 0; i < this.tabs.length; i++) {
      this.tabs[i].IsActive = false;
    }
    this.tabs[index].IsActive = true;

    this.currentTab = key;
    this._title.setTitle('FX-Service : ' + this.tabs[index].tabName);
  }

  saveServiceRequest() {
    // this.saveSuccess =false;
    // this.isCreateVisible = false;
    // this.isProcessing = false;
    // this.responseMessage = "Oops!!! Invalid room number";
    // if(1){
    //   return
    // }
    // console.log(this.serviceList);
    this.popupVisibility = true;
      if(1){
      return
    }
    let serviceRequest: any[] = [];
    for (let m of this.serviceList) {
      for (let rq of m.requests) {
        if(rq.IsChecked){
        serviceRequest.push({
          "departmentCode": m.departmentCode,
          "request": rq.requestName,
          "requestCode": rq.requestCode
        });
      }
      }
    }
    let json = {
      "createdByName": "Prabu",
      "hotelCode": this.queryData.p,
      "isRequestRelatedToRoom": true,
      "isRequestedbyGuest": true,
      "loginUserId": this.queryData.e,
      "roomNumber": this.queryData.r,
      "serviceRequests": serviceRequest
    };
    this.isProcessing = true;
    this.commonService.PostMethod("servicetransactions/savewithflrinfo", json, "Datahub").subscribe(
      data => {
        console.log(data);
        this.saveSuccess =true;
        this.isCreateVisible = false;
        this.isProcessing = false;
        this.responseMessage = "Request Sent Successfully ";
      },
      error =>{
        this.saveSuccess =false;
        this.isCreateVisible = false;
        this.isProcessing = false;
        this.responseMessage = "Oops!!! Invalid room number";
      }
    );
  }
  /*currentTab: string = "ServiceRequest";
  tabs: any = [{
    "tabName": "Service Request",
    "tabKey": "ServiceRequest",
    "IsActive": true
  },
  {
    "tabName": "Feedback",
    "tabKey": "Feedback",
    "IsActive": false
  },
  {

    "tabName": "Offers",
    "tabKey": "Offers",
    "IsActive": false
  }];*/
  loadTab(type:string){
    if(type == 'left'){
      if(this.currentTab == 'Offers') return;
      if(this.currentTab == 'ServiceRequest'){
        // this.currentTab = 'Feedback';
        this.viewTabDetail('Feedback',1);
      }else if( this.currentTab == 'Feedback'){
        // this.currentTab = 'Offers';
        this.viewTabDetail('Offers',2);
      }
    }
    else {
      if(this.currentTab == 'ServiceRequest') return;
      if(this.currentTab == 'Offers'){
        // this.currentTab = 'Feedback';
        this.viewTabDetail('Feedback',1);
        
      }else if( this.currentTab == 'Feedback'){
        // this.currentTab = 'ServiceRequest';
        this.viewTabDetail('ServiceRequest',0);
      }
    }
  }

}
