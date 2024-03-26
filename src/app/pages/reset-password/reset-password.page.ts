import { AuthenticationService } from 'src/app/authentication.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  email: any;

  constructor(
    public route: Router,
    public authService: AuthenticationService,
  ) {}

  resetPassword() {
    this.authService
      .resetPassword(this.email)
      .then(() => {
        console.log('Reset link sent');
        this.route.navigate(['/login']);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
