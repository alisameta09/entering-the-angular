import {Injectable} from '@angular/core';
import {Tour, Feature} from './mock.interfaces';
import {Observable, of} from 'rxjs';
import {DestinationName} from './const';

@Injectable({
  providedIn: 'root'
})
export class MockService {

  getTours(): Observable<Tour[]> {
    return of([
      {
        fromCity: 'Москва',
        destination: DestinationName.EGYPT,
        date: '',
        duration: '9-13',
        tourists: '2 взр',
        info: 'отель 4-5*, питание: HB/FB/AI'
      },
      {
        fromCity: 'Москва',
        destination: DestinationName.TURKEY,
        date: '',
        duration: '6',
        tourists: '2 взр',
        info: 'отель 5*, питание: Все включено'
      }
    ]);
  }

  getFeatures(): Observable<Feature[]> {
    return of([
      {
        code: 'fiveStarHotel',
        label: 'Отель 5*',
        value: true
      },
      {
        code: 'fourStarHotel',
        label: 'Отель 4*',
        value: false
      },
      {
        code: 'threeStarHotel',
        label: 'Отель 3*',
        value: false
      }
    ]);
  }
}
