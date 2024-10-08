import { inject, Injectable } from '@angular/core';
import { CanActivate, GuardResult, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable({
	providedIn: 'root'
})
export class AutoLoginGuard implements CanActivate {
	private authService = inject(AuthenticationService)
	private router = inject(Router)
	constructor() {}
	canActivate(): Observable<GuardResult> {
		return this.authService.isAuthenticated.pipe(
			filter((val) => val !== null), // Filter out initial Behaviour subject value
			take(1), // Otherwise the Observable doesn't complete!
			map((isAuthenticated): any => {
				console.log('Found previous token, automatic login', isAuthenticated);
				if (isAuthenticated) {
					// Directly open inside area
					this.router.navigateByUrl('/home', { replaceUrl: true });
        		} else {
					// Simply allow access to the login
					return true;
				}
			})
		);
	}
}