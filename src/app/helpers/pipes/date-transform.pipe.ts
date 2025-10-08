import {Pipe, PipeTransform} from '@angular/core';
import {DateTime} from 'luxon';

@Pipe({
  name: 'dateTransform'
})
export class DateTransformPipe implements PipeTransform {

  transform(
    value: string | null,
    format: string = 'HH:mm dd.MM.yyyy',
    relative: boolean = false,
    calendar: boolean = false
  ): string {

    if (!value) return '';

    const localizedDate = DateTime
      .fromISO(value, {zone: 'utc'})
      .setLocale('ru')
      .toLocal();

    if (relative) {
      const diffInSeconds = Math.abs(localizedDate
        .diffNow('seconds')
        .seconds
      );

      if (diffInSeconds < 60) return 'только что';

      return localizedDate.toRelative() ?? '';
    }

    if (calendar) {
      return localizedDate.toRelativeCalendar() ?? '';
    }

    return localizedDate.toFormat(format);
  }

}
