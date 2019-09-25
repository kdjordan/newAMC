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

    /////////////////////////////EVENTS/////////////////////////////

    events() {
        this.deleteButton.addEventListener('click', (e) => {
            e.preventDefault();
            if(confirm(`Are You Sure You Want to Delete ${this.usernameField.value} ?`)) {
                this.deleteUser(this.hiddenID.value);
            }
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            //check to see if we're adding new user or updating a user
            
            // if(this.validateUserForm()) {
                if((this.adminTitle.innerHTML.toLowerCase().split(' ')[0] == "add")) {
                    console.log('adding');
                    this.userForm.submit();
                    this.resetForm();
                } else { 
                    this.userForm.action = `/admin/user/${this.hiddenID.value}/update`;
                    this.userForm.submit();
                    this.resetForm();
                }
            // } 
        });

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
        //  setTimeout(function() {
        //      this.alertMessage.classList.add('hide-alert')
        // }, 3000)
    }
    
    //FN : take userID from sideNav user links
    //FN : delete user DB entry 
    //CALLS : removeUserFromNav passing userID
    // TODO : make removing element from sidenav a function : TODO*********************
    deleteUser(id) {
        axios.post(`/admin/user/${id}/delete`).then((response) => {
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
        this.alertMessage.classList.add('hide-alert')
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

    
    //FN : populate user form with said data from DB trip
    populateUserEditForm(data) {
        this.userForm.reset();
        this.usernameField.value = data.username;
        this.passwordField.placeholder = "Enter New Password";
        this.hiddenID.value = data._id;
       
        this.homesCheckGroup.forEach((allHomes) => {
            if(data.homesArray.length > 1) {
                data.homesArray.forEach((activeHome) => {     
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

    //FN : check to make sure fields arr populated, if not thro
    validateUserForm() {
        if(this.passwordField.value == "" || this.usernameField.value == "") { 
            this.throwAlert("Username or Password is Empty !");
            return false; 
        } 
        if(!this.checkIfGroupIsEmpty(this.homesCheckGroup)) { 
            this.throwAlert("You must select at least one home !");
            return false; 
        }     
        if(!this.checkIfGroupIsEmpty(this.rolesRadioGroup)) { 
            this.throwAlert("You must provide a role !");
            return false; 
        } 
        // if(!Array.isArray(this.homesCheckGroup)) {
        //     console.log('singular');
        // }
        return true;
    };

    //FN : loop through a goup and see if an element is checked
    checkIfGroupIsEmpty(group) {
        //check to see if at least 1 item in group has been selected
        for(let i = 0; i < group.length; i++) {
            if(group[i].checked == true)
            return true;
        }
        return false;
     };

}

