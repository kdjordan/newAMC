import axios from 'axios';

export default class AdminUserEditForm {
    constructor() {
        this.form = document.querySelector('#adminUserEdit-form');
        this.username = document.querySelector('#admin-username');
        this.password = document.querySelector('#admin-password');
        this.homes = document.querySelector('#admin-homes');
        this.role = document.querySelector('#admin-roles');
        this.deleteButton = document.querySelector('.btn__admin--delete');
        this.submitButton = document.querySelector('.btn__admin--submit');
        this.events();
    }

    //events
    events() {
        this.deleteButton.addEventListener('click', () => {
            if(confirm(`Are You Sure You Want to Delete ${this.username.placeholder} ?`)) {
                console.log('deleting' + this.username.id);
                //TODO :: delete the user via axios and remove from users sidenav
                // this.form.action = "/admin/userid/delete"
            }
        });

    
        this.form.addEventListener('submit', (e) => {
            // console.log(e);
            e.preventDefault();
            this.formSubmitHandler();
        })

    }


    //methods
    formSubmitHandler() {
       
        this.form.submit();
    }




}