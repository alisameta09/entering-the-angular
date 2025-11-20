import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject, signal} from '@angular/core';
import {ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {TtInputComponent} from '../tt-input/tt-input.component';
import {debounceTime, switchMap, tap} from 'rxjs';
import {DadataService, DadataSuggestion} from '@tt/data-access/profile';
import {AsyncPipe} from '@angular/common';
import {SvgIconComponent} from '@tt/common-ui';

@Component({
  selector: 'address-input',
  imports: [
    TtInputComponent,
    ReactiveFormsModule,
    AsyncPipe,
    SvgIconComponent
  ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => AddressInputComponent),
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './address-input.component.html',
  styleUrl: './address-input.component.css'
})
export class AddressInputComponent implements ControlValueAccessor {
  innerSearchControl = new FormControl();

  addressForm = new FormGroup({
    city: new FormControl(),
    street: new FormControl(),
    house: new FormControl()
  })

  #dadataService = inject(DadataService);
  cdr = inject(ChangeDetectorRef);

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
    const value = [
      suggest.data.city_type + '. ' + suggest.data.city,
      suggest.data.street_type + '. ' + suggest.data.street,
      suggest.data.house_type + '. ' + suggest.data.house
    ]
      .filter(Boolean)
      .join(', ')

    this.onChange(value);

    this.addressForm.patchValue({
      city: suggest.data.city,
      street: suggest.data.street,
      house: suggest.data.house
    }, {emitEvent: false})

    this.innerSearchControl.patchValue(value, {emitEvent: false});
    this.isDropdownOpened.set(false);
    this.cdr.detectChanges();
  }

  onChange(_: any) {}

  onTouched() {}

  writeValue(address: string | null): void {
    if (!address) return;

    this.innerSearchControl.patchValue(address, {emitEvent: false});

    const [city, street, house] = address.split(', ')

    this.addressForm.patchValue({city, street, house}, {emitEvent: false});
    this.cdr.detectChanges();
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
