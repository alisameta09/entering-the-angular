import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, startWith} from 'rxjs';
import {Store} from '@ngrx/store';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {SvgIconComponent} from '@tt/common-ui';
import {profileActions, selectSaveFilteredProfiles} from '@tt/data-access/profile';

@Component({
  selector: 'app-profile-filters',
  imports: [ReactiveFormsModule, SvgIconComponent],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent implements OnInit {
  fb = new FormBuilder();
  store = inject(Store);
  destroyRef = inject(DestroyRef);

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });

  ngOnInit(): void {
    this.searchForm.valueChanges.pipe(
      startWith(this.searchForm.getRawValue()),
      debounceTime(300),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((formValue) => {
      this.store.dispatch(profileActions.saveFilter({filters: formValue}));
      this.store.dispatch(profileActions.filterEvents({filters: formValue}));
    });
  }

  constructor() {
    this.store.select(selectSaveFilteredProfiles)
      .pipe(takeUntilDestroyed())
      .subscribe(filters => {
        if (filters) {
          this.searchForm.patchValue(filters, {emitEvent: false});
        }
      });
  }

}
