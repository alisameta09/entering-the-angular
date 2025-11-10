import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Renderer2
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { debounceTime, fromEvent } from 'rxjs';
import { KeyValuePipe } from '@angular/common';
import { MaskitoDirective } from '@maskito/angular';
import { DestinationName, ReceiverType } from '../../shared/const';
import { dateMaskOptions, phoneMaskOptions, NameValidator } from '../../util';
import {Feature, MockService, Tour} from '../../data';

// function getContactForm() {
//   return new FormGroup({
//     type: new FormControl<ReceiverType>(ReceiverType.Person),
//     inn: new FormControl<number | null>(null),
//     name: new FormControl<string>('', Validators.required, [nameValidator.validate]),
//     lastName: new FormControl<string>(''),
//     phone: new FormControl<number | null>(null, Validators.required),
//     feature: new FormRecord({})
//   })
// }

function getTourForm(initialValue: Tour = {}) {
  return new FormGroup({
    fromCity: new FormControl(initialValue.fromCity ?? ''),
    destination: new FormControl(initialValue.destination ?? ''),
    date: new FormControl(initialValue.date ?? ''),
    duration: new FormControl(initialValue.duration ?? ''),
    tourists: new FormControl(initialValue.tourists ?? ''),
    info: new FormControl(initialValue.info ?? ''),
  });
}

function validateDateRange({
  fromControlName,
  toControlName,
}: {
  fromControlName: string;
  toControlName: string;
}): ValidatorFn {
  return (control: AbstractControl) => {
    const fromControl = control.get(fromControlName);
    const toControl = control.get(toControlName);

    if (!fromControl || !toControl) return null;

    const fromDate = new Date(fromControl.value);
    const toDate = new Date(toControl.value);

    if (fromDate && toDate && toDate < fromDate) {
      toControl.setErrors({
        dateRange: { message: 'Дата конца тура не может быть ранее даты начала!' },
      });
      return { dateRange: { message: 'Дата конца тура не может быть ранее даты начала!' } };
    }

    return null;
  };
}

// function validateStartWith(ForbiddenLetter: string): ValidatorFn {
//   return (control: AbstractControl) => {
//     return control.value.startsWith(ForbiddenLetter)
//       ? {startsWith: {message: `${ForbiddenLetter} - привет!`}}
//       : null
//   }
// }

// const validateStartWith: ValidatorFn = (control: AbstractControl) => {
//   return control.value.startsWith('я')
//     ? {startsWith: 'я яяяяяя'}
//     : null
// }

@Component({
  selector: 'app-forms-experiment',
  imports: [ReactiveFormsModule, MaskitoDirective, RouterLink, KeyValuePipe],
  templateUrl: './forms-experiment.component.html',
  styleUrl: './forms-experiment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormsExperimentComponent implements AfterViewInit {
  private readonly PADDING = 24 * 2;

  r2 = inject(Renderer2);
  hostElement = inject(ElementRef);
  destroyRef = inject(DestroyRef);
  mockService = inject(MockService);
  nameValidator = inject(NameValidator);

  ReceiverType = ReceiverType;
  dateMaskOptions = dateMaskOptions;
  phoneMaskOptions = phoneMaskOptions;
  features: Feature[] = [];
  destinations = Object.values(DestinationName);

  form = new FormGroup({
    tours: new FormArray<FormGroup>([getTourForm()]),
    contact: new FormGroup({
      type: new FormControl<ReceiverType>(ReceiverType.Person),
      inn: new FormControl<number | null>(null),
      name: new FormControl<string>('', {
        validators: [Validators.required],
        asyncValidators: [this.nameValidator.validate.bind(this.nameValidator)],
        updateOn: 'blur',
      }),
      lastName: new FormControl<string>(''),
      phone: new FormControl<number | null>(null, Validators.required),
      feature: new FormRecord({}),
    }),
    dateRange: new FormGroup(
      {
        from: new FormControl<string>(''),
        to: new FormControl<string>(''),
      },
      validateDateRange({ fromControlName: 'from', toControlName: 'to' })
    ),
  });

  constructor() {
    const type = this.form.controls.contact.controls.type;
    const inn = this.form.controls.contact.controls.inn;

    // this.mockService.getTours()
    //   .pipe(takeUntilDestroyed())
    //   .subscribe(tours => {
    //     const toursForm = this.form.controls.tours;
    //
    //     // while (toursForm.controls.length > 0) {
    //     //   toursForm.removeAt(0)
    //     // }
    //
    //     toursForm.clear();
    //
    //     for (const tour of tours) {
    //       toursForm.push(getTourForm(tour))
    //     }
    //
    //     // toursForm.setControl(0, getTourForm(tours[1]));
    //     // console.log(toursForm.at(0));
    //   })

    this.mockService
      .getFeatures()
      .pipe(takeUntilDestroyed())
      .subscribe((features) => {
        this.features = features;

        for (const feature of features) {
          this.form.controls.contact.controls.feature.addControl(
            feature.code,
            new FormControl(feature.value)
          );
        }
      });

    type.valueChanges.pipe(takeUntilDestroyed()).subscribe((val) => {
      inn.clearValidators();

      if (val === ReceiverType.Legal) {
        inn.setValidators([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ]);
      }
    });
  }

  ngAfterViewInit() {
    this.resizePageForm();

    fromEvent(window, 'resize')
      .pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.resizePageForm());
  }

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  resizePageForm() {
    const el = this.hostElement.nativeElement;
    const { top } = el.getBoundingClientRect();
    const height = window.innerHeight - top - this.PADDING;

    this.r2.setStyle(el, 'height', `${height}px`);
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
    this.form.controls.tours.removeAt(index, { emitEvent: false });
  }

  sort = () => 0;
}
