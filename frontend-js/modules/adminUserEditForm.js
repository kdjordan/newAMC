import axios from 'axios';

export default class AdminUserLinks {
    constructor() {
        //sections and form :: userForm id dynamically changed based on UI state
        this.sectionUsers = document.querySelector('.section-users');
        this.sectionHomes = document.querySelector('.section-homes');
        this.sectionKeepers = document.querySelector('.section-keepers');
        this.userForm = document.getElementById('adminUsersEdit-form');


        //buttons
        this.submitButton = document.querySelector('.btn__admin--submit');
        this.deleteButton = document.querySelector('.btn__admin--delete');

        //messaging and UI control
        this.titleMessage = document.querySelector('.titleMessage');
        this.adminTitle = document.querySelector('.admin__title');
        this.alertMessage = document.querySelector('#alertMessage');
        

        
        //form Elements for I/O
        this.passwordField = document.querySelector('#admin-password');
        this.usernameField = document.querySelector('#admin-username');
        this.hiddenID = document.querySelector('#hiddenIdField');
        this.homesCheckGroup = document.getElementsByName('checkBoxHomesArr');
        this.rolesRadioGroup = document.getElementsByName('roles');

        //links and elements for sidenav
        this.navTitles = document.querySelectorAll('.sidenav__title');
        this.userLinks = document.querySelectorAll('#userLinks a');
        this.keeperLinks = document.querySelectorAll('#keeperLinks a');
        this.homeLinks = document.querySelectorAll('#homeLinks a');
        this.userIds = document.querySelectorAll('#userLinks');
        this.keeperIds = document.querySelectorAll('#keeperLinks');
        this.homeIds = document.querySelectorAll('#homesLinks');
        
        
        //simply event controllers
        this.allIdsArr = [this.userIds, this.homeIds, this.keeperIds];
        this.allSectionsArr = [this.sectionUsers, this.sectionHomes, this.sectionKeepers];
        this.events();

    }

    /////////////////////////////EVENTS/////////////////////////////

    events() {
        
        this.navTitles.forEach(el => {
            el.addEventListener('click', () => {
                this.setUI('add', el.id);
            })
        })

        this.allIdsArr.forEach((idArray) => {
            idArray.forEach((el) => {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    let parentMenu = el.parentNode;
                    
                    
                    if(parentMenu.classList.contains('sidenav__dropdown--users')){
                        let theId = el.firstChild.dataset.id;
                        this.setUI('update', "users", theId);
                        
                    }
                    if(parentMenu.classList.contains('sidenav__dropdown--homes')){
                        this.setUI('update', "homes");
                    }
                    if(parentMenu.classList.contains('sidenav__dropdown--keepers')){
                        this.setUI('update', "keepers");
                    }
                    let searchId = el.children[0].dataset.id;
                    // console.log(searchId);
                    
                    //create handler to switch forms and then run getUserData
                    //need to know where the click came from :: user, home, or keeper
                    // this.getFormData(searchId, parentMenu);
                });

        })
        });

        this.deleteButton.addEventListener('click', (e) => {
            e.preventDefault();
            if(confirm(`Are You Sure You Want to Delete ${this.usernameField.value} ?`)) {
                this.deleteUser(this.hiddenID.value);
            }
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
;            //check to see if we're adding new user or updating a user
            
            // if(this.validateUserForm()) {
                if((this.adminTitle.innerHTML.toLowerCase().split(' ')[0] == "add")) {
                    // this.userForm.submit();
                    this.resetForm();
                } else { 
                    this.userForm.action = `/admin/user/${this.hiddenID.value}/update`;
                    this.userForm.submit();
                    this.resetForm();
                }
            // } 
        });
    }

    /////////////////////////////METHODS/////////////////////////////

    setUI(operation, sectionVar, id) {
        
        // console.log(operation);
        // console.log(sectionVar)

        //call update section to show proper form
        let sectionString = `section-${sectionVar}`;
        this.updateSection(sectionString);

        //get an updated admin title(title under logo) and update it
        let adminTitleSelectString = `#${sectionString} .admin__title`;
        this.adminTitle = document.querySelector(adminTitleSelectString);

         //cut off trailing (s) so form action is correct
         let string = sectionVar.charAt(0).toUpperCase() + sectionVar.slice(1);
         string = string.substring(0, string.length - 1);

         console.log(string)
         console.log(sectionVar)

        //set title above form and action of form
        if(operation == 'add') {
            this.updateAdminTitle(`Add new ${sectionVar}`);
            this.userForm.action = `/admin/register${string}`;
        } else {
            // sectionVar = sectionVar.substring(0, sectionVar.length - 1);
            this.updateAdminTitle(`Update ${string} Data`);
            let userFormSelectString = `#admin${string}sEdit-form`;
            console.log(userFormSelectString);
            this.userForm = document.querySelector(userFormSelectString);
            this.userForm.action = `/admin/user/${id}/update`;
        }
        
         console.log(this.userForm.action);

        //form specific grabs
        


    };

    updateSection(section) {
        this.allSectionsArr.forEach((el) => {
            if(el.classList.contains(section)){
                el.classList.remove('u-hidden');
            } else {
                el.classList.add('u-hidden');
            }
        })
    }

    updateAdminTitle(message) {
        
        // console.log(this.adminTitle);
        // console.log(this.userForm);
        this.adminTitle.innerHTML = message;
        // console.log(this.adminTitle.innerHTML);
        this.titleMessage.innerHTML = message;
    };


    //messaging for alerts
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
    };

    //FN : empties out form
    resetForm() {
        this.userForm.reset();
        this.usernameField.value = " ";
        this.passwordField.placeholder = " ";
        this.alertMessage.classList.add('hide-alert');
    };

    

    

    //FN : make a trip to the Db and grab user data based on ID
    //CALLS : populateUserEditForm with data to populate form
    getFormData(searchId, menu) {
        this.setForm(menu);
        
        // axios.post('/getUserData', {usernameId: link}).then((response) => {
        //     console.log(response.data);
        //     if(response.data) {
        //         //populate form with data !!
        //         this.populateUserEditForm(response.data);
                
        //         // console.log(response.data);
        //         // this.showValidationError(this.username, "That username is already taken");
        //         // this.username.isUnique = false;
        //     } else {
        //         // this.username.isUnique = true;
        //         // this.hideValidationError(this.username);
        //     }
        // }).catch((e) => {
        //     console.log("Problem connecting with DB" + e);
        // })
    };

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

