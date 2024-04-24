import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { MarcadoresService } from 'src/app/services/marcadores.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements OnInit {
  map: Map;

  constructor(private marcadorService: MarcadoresService) {}

  ngOnInit(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([-71.6273, -33.0472]),
        zoom: 12,
      }),
    });

    const iconos = [
      {
        src: 'assets/icon/icon-modulo-1.png',
        coordenadas: [
          [-71.6273, -33.0472],
          [-71.53645165428894, -33.00219912431951],
        ],
      },
      {
        src: 'assets/icon/icon-modulo-2.png',
        coordenadas: [
          [-71.54545988356172, -33.008407220497965],
          [-71.55370921144102, -33.01236829444044],
        ],
      },
      {
        src: 'assets/icon/icon-modulo-3.png',
        coordenadas: [
          [-71.55489708521904, -33.01744203530627],
        ],
      },
      {
        src: 'assets/icon/icon-modulo-4.png',
        coordenadas: [
          [-71.52048886766794, -33.01980351063344],
        ],
      },
    ];

    const capas = this.marcadorService.crearMarcadores(iconos);
    for (const capa of capas) {
      this.map.addLayer(capa);
    }
  }
}
