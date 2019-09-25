export default class Admin {
    constructor() {
        this.navTitles = document.querySelectorAll('.sidenav__title');
        this.titleMessage = document.querySelector('.titleMessage');
        this.alertMessage = document.getElementById('alertMessage');
        this.userLinks = document.querySelectorAll('#userLinks');
        this.submitButton = document.querySelector('.btn__admin--submit');
        this.deleteButton = document.querySelector('.btn__admin--delete');
        this.adminTitle = document.querySelector('.admin__title');
        this.events();  
    }

    
    events() {
        
        this.navTitles.forEach(el => {
           el.addEventListener('click', (e) => {
            if (e.srcElement.classList.contains('sidenav__title')) {
                this.subMenuToggle(el);
            } else {
                this.updateTitleAndButtonMessage()
            }
           })
       })
       setTimeout(function() {
            this.alertMessage.classList.add('hide-alert')
       }, 3000)
    }
    
    //methods
    subMenuToggle(el) {
        
        if(el.id == "users") {
           this.titleMessage.innerHTML = "Add New User";
           document.querySelector('.section-users form').reset();
           document.getElementById('admin-username').placeholder = " ";
           document.getElementById('admin-password').placeholder = " ";
           document.querySelector('.section-users').classList.remove('u-hidden');
           document.querySelector('.section-homes').classList.add('u-hidden');
           document.querySelector('.section-keepers').classList.add('u-hidden');
           this.deleteButton.classList.add('u-hidden');
           this.submitButton.innerHTML = 'ADD NEW';
           this.adminTitle.innerHTML = 'Add New User';
           
         
        } else if(el.id == "homes") {
            this.titleMessage.innerHTML = "Add New Home";
            document.querySelector('.section-homes').classList.remove('u-hidden');
            document.querySelector('.section-users').classList.add('u-hidden');
            document.querySelector('.section-keepers').classList.add('u-hidden');
            this.deleteButton.classList.add('u-hidden');
        } 
        else if(el.id == "keepers") {
            this.titleMessage.innerHTML = "Add New Keeper";
            document.querySelector('.section-keepers').classList.remove('u-hidden');
            document.querySelector('.section-homes').classList.add('u-hidden');
            document.querySelector('.section-users').classList.add('u-hidden');
            this.deleteButton.classList.add('u-hidden');
        }
    }

    updateTitleAndButtonMessage() {
        this.titleMessage.innerHTML = "Edit User";
        this.submitButton.innerHTML = "UPDATE";
        this.deleteButton.classList.remove('u-hidden');
    }
    
}