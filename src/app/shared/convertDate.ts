import { Pipe , PipeTransform } from "@angular/core";

@Pipe({
    name : 'convertDate',
})
export class ConvertDatePipe implements PipeTransform{
    transform(value: string) : string {
        let date =  new Date(parseInt(value)).toDateString().split(" ");
        date.shift();
        date[1] = date[1] + ","
        return date.join(' ');
    }
}