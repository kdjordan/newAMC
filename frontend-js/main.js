import ReservationForm from './modules/reservationForm';
import AdminUserEditForm from './modules/adminUserEditForm';
import Admin from './modules/admin';
import AdminUserLinks from './modules/adminUserLinks';






if (document.querySelector('#adminUsersEdit-form')) {
    new AdminUserEditForm();
}

//fix later
new ReservationForm();

