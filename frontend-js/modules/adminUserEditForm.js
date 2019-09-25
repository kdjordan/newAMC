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
        this.errors = [];
        this.events();

    }

    /////////////////////////////EVENTS/////////////////////////////

    events() {
        this.deleteButton.addEventListener('click', (e) => {
            e.preventDefault();
            if(confirm(`Are You Sure You Want to Delete ${this.usernameField.placeholder} ?`)) {
                this.deleteUser(this.hiddenID.value);
            }
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            // console.log(this.validateUserForm());
            if(this.validateUserForm()) {
                console.log('submitting');
                // this.userForm.submit();
            } else {
                this.throwAlert('Username or Password is Empty !');
            }
        });

        // this.userForm.addEventListener('submit', (e) => {
            
        //     e.preventDefault();
        //     console.log('submit');
        //     this.validateUserForm();
        //     e.stopPropagation();
        // });

        this.userIds.forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                let searchId = el.children[0].dataset.id;
                this.getUserData(searchId);
            });
        });
    }

    /////////////////////////////METHODS/////////////////////////////

    throwAlert(message) {
         this.alertMessage.innerHTML = message;
         this.alertMessage.classList.remove('hide-alert');
         setTimeout(function() {
             this.alertMessage.classList.add('hide-alert')
        }, 3000)
    }

    //FN : take userID from sideNav user links
    //FN : delete user DB entry 
    //CALLS : removeUserFromNav passing userID
    // TODO : make removing element from sidenav a function : TODO*********************
    deleteUser(id) {
        axios.post(`/admin/user/${id}/delete`, ).then((response) => {
            if(response.data) {
                this.removeUserFromNav(id);

                this.throwAlert('User Successfully deleted');
               
                
            }
        }).catch((e) => {
            console.log('error ' + e);
        })
    };

    //FN : update sideNav by removing said user from menu
    //CALLS : reset form to empty out form
    removeUserFromNav(id) {
        this.userLinks.forEach((userId) => {
            if(id == userId.dataset.id) {
                userId.parentNode.remove();
                this.resetForm();
            }
        });
    }

    //FN : empties out form
    resetForm() {
        this.userForm.reset();
        this.usernameField.value = " ";
        this.passwordField.placeholder = " ";
    }

    //FN : make a trip to the Db and grab user data based on ID
    //CALLS : populateUserEditForm with data to populate form
    getUserData(link) {
        this.adminTitle.innerHTML = "Edit User Data";
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

    
    //FN : populate user form with said data
    populateUserEditForm(data) {
        this.userForm.reset();
        this.usernameField.placeholder = data.username;
        this.passwordField.placeholder = "Enter New Password";
        this.hiddenID.value = data._id;
       
        this.homesCheckGroup.forEach((allHomes) => {
            if(data.homesArray.length > 1) {
                data.homesArray.forEach((activeHome) => {     
                    // console.log(allHomes.value);
                    if( allHomes.value == activeHome){
                        document.getElementById(`admin-${allHomes.value}`).checked = true;
                    }
                });
            } else {
                if (data.homesArray[0] == allHomes.value) {
                    document.getElementById(`admin-${allHomes.value}`).checked = true;
                }
            }
        });

        this.rolesRadioGroup.forEach((roles) => {
            if(roles.value == data.role) {
                document.getElementById(`admin-${data.role}Role`).checked = true;
            }
        });
    };

    validateUserForm() {
        
        if(this.passwordField.value == "" || this.usernameField.value == "") {return false;} 
        if(this.passwordField.value == "" || this.usernameField.value == "") {return false;} 

        //check to see if at least 1 home has been selected
        this.homesCheckGroup.forEach((home) => {
            if (home.checked == true) {
               return;
            } else {
                return false;
            }
        })

        //check to see if a role has been selected
        this.rolesRadioGroup.forEach((role) => {
            if (role.checked == true) {
               return;
            } else {
                return false;
            }
        })

        return true;
       
             
       
        

        
        
    }
    

}

