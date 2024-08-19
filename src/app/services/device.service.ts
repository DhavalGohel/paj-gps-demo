import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import { BASE_URL } from 'src/constants/app.constant';
import { IDevice, IDeviceLastPointResponse, IDeviceResponse } from '../interface/device.interface';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private http = inject(HttpClient);
  public devices: Subject<IDevice[]> = new Subject<IDevice[]>();
  constructor() { }


  getDevices(): Observable<IDevice[]> {
		return this.http.get<IDeviceResponse>(`${BASE_URL}/v1/device`)
      .pipe(
        map((data: IDeviceResponse) => data?.success),
        tap((devices: IDevice[]) => {
          this.devices.next(devices ?? []);
        })
      );
	}

  getLastPoints(deviceId: string): Observable<IDeviceLastPointResponse> {
		return this.http.get<IDeviceLastPointResponse>(`${BASE_URL}/v1/trackerdata/${deviceId}/last_points?lastPoints=50`);
  }
}
