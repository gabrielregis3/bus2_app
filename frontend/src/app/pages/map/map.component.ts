import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { firstValueFrom, Observable } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  imports: [CommonModule, FormsModule]
})

export class MapComponent implements OnInit {

  private http = inject(HttpClient);

  selectedLine: number | null = null
  selectedTrip: number | null = null
  stopsIcons: any[] = [];

  map: any;
  lines: any[] = [];
  trips: any[] = [];
  stops: any[] = [];

  tripPathPolyline: any = null;
  apiLoaded: boolean = false;

  public drawTripPath(coords: any[]): void {
    if (!this.map || !coords.length) return;
  
    if (this.tripPathPolyline) {
      this.tripPathPolyline.setMap(null);
      this.tripPathPolyline = null;
    }

    if (!coords.every(coord => !isNaN(parseFloat(coord.latitude)) && !isNaN(parseFloat(coord.longitude)))) {
      console.warn('Coordenadas inválidas detectadas:', coords);
      return;
    }
  
    const path = coords.map(coord => ({
      lat: parseFloat(coord.latitude),
      lng: parseFloat(coord.longitude)
    }));
  
    this.tripPathPolyline = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });
  
    this.tripPathPolyline.setMap(this.map);
  }

  public loadLines() {
    this.http.get<any[]>('http://localhost:3000/lines').subscribe({
      next: (data) => {
        this.lines = data;
      },
      error: (err) => {
        console.error('Erro ao buscar linhas:', err);
      }
    });
  }

  public loadTrips() {
    this.http.get<any[]>('http://localhost:3000/trips').subscribe({
      next: (data) => this.trips = data,
      error: (err) => console.error('Erro ao buscar viagens:', err)
    });
  }

  public loadStops(): void {
    this.http.get<any[]>('http://localhost:3000/stops').subscribe({
      next: (stops) => {
        this.stops = stops;
  
        if (this.apiLoaded && this.stops.length > 0) {
          this.initMap();
          this.showStopsOnMap();
        }
      },
      error: (err) => console.error('Erro ao carregar paradas:', err)
    });
  }
  
  public ngOnInit(): void {
    this.loadGoogleMaps();
    this.loadLines();
    this.loadTrips();
    this.loadStops();
  }

  public showStopsOnMap(): void {
    if (!this.map || !this.stops) return;
  
    try {
      this.stopsIcons.forEach(marker => marker.setMap(null));
      this.stopsIcons = [];
  
      this.stops.forEach(stop => {
        const lat = parseFloat(stop.latitude);
        const lng = parseFloat(stop.longitude);
  
        if (!isNaN(lat) && !isNaN(lng)) {
          const marker = new google.maps.Marker({
            position: { lat, lng },
            map: this.map,
            title: stop.stop_name,
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new google.maps.Size(30, 30)
            }
          });

          marker.addListener('click', () => {
            this.getTripsByStop(stop.stop_id).then(trips => {
              const content = document.createElement('div');
              const title = document.createElement('div');

              title.innerHTML = `<strong>${stop.stop_name}</strong><br><br>Viagens:`;
              content.appendChild(title);

              trips.forEach(trip => {
                const btn = document.createElement('button');
                btn.textContent = `${trip.name} (${trip.line.name})`;
                btn.className = 'popup-btn';
                btn.onclick = () => this.onTripFromPopupClick(trip);
                
                content.appendChild(btn);
              });

              const popUpTrips = new google.maps.InfoWindow({ content });
              popUpTrips.open(this.map, marker);
            });
          });

          this.stopsIcons.push(marker);
        }
      });
    } catch (error) {
      console.error('Erro ao exibir marcadores no mapa:', error);
    }
  }

  public onLineSelected(): void {
    if (this.selectedLine) {
      this.getTripsByLine(this.selectedLine).subscribe({
        next: (data) => {
          this.trips = data;
          this.selectedTrip = null;
        },
        error: (err) => console.error('Erro ao buscar viagens:', err)
      });
    } else {
      this.trips = [];
      this.selectedTrip = null;
    }
  }

  private loadGoogleMaps(): void {
    if (!(window as any).google || !(window as any).google.maps) {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCw1oITXD-xg7ctTHIubl9OGI2XHFSQcvM&libraries=places';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.apiLoaded = true;
        if (this.stops.length > 0) {
          this.initMap();
          this.showStopsOnMap();
        }
      };
  
      document.head.appendChild(script);
    } else {
      this.apiLoaded = true;
      this.initMap();
      this.showStopsOnMap();
    }
  }

  public onTripSelected(): void {

    if (this.selectedTrip) {
      this.clearMap();
  
      this.getStopsByTrip(this.selectedTrip).subscribe({
        next: (stops) => {
          this.stops = stops;
          this.showStopsOnMap(); 
        },
        error: (err) => console.error('Erro ao buscar paradas da viagem:', err)
      });
  
      this.getCoordinatesByTrip(this.selectedTrip).subscribe({
        next: (coords) => {
          this.drawTripPath(coords);
        },
        error: (err) => console.error('Erro ao buscar coordenadas da viagem:', err)
      });
    }
  }

  public initMap(): void {
    const mapElement = document.getElementById('map');

    if (!mapElement) {
      console.error("Elemento #map não encontrado!");
      return;
    }

    try {
      const map = new google.maps.Map(mapElement as HTMLElement, {
        center: {
          lat: parseFloat(this.stops[0].latitude),
          lng: parseFloat(this.stops[0].longitude)
        },
        zoom: 15,
        minZoom: 12,
        maxZoom: 25,
        restriction: {
          latLngBounds: {
            north: -26.85,
            south: -27.00,
            east: -48.98,
            west: -49.15
          },
          strictBounds: true
        }
      });

      this.map = map;
    } catch (error) {
      console.error('Erro ao inicializar o mapa:', error);
    }
  }

  public clearSelectedLine() {
    this.selectedLine = null;
    this.selectedTrip = null;
    this.loadTrips();
  }

  public clearMap(): void {
    this.stopsIcons.forEach(marker => marker.setMap(null));
    this.stopsIcons = [];
  
    if (this.tripPathPolyline) {
      this.tripPathPolyline.setMap(null);
      this.tripPathPolyline = null;
    }
  }

  public resetMap(): void {
    this.clearMap();
    this.selectedLine = null;
    this.selectedTrip = null;
  
    this.loadTrips()
    this.loadStops(); 
  }

  public getTripsByLine(lineId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/trips/by-line?line_id=${lineId}`);
  }
  
  public getStopsByTrip(tripId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/stops/by-trip?trip_id=${tripId}`);
  }
  
  public getCoordinatesByTrip(tripId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/stops/coordinates/by-trip?trip_id=${tripId}`);
  }

  async loadTripAndUpdateUI(tripId: number) {
    try {
      const stops = await firstValueFrom(this.getStopsByTrip(tripId));
      const coords = await firstValueFrom(this.getCoordinatesByTrip(tripId));
      const trip = this.trips.find(t => t.id === tripId);
      const lineId = trip?.line_id || null;
  
      this.selectedLine = lineId;
      this.selectedTrip = tripId;
  
      this.clearMap();
      this.stops = stops;
      this.showStopsOnMap();
      this.drawTripPath(coords);
    } catch (error) {
      console.error('Erro ao carregar dados da viagem:', error);
    }
  }

  public onTripFromPopupClick(trip: any): void {

    this.clearMap();
    this.selectedLine = trip.line_id;

    this.getTripsByLine(trip.line_id).subscribe({
      next: (trips) => {
        this.trips = trips;

        this.selectedTrip = null;
        setTimeout(() => {
          this.selectedTrip = trip.id;
        });
  
        this.getStopsByTrip(trip.id).subscribe({
          next: (stops) => {
            this.stops = stops;
            this.showStopsOnMap();
          },
          error: (err) => console.error('Erro ao buscar paradas da viagem:', err),
        });
  
        this.getCoordinatesByTrip(trip.id).subscribe({
          next: (coords) => this.drawTripPath(coords),
          error: (err) => console.error('Erro ao buscar coordenadas da viagem:', err),
        });
      },
      error: (err) => console.error('Erro ao buscar viagens da linha:', err)
    });
  }
  
  public getTripsByStop(stopId: number): Promise<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/trips/by-stop-id?stop_id=${stopId}`)
      .toPromise()
      .then(data => data ?? [])
      .catch(error => {
        console.error('Erro ao buscar viagens da parada:', error);
        return [];
      });
    }
}
