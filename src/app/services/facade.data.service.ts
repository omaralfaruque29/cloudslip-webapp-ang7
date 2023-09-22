import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CurrentUserService } from './current-user.service';


@Injectable()
export class FacadeDataService {

  private baseUrl: string;

  constructor(private http: HttpClient, private currentUserService: CurrentUserService) {
    this.baseUrl = 'http://localhost:8080/';
  }

  private getToken() {
    let token = null;
    const currentUser = this.currentUserService.get();
    if (currentUser != null && currentUser['token'] !== undefined && currentUser['token'] != null) {
      token = currentUser['token'];
    }
    return token;
  }

  // Uses http.get() to load data from a single API endpoint
  get(url, queryParams?, responseType?) {
    const queryParameters = queryParams ? queryParams : {};
    const responseTypes = responseType ? responseType : null;

    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: queryParameters,
      responseType: responseTypes
    };

    const token = this.getToken();

    if (token != null) {
      httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-auth-token': token }),
        params: queryParameters,
        responseType: responseTypes
      };
    }
    return this.http.get(this.baseUrl + url, httpOptions);
  }

  post(url, data) {
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    const token = this.getToken();
    if (token != null) {
      httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-auth-token': token })
      };
    }
    const body = JSON.stringify(data);
    return this.http.post(this.baseUrl + url, body, httpOptions);
  }

  put(url, data) {
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    const token = this.getToken();
    if (token != null) {
      httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-auth-token': token })
      };
    }
    const body = JSON.stringify(data);
    return this.http.put(this.baseUrl + url, body, httpOptions);
  }

  delete(url, queryParams?) {
    const queryParameters = queryParams ? queryParams : {};
    const token = this.getToken();

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'x-auth-token': token }),
      params: queryParameters
    };

    return this.http.delete(this.baseUrl + url, httpOptions);
  }
}
