import axios from 'axios';

export default class AdminUserLinks {
    constructor() {
        this.userForm = document.getElementById('adminUserEdit-form');
        this.userIds = document.querySelectorAll('#userLinks');
        this.userLinks = document.querySelectorAll('#userLinks a');
        this.passwordField = document.querySelector('#admin-password');
        this.usernameField = document.querySelector('#admin-username');
        this.hiddenID = document.querySelector('#hiddenIdField');
        this.homesCheckGroup = document.getElementsByName('checkBoxHomesArr');
        this.rolesRadioGroup = document.getElementsByName('roles');
        this.submitButton = document.querySelector('.btn__admin--submit');
        this.deleteButton = document.querySelector('.btn__admin--delete');
        this.adminTitle = document.querySelector('.admin__title');
        this.alertMessage = document.querySelector('#alertMessage');
        this.events();

    }

    events() {
        this.deleteButton.addEventListener('click', (e) => {
            e.preventDefault();
            if(confirm(`Are You Sure You Want to Delete ${this.usernameField.placeholder} ?`)) {
                this.deleteUser(this.hiddenID.value);
            }
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
           this.userForm.submit();
        });

        this.userForm.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        this.userIds.forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                this.adminTitle.innerHTML = 'Edit User';
                let searchId = el.children[0].dataset.id;
                this.getUserData(searchId);
            });
        });
    }

    //methods
    deleteUser(id) {
        //TODO :: delete the user via axios and remove from users sidenav
        axios.post(`/admin/user/${id}/delete`, ).then((response) => {
            if(response.data) {
                this.removeUserFromNav(id);

                //this should probabaly be a function
                this.alertMessage.innerHTML = 'User Successfully deleted';
                this.alertMessage.classList.remove('hide-alert');
                setTimeout(function() {
                    this.alertMessage.classList.add('hide-alert')
               }, 3000)
                
            }
        }).catch((e) => {
            console.log('error ' + e);
        })
    };

    removeUserFromNav(id) {
        this.userLinks.forEach((userId) => {
            if(id == userId.dataset.id) {
                userId.parentNode.remove();
                this.resetForm();
            }
        });
    }

    resetForm() {
        this.userForm.reset();
        this.usernameField.value = " ";
        this.passwordField.placeholder = " ";
    }
    getUserData(link) {
        axios.post('/getUserData', {usernameId: link}).then((response) => {
            if(response.data) {
                //populate form with data !!
                this.populateUserEditForm(response.data);
                
                // console.log(response.data);
                // this.showValidationError(this.username, "That username is already taken");
                // this.username.isUnique = false;
            } else {
                // this.username.isUnique = true;
                // this.hideValidationError(this.username);
            }
        }).catch((e) => {
            console.log("Problem connecting with DB" + e);
        })
    }

    populateUserEditForm(data) {
        this.userForm.reset();

        this.usernameField.placeholder = data.username;
        this.passwordField.placeholder = "Enter New Password";
        this.hiddenID.value = data._id;
        console.log(Array.isArray(data.homesArray));

        // this.homesCheckGroup.forEach((allHomes) => {
        //     if(data.homesArray.length > 1) {
        //         data.homesArray.forEach((activeHome) => {     
        //             // console.log(allHomes.value);
        //             if( allHomes.value == activeHome){
        //                 document.getElementById(`admin-${allHomes.value}`).checked = true;
                        
        //             }
        //         });
        //     } else {
        //         if (data.homesArray[0] == allHomes.value) {
        //             document.getElementById(`admin-${allHomes.value}`).checked = true;
        //         }
        //     }
        // });

        this.rolesRadioGroup.forEach((roles) => {
            if(roles.value == data.role) {
                document.getElementById(`admin-${data.role}Role`).checked = true;
            }
        });

    
    };

    

}

