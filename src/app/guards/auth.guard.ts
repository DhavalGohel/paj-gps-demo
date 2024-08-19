import { inject, Injectable } from '@angular/core';
import { CanLoad, GuardResult, MaybeAsync, Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanLoad {
	private authService = inject(AuthenticationService)
	private router = inject(Router)
	constructor() { }
	canLoad(): MaybeAsync<GuardResult> {
		return this.authService.isAuthenticated.pipe(
			filter((val) => val !== null), // Filter out initial Behaviour subject value
			take(1), // Otherwise the Observable doesn't complete!
			map((isAuthenticated) => {
				console.log("isAuthenticated", isAuthenticated)
				if (isAuthenticated) {
					return true;
				} else {
					this.router.navigateByUrl('/login', { replaceUrl: true });
					return false;
				}
			})
		);
	}
}