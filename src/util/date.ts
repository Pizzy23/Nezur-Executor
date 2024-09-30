import { Injectable } from '@nestjs/common';
@Injectable()
export class DateManipulator {
  private createDate() {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    return {
      year: year,
      month: month,
      day: day,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }
  saveFile() {
    const date = this.createDate();
    return `${date.year}${date.month}${date.day}${date.hours}${date.minutes}${date.seconds}`;
  }
  YMD() {
    const date = this.createDate();
    return `${date.year}-${date.month}-${date.day}`;
  }
  DMY() {
    const date = this.createDate();
    return { day: date.day, month: date.month, year: date.year };
  }
  YMDHMS() {
    const date = this.createDate();
    return `${date.year}-${date.month}-${date.day} || ${date.hours}:${date.minutes}:${date.seconds}`;
  }
}
