import {Pipe, PipeTransform} from '@angular/core';
import {DateTime} from 'luxon';

@Pipe({
  name: 'dateTransform',
})
export class DateTransformPipe implements PipeTransform {
  transform(
    value: string | null,
    format: string = 'HH:mm dd.MM.yyyy',
    relative: boolean = false,
    calendar: boolean = false
  ): string {
    if (!value) return '';

    let localizedDate: DateTime;

    if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(value)) {
      localizedDate = DateTime.fromFormat(value, 'yyyy-MM-dd HH:mm:ss', {zone: 'utc'}).setZone('local');
    } else {
      localizedDate = DateTime.fromISO(value, {zone: 'utc'}).setZone('local');
    }

    if (relative) {
      const diffInSeconds = Math.abs(localizedDate.diffNow('seconds').seconds);

      if (diffInSeconds < 60) return 'только что';

      return localizedDate.toRelative() ?? '';
    }

    if (calendar) {
      return localizedDate.toRelativeCalendar() ?? '';
    }

    return localizedDate.toFormat(format);
  }
}
