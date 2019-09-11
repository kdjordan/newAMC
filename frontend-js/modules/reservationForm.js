import axios from 'axios';
import flatpickr from "flatpickr";

export default class ReservationForm {
    constructor() {
        // this.form = document.querySelector('.make-res__form');
        this.resDated = flatpickr('#resCalendar', {
            dateFormat: 'm-d-y',
            mode: "range",
            onClose: (dates, dateStr, ins) => {
                this.addReservation(dates);
            }
        });
        
        
        // this.submitButton = document.querySelector('.btn-reserve');
        // this.events();
    }



    events() {
    //    this.form.addEventListener('submit', (e) => {
    //        e.preventDefault();
    //        this.form.submit();
    //    })
       
    }

    //methods
    // addReservation(dates) {
    //     console.log(dates);
    // }
}
