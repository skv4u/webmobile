import { Injectable } from '@angular/core';

@Injectable()
export class ConfigurationMicroService {

  private configUrl: string;
  private adminUrl: string;
  private reportsUrl: string;
  private operationUrl:string;
  private dataHubMaster:string;

  constructor() {
    this.setURL();
  }

  setURL() {
    let host = window.location.host;
    if (host == 'products.idsnext.com') { //Production
      this.configUrl = "https://fortunecloudapi.idsnext.com"; 
      this.adminUrl = "https://productsadminapi.idsnext.com"; 
      this.reportsUrl = "https://fcreportsapi.azurewebsites.net/"; 
      this.operationUrl = "https://fooperationsapi.azurewebsites.net";
      this.dataHubMaster = "https://datahubapi.idsnext.com";

    } else if (host == 'productsqa.idsnext.com') {// Testing
      this.configUrl = "https://fortunecloudqaapi.idsnext.com"; 
      this.adminUrl = "https://productsadminapiqa.idsnext.com";
      this.reportsUrl = "https://fcreportsapiqa.azurewebsites.net/";
      this.operationUrl = "https://fooperationsapiqa.azurewebsites.net";
      this.dataHubMaster = "https://datahubapi.idsnext.com";
      
    } else if (host == 'productsfat.idsnext.com') { // FAT
      this.configUrl = "https://fortunecloudfatapi.azurewebsites.net/"; 
      this.adminUrl = "https://productsadminapifat.azurewebsites.net/";
      this.reportsUrl = "https://fcreportsapifat.azurewebsites.net/";
      this.operationUrl = "https://fooperationsapifat.azurewebsites.net";
      this.dataHubMaster = "https://datahubapi.idsnext.com";
      

    } else if (host == 'productsua.idsnext.com') { // UA
      this.configUrl = "https://fortuneclouduaapi.azurewebsites.net";
      this.adminUrl = "https://productsadminapiua.azurewebsites.net";
      this.reportsUrl = "https://fcreportsapiua.azurewebsites.net/";
      this.operationUrl = "https://fooperationsapiua.azurewebsites.net";
      this.dataHubMaster = "https://datahubapi.idsnext.com";
      
    } else {  // Development
      this.configUrl = "https://fortuneclouddevapi.azurewebsites.net";
      this.adminUrl = "https://productsadminapidev.azurewebsites.net";
      this.reportsUrl = "https://fcreportsapidev.azurewebsites.net/";
      this.operationUrl = "https://fooperationsapidev.azurewebsites.net";
      this.dataHubMaster = "https://datahubapi.idsnext.com";

      this.configUrl = "https://fortunecloudqaapi.idsnext.com"; 
      this.adminUrl = "https://productsadminapiqa.idsnext.com";
      this.reportsUrl = "https://fcreportsapiqa.azurewebsites.net/";
      this.operationUrl = "https://fooperationsapiqa.azurewebsites.net";
      this.dataHubMaster = "https://datahubapi.idsnext.com";
    }
  }

  /**
   * @return Config URL
   */
  getConfigUrl(): string {
    return this.configUrl;
  }

  /**
   * @return Admin URL
   */
  getAdminUrl(): string {
    return this.adminUrl;
  }
  /**
   * @return Report URL
   */
  getReportUrl(): string {
    return this.reportsUrl;
  }

    /**
   * @return Operation URL
   */
  getOperationUrl(): string {
    return this.operationUrl;
  }

      /**
   * @return Operation URL
   */
  getDataHubMasterUrl(): string {
    return this.dataHubMaster;
  }
}
