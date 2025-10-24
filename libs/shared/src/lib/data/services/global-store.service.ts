import {Injectable, signal} from '@angular/core';
import {Profile} from '../../../../../data-access/src/lib/profile';

@Injectable({
  providedIn: 'root'
})
export class GlobalStoreService {
  me = signal<Profile | null>(null);
}
