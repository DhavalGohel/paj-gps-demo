import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink, IonFooter, IonButton, MenuController } from '@ionic/angular/standalone';
import { AuthenticationService } from '../services/authentication.service';
import { DeviceService } from '../services/device.service';
import { IDevice } from '../interface/device.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: true,
  styleUrls: ['./sidebar.component.scss'],
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterLink,
    IonRouterOutlet,
    IonFooter,
    IonButton],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SidebarComponent implements OnInit {
  private authService: AuthenticationService = inject(AuthenticationService)
  private deviceService = inject(DeviceService)
  private router = inject(Router)
  private menu = inject(MenuController);
  menuItems: Array<{ title: string, url: string }> = [];

  constructor() {}

  ngOnInit() {
    this.authService.isAuthenticated.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.loadMenuItems();
      }
    });
  }

  private loadMenuItems() {
    this.deviceService.getDevices().subscribe((data: IDevice[]) => {
      this.menuItems = data.map((device: IDevice) => {
        return { title: device?.name, url: '/home/' + device?.id };
      })
    })

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.menu.close()
      }
    });
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigateByUrl('/login', { replaceUrl: true })
    });
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated.value;
  }

}
