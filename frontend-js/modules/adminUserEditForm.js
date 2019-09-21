import axios from 'axios';

export default class AdminUserEditForm {
    constructor() {
        this.form = document.querySelector('#adminUserEdit-form');
        this.username = document.querySelector('#admin-username');
        this.password = document.querySelector('#admin-password');
        this.homes = document.querySelector('#admin-homes');
        this.roles = document.querySelector('#admin-roles');

        this.events();
    }

    //events
    events() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            // this.formSubmitHandler();
        })
    }


    //methods
    formSubmitHandler() {

    }




}