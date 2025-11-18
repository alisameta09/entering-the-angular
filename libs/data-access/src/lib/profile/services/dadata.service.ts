import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DADATA_TOKEN} from '@tt/shared';
import {map} from 'rxjs';
import {DadataSuggestion} from '@tt/data-access/profile/interfaces/dadata.interfaces';

@Injectable({
  providedIn: 'root'
})
export class DadataService {
  #apiUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';

  #http = inject(HttpClient);

  getSuggestion(query: string) {
    return this.#http.post<{suggestions: DadataSuggestion}>(this.#apiUrl, {query}, {
      headers: {
        Authorization: `Token ${DADATA_TOKEN}`
      }
    }).pipe(
      map(res => res.suggestions)
    )
  }
}
