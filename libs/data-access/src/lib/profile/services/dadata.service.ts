import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DADATA_TOKEN} from '@tt/shared';
import {map} from 'rxjs';
import { DadataSuggestion } from '../index';

@Injectable({
  providedIn: 'root'
})
export class DadataService {
  #apiUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';

  #http = inject(HttpClient);

  getSuggestion(query: string) {
    return this.#http.post<{ suggestions: DadataSuggestion[] }>(
      this.#apiUrl,
      {query},
      {headers: {Authorization: `Token ${DADATA_TOKEN}`}}
    )
      .pipe(
        map(res => {
            const uniqueAddress = new Set();

            return res.suggestions.filter(suggestion => {
              const key = `${suggestion.data.city} | ${suggestion.data.street} | ${suggestion.data.house}`;

              if (uniqueAddress.has(key)) return false;
              uniqueAddress.add(key);
              return true;
            })
          }
        )
      )
  }
}
