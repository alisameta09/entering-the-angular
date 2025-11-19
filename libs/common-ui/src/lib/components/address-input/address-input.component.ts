import {Component, forwardRef, inject, signal} from '@angular/core';
import {ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {TtInputComponent} from '../tt-input/tt-input.component';
import {debounceTime, switchMap, tap} from 'rxjs';
import {DadataService} from '@tt/data-access/profile';
import {AsyncPipe} from '@angular/common';
import {DadataSuggestion} from '@tt/data-access/profile/interfaces/dadata.interfaces';

@Component({
  selector: 'address-input',
  imports: [
    TtInputComponent,
    ReactiveFormsModule,
    AsyncPipe
  ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => AddressInputComponent),
  }],
  templateUrl: './address-input.component.html',
  styleUrl: './address-input.component.css'
})
export class AddressInputComponent implements ControlValueAccessor {
  innerSearchControl = new FormControl();

  addressForm = new FormGroup({
    city: new FormControl(''),
    street: new FormControl(''),
    house: new FormControl('')
  })

  #dadataService = inject(DadataService);

  isDropdownOpened = signal<boolean>(true);

  suggestions$ = this.innerSearchControl.valueChanges
    .pipe(
      debounceTime(500),
      switchMap(val => this.#dadataService.getSuggestion(val)
        .pipe(
          tap(res => this.isDropdownOpened.set(!!res.length))
        )
      )
    )

  onSuggestionPick(suggest: DadataSuggestion) {
    // this.onChange(suggest);
    // this.innerSearchControl.patchValue(suggest, {emitEvent: false});
    this.isDropdownOpened.set(false);

    this.addressForm.patchValue({
      city: suggest.data.city,
      street: suggest.data.street,
      house: suggest.data.house
    })
  }

  onChange(value: any) {
  }

  onTouched() {
  }

  writeValue(suggest: DadataSuggestion): void {
    // this.innerSearchControl.patchValue(suggest.data.city, {emitEvent: false});
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }

}
