import ReservationForm from './modules/reservationForm';
import AdminUserEditForm from './modules/adminUserEditForm';
import Admin from './modules/admin';




if (document.querySelector('#adminUserEdit-form')) {
    new AdminUserEditForm();
}

if (document.querySelector('#sidenav')) {
    new Admin();
}



//fix later
new ReservationForm();









