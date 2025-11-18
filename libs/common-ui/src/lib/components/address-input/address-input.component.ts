import {Component, forwardRef, inject} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {TtInputComponent} from '../tt-input/tt-input.component';
import {debounceTime, switchMap} from 'rxjs';
import {DadataService} from '@tt/data-access/profile';
import {AsyncPipe, JsonPipe} from '@angular/common';

@Component({
  selector: 'address-input',
  imports: [
    TtInputComponent,
    ReactiveFormsModule,
    AsyncPipe,
    JsonPipe
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

  suggestions$ = this.innerSearchControl.valueChanges
    .pipe(
      debounceTime(500),
      switchMap(val => this.#dadataService.getSuggestion(val))
    )

  onChange(value: any) {
  }

  onTouched() {
  }

  writeValue(obj: any): void {
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
