import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProfile(): Observable<{ success: boolean; user: User }> {
    return this.http.get<{ success: boolean; user: User }>(`${this.apiUrl}/profile`);
  }

  updateProfile(user: Partial<User>): Observable<{ success: boolean; message: string; user: User }> {
    return this.http.put<{ success: boolean; message: string; user: User }>(`${this.apiUrl}/profile`, user);
  }

  getAllUsers(): Observable<{ success: boolean; users: User[] }> {
    return this.http.get<{ success: boolean; users: User[] }>(`${this.apiUrl}/users`);
  }

  deleteUser(userId: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/users/${userId}`);
  }
}
