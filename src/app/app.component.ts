import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink, IonFooter, IonButton, MenuController } from '@ionic/angular/standalone';
import { AuthenticationService } from './services/authentication.service';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonApp,
    IonSplitPane,
    IonContent,
    IonRouterOutlet,
    SidebarComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent implements OnInit {
  private authService = inject(AuthenticationService)
  private router = inject(Router)
  constructor() { }

  ngOnInit(): void {
    
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigateByUrl('/login', { replaceUrl: true })
    });
  }
}
