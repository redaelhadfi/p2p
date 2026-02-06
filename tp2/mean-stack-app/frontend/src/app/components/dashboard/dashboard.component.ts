import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  users: User[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.users;
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load users';
        this.loading = false;
      }
    });
  }

  deleteUser(userId: string): void {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    this.userService.deleteUser(userId).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'User deleted successfully';
          this.loadUsers(); // Reload the list
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to delete user';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }
}
