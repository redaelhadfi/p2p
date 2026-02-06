import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { FileService } from '../../services/file.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentUser: User | null = null;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  selectedFile: File | null = null;
  uploadProgress = 0;
  uploadedFiles: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private fileService: FileService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.initializeForm();
    this.loadProfile();
    this.loadFiles();
  }

  initializeForm(): void {
    this.profileForm = this.formBuilder.group({
      firstname: [this.currentUser?.firstname || '', Validators.required],
      lastname: [this.currentUser?.lastname || '', Validators.required],
      email: [{ value: this.currentUser?.email || '', disabled: true }, [Validators.required, Validators.email]],
      age: [this.currentUser?.age || '', [Validators.min(1), Validators.max(150)]]
    });
  }

  get f() {
    return this.profileForm.controls;
  }

  loadProfile(): void {
    this.userService.getProfile().subscribe({
      next: (response) => {
        if (response.success && response.user) {
          this.currentUser = response.user;
          this.profileForm.patchValue(response.user);
        }
      },
      error: (error) => {
        console.error('Failed to load profile', error);
      }
    });
  }

  loadFiles(): void {
    this.fileService.getFiles().subscribe({
      next: (response) => {
        if (response.success) {
          this.uploadedFiles = response.files;
        }
      },
      error: (error) => {
        console.error('Failed to load files', error);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
    const userData = this.profileForm.getRawValue();

    this.userService.updateProfile(userData).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Profile updated successfully!';
          // Update current user in auth service
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to update profile';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onUpload(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file';
      return;
    }

    this.uploadProgress = 0;
    this.fileService.uploadFile(this.selectedFile).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'File uploaded successfully!';
          this.selectedFile = null;
          this.loadFiles(); // Reload files list
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'File upload failed';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }

  onAvatarSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileService.uploadAvatar(file).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Avatar updated successfully!';
            this.loadProfile();
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Avatar upload failed';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
    }
  }

  deleteFile(filename: string): void {
    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }

    this.fileService.deleteFile(filename).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'File deleted successfully!';
          this.loadFiles();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to delete file';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }
}
