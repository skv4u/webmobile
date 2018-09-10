import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import { ConfigurationMicroService } from './configuration-micro.service';


@Injectable()
export class CommonService {
  
  private URL: any = {
    "Config": this._config.getConfigUrl() + '/v1/configuration',
    "Report": this._config.getReportUrl() + 'v1/report',
    "Admin": this._config.getAdminUrl() + '/v1/configuration',
    "Operation": this._config.getOperationUrl() + '/V1.0.0'
  }
  constructor(private http: Http, 
    
    private _config: ConfigurationMicroService) { }

 // method post
 PostMethod(url, data, urltype: string = 'Operation') {
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  let body = data;
  let endPoint = this.URL[urltype] + "/" + url;
  return this.http.post(endPoint, body, { headers: headers })
    .map((response: Response) => response.json())
  
}


// method get
GetMethod(args: string, urltype: string = 'Operation') {
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');

  let baseEndPoint = this.URL[urltype] + "/" + args;
  return this.http.get(baseEndPoint, { headers: headers })
    .map((response: Response) => response.json());
}


  clearStorage(){
    localStorage.clear();
  }

}
