import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Renderer2,
  ViewChild
} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {debounceTime, firstValueFrom, fromEvent} from 'rxjs';
import {Router, RouterLink} from '@angular/router';
import {StackInputComponent, SvgIconComponent} from '@tt/common-ui';
import {ProfileHeaderComponent} from '../../ui/profile-header/profile-header.component';
import {AvatarUploadComponent} from '../../ui/avatar-upload/avatar-upload.component';
import {ProfileService} from '@tt/data-access/profile';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-settings-page',
  imports: [
    ProfileHeaderComponent,
    ReactiveFormsModule,
    SvgIconComponent,
    RouterLink,
    AvatarUploadComponent,
    StackInputComponent,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent implements AfterViewInit {
  private readonly PADDING = 24;

  fb = inject(FormBuilder);
  profileService = inject(ProfileService);
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);
  destroyRef = inject(DestroyRef);
  router = inject(Router);

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    username: [{value: '', disabled: true}, [Validators.required]],
    description: [''],
    stack: [''],
  });

  constructor() {
    effect(() => {
      // @ts-ignore
      this.form.patchValue({
        ...this.profileService.me()
      });
    });
  }

  ngAfterViewInit() {
    this.resizeSettingPage();

    fromEvent(window, 'resize')
      .pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.resizeSettingPage());
  }

  onSave(event: Event) {
    event.preventDefault();

    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    if (this.avatarUploader.avatar) {
      firstValueFrom(this.profileService.uploadAvatar(this.avatarUploader.avatar));
    }

    firstValueFrom(
      // @ts-ignore
      this.profileService.patchProfile({
        ...this.form.value
      })
    );

    this.router.navigate(['/profile/me']);
  }

  resizeSettingPage() {
    const {top} = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - this.PADDING;

    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }
}
