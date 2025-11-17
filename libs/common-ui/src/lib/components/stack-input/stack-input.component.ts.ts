import {Component, forwardRef, HostListener} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {SvgIconComponent} from '../svg-icon/svg-icon.component';
import {BehaviorSubject} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'stack-input',
  imports: [
    SvgIconComponent,
    AsyncPipe,
    FormsModule
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
  innerInput = '';

  value$ = new BehaviorSubject<string[]>([]);

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.innerInput) return;

    this.value$.next([
      ...this.value$.value,
      this.innerInput
    ])

    this.innerInput = '';
  }

  writeValue(stack: string[] | null): void {

    if (!stack) {
      this.value$.next([]);
      return;
    }

    this.value$.next(stack);
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

  onTagDelete(index: number) {
    const tags = this.value$.value;
    tags.splice(index, 1);
    this.value$.next(tags);
  }
}
