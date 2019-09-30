import axios from 'axios';

export default class AdminUserLinks {
    constructor() {
        this.userForm = document.getElementById('adminUserEdit-form');
        this.userIds = document.querySelectorAll('#userLinks a');
        this.passwordField = document.querySelector('#admin-password');
        this.usernameField = document.querySelector('#admin-username');
        this.hiddenID = document.querySelector('#hiddenIdField');
        this.homesCheckGroup = document.getElementsByName('checkBoxHomesArr');
        this.rolesRadioGroup = document.getElementsByName('roles');

        this.deleteButton = document.querySelector('.btn__admin--delete');
        this.events();

    }

    events() {
        this.deleteButton.addEventListener('click', () => {
            e.preventDefault();
            if(confirm(`Are You Sure You Want to Delete ${this.usernameField.placeholder} ?`)) {
                this.deleteUser(this.hiddenID.value);
                
            }
        });

        this.userIds.forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                this.getUserData(el);
            });
        });
    }

    //methods

    deleteUser(id) {
        //TODO :: delete the user via axios and remove from users sidenav
        axios.post(`/admin/user/${id}/delete`, ).then((response) => {
            console.log(response);
        }).catch((e) => {
            console.log('error ' + e)
        })
        
        
    }

    getUserData(link) {
        axios.post('/getUserData', {usernameId: link.dataset.id}).then((response) => {
            if(response.data) {
                //populate form with data !!
                this.populateUserEditForm(response.data);
                
                console.log(response.data);
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

