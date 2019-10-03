import axios from 'axios';
// import userForm from './users'

 

export default class AdminUserLinks {
    constructor() {
        //sections and form 
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
        this.homeIds = document.querySelectorAll('#homeLinks');
        
        
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
                
                if(confirm(`Are You Sure You Want to Delete ${this.usernameField.value} ?`)) {
                    this.deleteButtonHandler(button.id, this.hiddenID.value);
                }
            })
        });

        this.submitButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                //check to see if we're adding new user or updating a user
                if(this.submitButtonHandler(this.form.action, this.form.id)) {
                    
                    this.form.reset();
                } else {
                    console.log('form error')
                }
               
            });
        })
    }

    /////////////////////////////METHODS/////////////////////////////

      //---------------HANDLER METHODS---------------

    //FN : make decision on what formValidation method to call based on what section button is clicked
    submitButtonHandler(formAction, formId) {
        let regExRegisterTest = /register/;
        let regExUsersTest = /Users/;
        let regExHomesTest = /Homes/;
       
         if(regExRegisterTest.test(formAction)) {
             //we're registering something new - let's see what it is 
             if(regExUsersTest.test(formId)) {
                 //we got a new user so validate that form
                 if(this.userValidateForm('add')) {
                     this.form.submit();
                     this.alertMessage.classList.remove('hide-alert');
                     return true;
                 };
             } else if (regExHomesTest.test(formAction)) {
                 //we got a home user so validate that form
                 if(this.homeValidateForm()) {
                     this.form.submit();
                     this.alertMessage.classList.remove('hide-alert');
                     return true;
                 };
             } else { 
                 //we got a keeper so validate that form
                 if(this.keeperValidateForm()) {
                     this.form.submit();
                     this.alertMessage.classList.remove('hide-alert');
                     return true;
                 };
             }
         }
         //we're updating so change our regex variables for matching update urls
         regExRegisterTest = /update/;
       
         if(regExRegisterTest.test(formAction)){
             //we're updating something - let's see what it is
             if(regExUsersTest.test(formId)) {
                //it's a user so update it (a blank password field will keep the same password)
                //blank username is not tolerated tho !
                if(this.userValidateForm('update')) {
                    this.updateUser(this.hiddenID.value);
                    //set an alert for update successfull
                    this.throwAlert('User Update Successful');
                    return true;
                    
                }
                
                
            } else if (regExHomesTest.test(formAction)) {
                console.log('update this Home');
    
            } else {
                    console.log('update this Keeper');
                }
         }
     }

    //delegates which type of element we're deleting
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

      //---------------UPDATE METHODS---------------
    updateUser(id) {
        //prepare checkBox, roleGroup, and password for updating
        let newPassword = ''; 
        if(this.passwordField.value == ''){ newPassword = 0;}   
            else { newPassword = this.passwordField.value; }

        let checkBoxActive = [];
        this.homesCheckGroup.forEach((el) => {
            if(el.checked == true) {
                checkBoxActive.push(el.value);
            }
        })

        let roleString = '';
        this.rolesRadioGroup.forEach((el) => {
            if(el.checked == true) {
                roleString =  el.value;
            } 
        });
        //end data formatting -- should prob be a seperate function
        axios.post(`/admin/user/${id}/update`, {
            id: this.hiddenID.value,
            password: newPassword,
            username: this.usernameField.value,
            checkBoxHomesArr : checkBoxActive,
            role: roleString

        }).then((response) => {
            console.log(response);
        }).catch((e) => {
            console.log('error updating user :' + e);
        })
        
        // this.passwordField ??????
    
    
}

      
    //   this.rolesRadioGroup


      //---------------VALIDATION METHODS---------------

    //FN : check to make sure KEEPER form is filled out
    keeperValidateForm() {
        if(this.passwordField.value == "" || this.usernameField.value == "") { 
            this.throwAlert("Username or Password is Empty !");
            return false; 
        } 
        if(!this.checkIfGroupIsEmpty(this.keepersRadioGroup)) { 
            this.throwAlert("You must select at least one home !");
            return false; 
        }     
        return true;
    }

    //FN : check to make sure HOME form is filled out
    homeValidateForm() {
        if(this.homeName.value == "" || this.homeImageUrl.value == "") {
            this.throwAlert("You Must provide a Home Name and an Image !");
            return false; 
        }
        return true;
        
    }

    //FN : check to make sure USER form is filled out
    userValidateForm(type) {
        
        if(type == 'add') {
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
        } else if(type == 'update') {
            
            if(this.usernameField.value == "") { 
                this.throwAlert("You must provide a Username !");
                return false; 
            } 
            return true;
        }
        
    };

    //---------------UI METHODS---------------
    
    //contorller for getting all fields active for whatever section we're dealing with
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
    //CALLS : populateXXXEditForm with data to populate form
    getFormData(searchId, menu) {
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
                    console.log("Problem connecting with DB in Users " + e);
                });
                break;
            case 'homes' :    
                axios.post('/getHomeData', {homeId: searchId}).then((response) => {
                    if(response.data) {
                        //populate form with data !!
                        this.populateHomeEditForm(response.data);
                    } else {
                        this.throwAlert("Home Not Found");
                    }
                }).catch((e) => {
                    console.log("Problem connecting with DB in Homes " + e);
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
                    console.log("Problem connecting with DB in Keepers " + e);
                })
                break;   
        }
    };

    //FN : based on what section we are diplaying - makes fields active
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

    //FN : populate KEEPER form with said data from DB trip
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

    //FN : populate HOME form with said data from DB trip
    populateHomeEditForm(data) {
        this.form.reset();
        this.homeName.value = data.homeName;
        this.homeImageUrl.value = data.homeUrl;
        this.homeImage.src = `/img/${data.homeUrl}`;
        this.hiddenID.value = data._id;
    }

    //FN : populate USER form with said data from DB trip
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

    //FN : display appropriate section with form based on nav click (u-hidden toggle)
    updateSection(section) {
        this.allSectionsArr.forEach((el) => {
            if(el.classList.contains(section)){
                el.classList.remove('u-hidden');
            } else {
                el.classList.add('u-hidden');
            }
        })
    }
   
    //---------------DELETE METHODS---------------

    //FN : delete user or keeper from DB and call to remove from nav
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

    //FN : delete HOME from DB and call to remove from nav
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

    //FN : update sideNav by removing said link from menu - called from deleteUser or deleteHome
    removeFromNav(elementId, menu) {
       
        switch(menu) {
            case 'userDeleteButton':
                this.links = this.userLinks;
                break;
            case 'homeDeleteButton':
                this.links = this.homeLinks;
                break;
            case 'keeperDeleteButton':
                this.links = this.keeperLinks;
                break;

        }
        this.links.forEach((link) => {
            if(link.dataset.id == elementId) {
                link.parentNode.remove();
                this.resetForm();
            }
        });
    };


    //---------------UTILITY METHODS---------------

    //FN : lets user know what just happened (element added or removed or updated)
    throwAlert(message) {
        
         this.alertMessage.innerHTML = message;
         this.alertMessage.classList.add('show-alert');
         setTimeout(function() {
             this.alertMessage.classList.remove('show-alert')
        }, 3000)
    }

     //FN : empties out form
     resetForm() {
        this.form.reset();
        this.usernameField.value = " ";
        this.passwordField.placeholder = " ";
        this.alertMessage.classList.add('hide-alert');
    };

     //FN : checks to see if alert message is present and removes if so
     checkAlertMessage() {
        if(this.alertMessage.classList.contains('show-alert')){
            this.alertMessage.classList.remove('show-alert');
        }
    }

     //FN : display appropriate admin title (title next to ADMINISTRATION and title over form section)
     updateAdminTitle(message) {
        this.adminTitle.innerHTML = message;
        this.titleMessage.innerHTML = message;
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

