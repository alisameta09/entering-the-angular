import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

@Component({
  selector: 'stack-input',
  imports: [
    SvgIconComponent
  ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => StackInputComponent)
  }],
  templateUrl: './stack-input.component.ts.html',
  styleUrl: './stack-input.component.ts.css'
})
export class StackInputComponent implements ControlValueAccessor {
  writeValue(): void {

  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(): void {

  }

  onChange() {
  }

  onTouched() {
  }

}
