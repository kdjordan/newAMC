import ReservationForm from './modules/reservationForm';
import AdminUserEditForm from './modules/adminUserEditForm';
import Admin from './modules/admin';
import AdminUserLinks from './modules/adminUserLinks';




if (document.querySelector('#sidenav')) {
    new Admin();
}

if (document.querySelector('.sidenav__dropdown--users')) {
    new AdminUserLinks();
}

if (document.querySelector('#adminUserEdit-form')) {
    new AdminUserEditForm();
}


//fix later
new ReservationForm();







