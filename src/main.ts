import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, Router } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { TOKEN_KEY } from './constants/app.constant';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthenticationService } from './app/services/authentication.service';

const authInterceptorServiceInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService)
  const router = inject(Router)
  const token = localStorage.getItem(`CapacitorStorage.${TOKEN_KEY}`);
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) { // Unauthorized
        authService.logout(); // Handle logout
        router.navigateByUrl('/login', { replaceUrl: true }); // Redirect to login page
      }
      return throwError(error);
    })
  );
}
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptorServiceInterceptor])),
  ],
});
