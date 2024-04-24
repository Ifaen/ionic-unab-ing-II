import { Injectable } from '@angular/core';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Icon, Style } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';

@Injectable({
  providedIn: 'root'
})
export class MarcadoresService {

  constructor() { }

  crearMarcadores(iconos): VectorLayer<VectorSource>[] {
    const capas = [];

    for (const icono of iconos) {
      const iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: icono.src,
          scale: 0.12,
        }),
      });

      const iconFeatures = [];

      for (const coordenada of icono.coordenadas) {
        const iconFeature = new Feature({
          geometry: new Point(fromLonLat(coordenada)),
        });
        iconFeature.setStyle(iconStyle);
        iconFeatures.push(iconFeature);
      }

      const vectorSource = new VectorSource({
        features: iconFeatures,
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      capas.push(vectorLayer);
    }

    return capas;
  }
}
