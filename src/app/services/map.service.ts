import { EventEmitter, Injectable } from '@angular/core';
import Map from 'ol/Map';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map: Map;
  mapReady: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }
}
