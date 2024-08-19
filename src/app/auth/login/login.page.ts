import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, AlertController, LoadingController, IonInput } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
	standalone: true,
	imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonInput],
	schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginPage implements OnInit {

	public credentials!: FormGroup;
	private authService = inject(AuthenticationService);
	private fb = inject(FormBuilder);
	private alertController = inject(AlertController);
	private router = inject(Router);
	private loadingController = inject(LoadingController);

	constructor() {}

	ngOnInit() {
		this.credentials = this.fb.group({
			email: ['testkunde@paj-gps.de', [Validators.required, Validators.email]],
			password: ['app123#.', [Validators.required, Validators.minLength(6)]]
		});
	}


	async login() {
		const loading = await this.loadingController.create();
		await loading.present();
		this.authService.login(this.credentials.value).subscribe(
			async (res) => {
				await loading.dismiss();
				this.router.navigateByUrl('/home', { replaceUrl: true });
			},
			async (res) => {
				await loading.dismiss();
				const alert = await this.alertController.create({
					header: 'Login failed',
					message: res.error.error.passwordError,
					buttons: ['OK']
				});
				await alert.present();
			}
		);
	}

	// Easy access for form fields
	get email() {
		return this.credentials.get('email');
	}

	get password() {
		return this.credentials.get('password');
	}

}