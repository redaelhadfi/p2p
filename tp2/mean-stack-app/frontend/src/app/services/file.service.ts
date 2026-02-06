import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FileUploadResponse {
  success: boolean;
  message: string;
  filename?: string;
  path?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<FileUploadResponse>(`${this.apiUrl}/upload`, formData);
  }

  uploadAvatar(file: File): Observable<FileUploadResponse> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<FileUploadResponse>(`${this.apiUrl}/upload-avatar`, formData);
  }

  getFiles(): Observable<{ success: boolean; files: string[] }> {
    return this.http.get<{ success: boolean; files: string[] }>(`${this.apiUrl}/files`);
  }

  deleteFile(filename: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/files/${filename}`);
  }
}
