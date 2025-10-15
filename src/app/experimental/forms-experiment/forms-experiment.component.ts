import {Component, inject, Renderer2} from '@angular/core';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DestinationName, ReceiverType} from '../const';
import {MaskitoDirective} from '@maskito/angular';
import {dateMaskOptions, phoneMaskOptions} from '../masks';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';

function getContactForm() {
  return new FormGroup({
    type: new FormControl<ReceiverType>(ReceiverType.PERSON),
    inn: new FormControl<number | null>(null),
    name: new FormControl<string>('', Validators.required),
    lastName: new FormControl<string>(''),
    phone: new FormControl<number | null>(null, Validators.required)
  })
}

function getTourForm() {
  return new FormGroup({
    fromCity: new FormControl(''),
    destination: new FormControl(DestinationName.TURKEY),
    date: new FormControl(''),
    duration: new FormControl(''),
    tourists: new FormControl(''),
    info: new FormControl('')
  })
}

@Component({
  selector: 'app-forms-experiment',
  imports: [
    ReactiveFormsModule,
    MaskitoDirective,
    RouterLink
  ],
  templateUrl: './forms-experiment.component.html',
  styleUrl: './forms-experiment.component.scss'
})
export class FormsExperimentComponent {
  r2 = inject(Renderer2);

  DestinationName = DestinationName;
  ReceiverType = ReceiverType;
  dateMaskOptions = dateMaskOptions;
  phoneMaskOptions = phoneMaskOptions;

  form = new FormGroup({
    tours: new FormArray<FormGroup>([
      getTourForm()
    ]),
    contact: getContactForm()
  });

  constructor() {
    const type = this.form.controls.contact.controls.type;
    const inn = this.form.controls.contact.controls.inn;

    type.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(val => {
        inn.clearValidators();

        if (val === ReceiverType.LEGAL) {
          inn.setValidators(
            [Validators.required, Validators.minLength(10), Validators.maxLength(10)]
          );
        }
      })
  }

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onSubmit(event: SubmitEvent) {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    console.log(this.form.getRawValue());
  }

  addTour() {
    this.form.controls.tours.push(getTourForm());
  }

  deleteTour(index: number) {
    this.form.controls.tours.removeAt(index, {emitEvent: false});
  }
}
