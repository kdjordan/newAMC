import axios from 'axios';
// import userForm from './users'

 

export default class AdminUserLinks {
    constructor() {
        //sections and form :: form id dynamically changed based on UI state
        this.sectionUsers = document.querySelector('.section-users');
        this.sectionHomes = document.querySelector('.section-homes');
        this.sectionKeepers = document.querySelector('.section-keepers');
        this.form = document.getElementById('adminUsersEdit-form');
        

        //buttons
        this.submitButtons = document.querySelectorAll('.btn__admin--submit');
        this.deleteButtons = document.querySelectorAll('.btn__admin--delete');

        //messaging and UI control
        this.titleMessage = document.querySelector('#titleMessage');
        this.adminTitle = document.querySelector('.admin__title');
        this.alertMessage = document.querySelector('#alertMessage');
        

        //form Elements for I/O
        this.passwordField = document.querySelector('#admin-password');
        this.usernameField = document.querySelector('#admin-username');
        this.hiddenID = document.querySelector('#hiddenIdField');
        this.homesCheckGroup = document.getElementsByName('checkBoxHomesArr');
        this.rolesRadioGroup = document.getElementsByName('role');
        
        
        

        //home specific form fields
        this.homeImage = document.getElementById('homeImage');
        this.homeImageUrl = document.querySelector('#homeUrl');
        this.homeName = document.querySelector('#homeName');

        //keeper specific form fields
        this.keepersRadioGroup = document.getElementsByName('radioKeepersArr');
        this.keeperName = document.getElementById('keeper-username');
        this.keeperPassword = document.getElementById('keeper-password');


        //links and elements for sidenav
        this.navTitles = document.querySelectorAll('.sidenav__title');
        this.userLinks = document.querySelectorAll('#userLinks a');
        this.keeperLinks = document.querySelectorAll('#keeperLinks a');
        this.homeLinks = document.querySelectorAll('#homeLinks a');
        this.userIds = document.querySelectorAll('#userLinks');
        this.keeperIds = document.querySelectorAll('#keeperLinks');
        this.homeIds = document.querySelectorAll('#homesLinks');
        
        
        //simplify event controllers
        this.allIdsArr = [this.userIds, this.homeIds, this.keeperIds];
        this.allSectionsArr = [this.sectionUsers, this.sectionHomes, this.sectionKeepers];
        this.events();

    }

    /////////////////////////////EVENTS/////////////////////////////

    events() {
        
        this.navTitles.forEach(el => {
            el.addEventListener('click', () => {
                this.checkAlertMessage();
                this.resetForm();
                this.setUI('add', el.id);
            })
        })

        this.allIdsArr.forEach((idArray) => {
            idArray.forEach((el) => {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.checkAlertMessage();
                    
                    let parentMenu = el.parentNode;
                    
                    if(parentMenu.classList.contains('sidenav__dropdown--users')){
                        let theId = el.firstChild.dataset.id;
                        this.setUI('update', "users", theId);
                        
                    }
                    if(parentMenu.classList.contains('sidenav__dropdown--homes')){
                        let theId = el.firstChild.dataset.id;
                        this.setUI('update', "homes", theId);
                        
                    }
                    if(parentMenu.classList.contains('sidenav__dropdown--keepers')){
                        let theId = el.firstChild.dataset.id;
                        this.setUI('update', "keepers", theId);
                        
                    }
                });

        })
        });

        this.deleteButtons.forEach((button) => {
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                if (button.id == 'homeDeleteButton') {
                    this.usernameField.value = this.homeName.value;
                }
                console.log(button);
                if(confirm(`Are You Sure You Want to Delete ${this.usernameField.value} ?`)) {
                    console.log(this.hiddenID.value);
                    this.deleteButtonHandler(button.id, this.hiddenID.value);
                }
            })
        });

        this.submitButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                //check to see if we're adding new user or updating a user
                console.log(this.rolesRadioGroup);
                if(this.submitButtonHandler(this.form.action, this.form.id)) {
                    this.form.submit();
                    this.alertMessage.classList.remove('hide-alert');
                    this.form.reset();
                } else {
                    console.log('form error')
                }
               
            });
        })
    }

    /////////////////////////////METHODS/////////////////////////////

    deleteButtonHandler(buttonId, id) {
       switch(buttonId) {
            case 'userDeleteButton' :
                this.deleteUser(id, buttonId);
                break;
            case 'homeDeleteButton' :
                this.deleteHome(id, buttonId);
                break;
            case 'keeperDeleteButton' :
                this.deleteUser(id, buttonId);
                break;
       }
     }


    setUI(operation, sectionVar, id) {
    
        //call update section to show proper form
        let sectionString = `section-${sectionVar}`;
        this.updateSection(sectionString);

        //get an updated admin title(title under logo) and update it
        this.adminTitle = document.querySelector(`#${sectionString} .admin__title`);

         //cut off trailing (s) so form action is correct
         let string = sectionVar.charAt(0).toUpperCase() + sectionVar.slice(1);
         let stringSingular = sectionVar.substring(0, string.length - 1);

         this.setFormFields(sectionVar)
        
         //flip submit button to delete and update
         this.submitButton = document.getElementById(`${stringSingular}SubmitButton`);
         this.deleteButton = document.getElementById(`${stringSingular}DeleteButton`);

         this.form = document.querySelector(`#admin${string}Edit-form`);


        //set title above form and action of form
        //if it's an update -> make a call to populate the form with ID info
        if(operation == 'add') {
            this.updateAdminTitle(`Add new ${sectionVar}`);
            this.submitButton.innerHTML = "ADD NEW";
            this.deleteButton.classList.add('u-hidden');
            
            this.form.action = `/admin/register${string}`;
        } else {
            this.updateAdminTitle(`Update ${string} Data`);
            this.submitButton.innerHTML = "UPDATE";
            this.deleteButton.classList.remove('u-hidden');
            
            this.form.action = `/admin/${stringSingular}/${id}/update`;
            this.getFormData(id, sectionVar);

        }
    };

      //FN : make a trip to the Db and grab user data based on ID
    //CALLS : populateUserEditForm with data to populate form
    getFormData(searchId, menu) {
        let nameType = '';
        switch(menu) {
            case 'users' :
                axios.post('/getUserData', {usernameId: searchId, type: 'any'}).then((response) => {
                    if(response.data) {
                        //populate form with data !!
                        this.populateUserEditForm(response.data);
                    } else {
                        this.throwAlert("User Not Found");
                    }
                }).catch((e) => {
                    console.log("Problem connecting with DB" + e);
                });
                break;
            case 'homes' :    
                axios.post('/getHomeData', {homeId: searchId}).then((response) => {
                    if(response.data) {
                        //populate form with data !!
                        this.populateHomeEditForm(response.data);
                    } else {
                        this.throwAlert("User Not Found");
                    }
                }).catch((e) => {
                    console.log("Problem connecting with DB" + e);
                });
                break;
            case 'keepers' :
                axios.post('/getUserData', {usernameId: searchId, type: 'keeper'}).then((response) => {
                    if(response.data) {
                        //populate form with data !!
                        this.populateKeeperEditForm(response.data);
                    } else {
                        this.throwAlert("Keeper Not Found");
                    }
                }).catch((e) => {
                    console.log("Problem connecting with DB in Keepers" + e);
                })
                break;   
        }
    };

    populateKeeperEditForm(data){
        this.form.reset();
        this.keeperName.value = data.keeperName;
        this.keeperPassword.placeholder = "Enter New Password";
        this.hiddenID.value = data.id;
        
        
        this.keepersRadioGroup.forEach((home) => {
            if(home.value == data.keeperHome[0]) {
                document.getElementById(`keeper-${data.keeperHome[0]}`).checked = true;
            }
        });
    }

    populateHomeEditForm(data) {
        this.form.reset();
        this.homeName.value = data.homeName;
        this.homeImageUrl.value = data.homeUrl;
        this.homeImage.src = `/img/${data.homeUrl}`;
        this.hiddenID.value = data._id;
    }

    //FN : populate user form with said data from DB trip
    populateUserEditForm(data) {
        this.form.reset();
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

    //FN : make decision on what formValidation method to call
    //RETURNS : boolean id form is ready to go
    submitButtonHandler(formAction, formId) {
       const regExRegisterTest = /register/;
       const regExUsersTest = /Users/;
       const regExHomesTest = /Homes/;
      
        if(regExRegisterTest.test(formAction)) {
            //we're registering something new - let's see what it is 
            if(regExUsersTest.test(formId)) {
                //we got a new user so validate that form
                if(this.userValidateForm()) {
                    return true;
                };
            } else if (regExHomesTest.test(formAction)) {
                if(this.homeValidateForm()) {
                    return true;
                };
            } else { 
                if(this.keeperValidateForm()) {
                    return true;
                };
            }
        } else {
            console.log('updating');
        }
    }


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
        this.adminTitle.innerHTML = message;
        this.titleMessage.innerHTML = message;
    };


    //messaging for alerts
    throwAlert(message) {
        
         this.alertMessage.innerHTML = message;
         this.alertMessage.classList.add('show-alert');
         setTimeout(function() {
             this.alertMessage.classList.remove('show-alert')
        }, 3000)
    }


    deleteHome(id, menu) {
        axios.post(`/admin/home/${id}/delete`).then((response) => {
            if(response.data) {
                this.removeFromNav(id, menu);
                this.throwAlert('Home Successfully deleted');
            }
        }).catch((e) => {
            console.log('error ' + e);
        })
    }
    
    //FN : take userID from sideNav user links
    //FN : delete user DB entry 
    //CALLS : removeUserFromNav passing userID
    // TODO : make removing element from sidenav a function : TODO*********************
    deleteUser(id, menu) {
        axios.post(`/admin/user/${id}/delete`).then((response) => {
            if(response.data) {
                this.removeFromNav(id, menu);
                this.throwAlert('User Successfully deleted');
            }
        }).catch((e) => {
            console.log('error ' + e);
        })
    };

    //FN : update sideNav by removing said user from menu
    //CALLS : reset form to empty out form
    removeFromNav(elementId, menu) {
        console.log(menu);
        console.log(elementId);
        switch(menu) {
            case 'userDeleteButton':
                this.userlinks = document.querySelectorAll('#userLinks a');
                break;
            case 'homeDeleteButton':
                this.userlinks = document.querySelectorAll('#homeLinks a');
                break;
            case 'keeperDeleteButton':
                this.userlinks = document.querySelectorAll('#keeperLinks a');
                break;

        }
        this.userLinks.forEach((link) => {
            console.log('removing');
            console.log(link)
            console.log(elementId)
            if(link.id == elementId) {
                console.log('found')
                link.parentNode.remove();
                this.resetForm();
            }
        });
    };

    //FN : empties out form
    resetForm() {
        this.form.reset();
        this.usernameField.value = " ";
        this.passwordField.placeholder = " ";
        this.alertMessage.classList.add('hide-alert');
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

     checkAlertMessage() {
        if(this.alertMessage.classList.contains('show-alert')){
            this.alertMessage.classList.remove('show-alert');
        }
    }

    setFormFields(form) {
        switch(form) {
            case 'users':
                this.passwordField = document.querySelector('#admin-password');
                this.usernameField = document.querySelector('#admin-username');
                this.homesCheckGroup = document.getElementsByName('checkBoxHomesArr');
                this.rolesRadioGroup = document.getElementsByName('role');
                break;
            case 'homes':
                this.homeImageUrl = document.querySelector('#homeUrl');
                this.homeName = document.querySelector('#homeName');
                break;
            case 'keepers': 
                this.passwordField = document.querySelector('#keeper-password');
                this.usernameField = document.querySelector('#keeper-username');
                this.keepersRadioGroup = document.getElementsByName('radioKeepersArr');
                break;
        }
    }

    keeperValidateForm() {
        
        if(this.passwordField.value == "" || this.usernameField.value == "") { 
            this.throwAlert("Username or Password is Empty !");
            return false; 
        } 
        if(!this.checkIfGroupIsEmpty(this.keepersRadioGroup)) { 
            this.throwAlert("You must select at least one home !");
            return false; 
        }     
        console.log('leaving form validation');
        console.log(this.keepersRadioGroup);
        return true;
    }

    homeValidateForm() {
        if(this.homeName.value == "" || this.homeImageUrl.value == "") {
            this.throwAlert("You Must provide a Home Name and an Image !");
            return false; 
        }
        return true;
        
    }
    //FN : check to make sure user Form is filled out
    userValidateForm() {
        
        console.log(this.rolesRadioGroup);
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

}

