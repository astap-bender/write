import { GeoLocation } from '@/types'

export const geolocationService = {
  async getCurrentPosition(): Promise<GeoLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Геолокация недоступна в этом браузере'))
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: Date.now(),
            accuracy: position.coords.accuracy,
          })
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )
    })
  },

  watchPosition(
    onPosition: (position: GeoLocation) => void,
    onError: (error: GeolocationPositionError) => void,
    options?: PositionOptions
  ): number {
    if (!navigator.geolocation) {
      onError(new GeolocationPositionError())
      return -1
    }

    return navigator.geolocation.watchPosition(
      (position) => {
        onPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: Date.now(),
          accuracy: position.coords.accuracy,
        })
      },
      onError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000,
        ...options,
      }
    )
  },

  clearWatch(watchId: number): void {
    if (watchId >= 0) {
      navigator.geolocation.clearWatch(watchId)
    }
  },
}
