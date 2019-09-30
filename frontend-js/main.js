import ReservationForm from './modules/reservationForm';
import AdminForm from './modules/adminForms';
import Admin from './modules/admin';
import AdminUserLinks from './modules/adminUserLinks';




// if (document.querySelector('#sidenav')) {
//     new Admin();
// }


// if (document.querySelector('.sidenav__dropdown--users')) {
//     new AdminUserLinks();
// }

if (document.querySelector('.admin-logo-box')) {
    new AdminForm();
}

//fix later
new ReservationForm();

