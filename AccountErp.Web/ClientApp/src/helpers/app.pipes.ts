import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'defaultIfEmpty' })
export class DefaultIfEmpty implements PipeTransform {
    transform(value: string) {
        return value ? value : 'N/A';
    }
}
