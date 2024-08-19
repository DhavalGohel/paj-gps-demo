import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable } from 'rxjs';

import { Storage } from '@capacitor/storage';
import { BASE_URL, TOKEN_KEY } from 'src/constants/app.constant';

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService {
	// Init with null to filter out the first value in a guard!
	isAuthenticated: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
	token = '';
	private http = inject(HttpClient);

	constructor() {
		this.loadToken();
	}

	async loadToken() {
		const token = await Storage.get({ key: TOKEN_KEY });
		if (token && token.value) {
			console.log('set token: ', token.value);
			this.token = token.value;
			this.isAuthenticated.next(true);
		} else {
			this.isAuthenticated.next(false);
		}
	}

	login({ email, password }: { email: string, password: string }): Observable<any> {
		return this.http.post(`${BASE_URL}/v1/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {}).pipe(
			map((data: any) => data?.success?.token),
			switchMap((token) => {
				return from(Storage.set({ key: TOKEN_KEY, value: token }));
			}),
			tap((_) => {
				this.isAuthenticated.next(true);
			})
		);
	}

	logout(): Promise<void> {
		this.isAuthenticated.next(false);
		this.token = '';
		return Storage.remove({ key: TOKEN_KEY });
	}
}