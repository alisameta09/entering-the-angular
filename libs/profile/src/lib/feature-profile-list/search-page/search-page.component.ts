import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Renderer2
} from '@angular/core';
import {ProfileCardComponent} from '../../ui/profile-card/profile-card.component';
import {ProfileFiltersComponent} from '../profile-filters/profile-filters.component';
import {selectFilteredProfiles} from '@tt/data-access/profile';
import {Store} from '@ngrx/store';
import {debounceTime, fromEvent} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-page',
  imports: [ProfileCardComponent, ProfileFiltersComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent implements AfterViewInit {
  PADDING = 20 * 2

  store = inject(Store);
  r2 = inject(Renderer2);
  destroyRef = inject(DestroyRef);
  hostElement = inject(ElementRef)

  profiles = this.store.selectSignal(selectFilteredProfiles);

  ngAfterViewInit() {
    this.resizeSearchPage();

    fromEvent(window, 'resize')
      .pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.resizeSearchPage());
  }

  resizeSearchPage() {
    const el = this.hostElement.nativeElement;
    const {top} = el.getBoundingClientRect();
    const height = window.innerHeight - top - this.PADDING;

    this.r2.setStyle(el, 'height', `${height}px`);
  }
}
