import {AfterViewInit, Component, DestroyRef, ElementRef, inject, Renderer2} from '@angular/core';
import {FormArray, FormControl, FormGroup, FormRecord, ReactiveFormsModule, Validators} from '@angular/forms';
import {DestinationName, ReceiverType} from '../const';
import {MaskitoDirective} from '@maskito/angular';
import {dateMaskOptions, phoneMaskOptions} from '../masks';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {debounceTime, fromEvent} from 'rxjs';
import {MockService} from '../mock.service';
import {Feature, Tour} from '../mock.interfaces';
import {KeyValuePipe} from '@angular/common';

function getContactForm() {
  return new FormGroup({
    type: new FormControl<ReceiverType>(ReceiverType.PERSON),
    inn: new FormControl<number | null>(null),
    name: new FormControl<string>('', Validators.required),
    lastName: new FormControl<string>(''),
    phone: new FormControl<number | null>(null, Validators.required),
    feature: new FormRecord({})
  })
}

function getTourForm(initialValue: Tour = {}) {
  return new FormGroup({
    fromCity: new FormControl(initialValue.fromCity ?? ''),
    destination: new FormControl(initialValue.destination ?? DestinationName.TURKEY),
    date: new FormControl(initialValue.date ?? ''),
    duration: new FormControl(initialValue.duration ?? ''),
    tourists: new FormControl(initialValue.tourists ?? ''),
    info: new FormControl(initialValue.info ?? '')
  })
}

@Component({
  selector: 'app-forms-experiment',
  imports: [
    ReactiveFormsModule,
    MaskitoDirective,
    RouterLink,
    KeyValuePipe
  ],
  templateUrl: './forms-experiment.component.html',
  styleUrl: './forms-experiment.component.scss'
})
export class FormsExperimentComponent implements AfterViewInit {
  private readonly PADDING = 24 * 2;

  r2 = inject(Renderer2);
  hostElement = inject(ElementRef);
  destroyRef = inject(DestroyRef);
  mockService = inject(MockService);

  DestinationName = DestinationName;
  ReceiverType = ReceiverType;
  dateMaskOptions = dateMaskOptions;
  phoneMaskOptions = phoneMaskOptions;
  features: Feature[] = [];

  form = new FormGroup({
    tours: new FormArray<FormGroup>([
      getTourForm()
    ]),
    contact: getContactForm()
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

    this.mockService.getFeatures()
      .pipe(takeUntilDestroyed())
      .subscribe(features => {
        this.features = features;

        for (const feature of features) {
          this.form.controls.contact.controls.feature.addControl(
            feature.code,
            new FormControl(feature.value)
          )
        }
      })

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

  ngAfterViewInit() {
    this.resizePageForm();

    fromEvent(window, 'resize')
      .pipe(
        debounceTime(100),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.resizePageForm());
  }

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  resizePageForm() {
    const el = this.hostElement.nativeElement;
    const {top} = el.getBoundingClientRect();
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
    this.form.controls.tours.removeAt(index, {emitEvent: false});
  }

  sort = () => 0
}
