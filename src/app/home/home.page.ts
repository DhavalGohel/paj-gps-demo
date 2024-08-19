import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, LoadingController } from '@ionic/angular/standalone';
import { DeviceService } from '../services/device.service';
import { ControlComponent, MapComponent, MarkerComponent } from '@maplibre/ngx-maplibre-gl';
import { IDeviceLastPoint } from '../interface/device.interface';
import { CommonModule } from '@angular/common';
import * as maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, MapComponent, MarkerComponent, ControlComponent, CommonModule],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  deviceId!: string;
  private activatedRoute = inject(ActivatedRoute);
  private deviceService = inject(DeviceService);
  private loadingController = inject(LoadingController);

  public lastPoints: IDeviceLastPoint[] = [];
  public map: maplibregl.Map;
  public zoom = 12;
  public loading: boolean = true;
  constructor() { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((param) => {
      this.deviceId = param['id'] as string;
      if (!this.deviceId) {
        this.deviceService.devices.subscribe((devices) => {
          this.deviceId = devices?.[0]?.id;
          this.getDeviceById(this.deviceId);
        });
        return;
      }
      this.getDeviceById(this.deviceId);
    });
  }

  async getDeviceById(deviceId: string) {
    const loading = await this.loadingController.create();
    await loading.present();
    this.deviceService.getLastPoints(deviceId).subscribe({
      next: (res) => {
        this.lastPoints = res?.success;
      },
      complete: async () => {
        await loading.dismiss();
        this.loading = false;
      }
    })
  }

  onLoadMap(event: maplibregl.Map) {
    this.map = event;
    this.lastPoints.forEach((marker) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = 'url(/assets/marker.png)';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.backgroundSize = '100%';
      new maplibregl.Marker(el)
        .setLngLat([marker.lng, marker.lat])
        .addTo(this.map);
    })

    if (this.lastPoints?.length) {
      // Add polyline
      const coordinates = this.lastPoints.map(point => [point.lng, point.lat]);
      this.map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {
            name: ''
          },
          geometry: {
            type: 'LineString',
            coordinates
          }
        }
      });

      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ff0000',
          'line-width': 4
        }
      });

      const center = this.calculateCenter(this.lastPoints);
      this.map.setCenter(center);
    }

    this.addControls()
  }

  addControls() {
    // Add zoom controls
    this.map.addControl(new maplibregl.NavigationControl());

    // Add scale control
    this.map.addControl(new maplibregl.ScaleControl(), 'bottom-right');

    // Add full-screen control
    this.map.addControl(new maplibregl.FullscreenControl());

    // Add geolocate control
    const geolocate = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });
    this.map.addControl(geolocate);

    setTimeout(() => {
      // Request the user's current location immediately after adding the control
      geolocate.trigger();
    }, 1000)
  }

  calculateCenter(markers: { lng: number, lat: number }[]): [number, number] {
    const lngs = markers.map(marker => marker.lng);
    const lats = markers.map(marker => marker.lat);
    const lngCenter = (Math.max(...lngs) + Math.min(...lngs)) / 2;
    const latCenter = (Math.max(...lats) + Math.min(...lats)) / 2;
    return [lngCenter, latCenter];
  }
}
