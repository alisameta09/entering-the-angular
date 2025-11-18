import {Component, forwardRef, Input, input, signal} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {SvgIconComponent} from '../svg-icon/svg-icon.component';

@Component({
  selector: 'tt-input',
  imports: [
    SvgIconComponent,
    FormsModule
  ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => TtInputComponent)
  }],
  templateUrl: './tt-input.component.html',
  styleUrl: './tt-input.component.css'
})
export class TtInputComponent implements ControlValueAccessor {
  @Input() showSvg = true;
  value: string | null = null;

  disabled = signal<boolean>(false);

  type = input<'text' | 'password'>('text');
  placeholder = input<string>();

  onChange: any
  onTouched: any

  writeValue(value: string | null): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onModelChange(val: string | null): void {
    this.onChange(val);
  }
}
