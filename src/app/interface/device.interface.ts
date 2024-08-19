export interface IDevice {
    name: string
    id: string
}

export interface IDeviceResponse {
    success: IDevice[]
    number_of_records: number
}

export interface IDeviceLastPoint {
    id: string
    lat: number
    lng: number
}
export interface IDeviceLastPointResponse {
    distance: number
    number_of_correct_markers: number
    faulty_markers: any
    number_of_faulty_markers: number
    success: IDeviceLastPoint[],
}