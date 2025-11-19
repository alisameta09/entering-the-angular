import {Component, forwardRef, inject, signal} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {TtInputComponent} from '../tt-input/tt-input.component';
import {debounceTime, switchMap, tap} from 'rxjs';
import {DadataService} from '@tt/data-access/profile';
import {AsyncPipe} from '@angular/common';

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

  onSuggestionPick(city: string) {
    this.onChange(city);
    this.innerSearchControl.patchValue(city, {emitEvent: false});
    this.isDropdownOpened.set(false);
  }

  onChange(value: any) {
  }

  onTouched() {
  }

  writeValue(city: string | null): void {
    this.innerSearchControl.patchValue(city, {emitEvent: false});
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
