import axios from 'axios';

export default class AdminUserLinks {
    constructor() {
        
        this.userIds = document.querySelectorAll('#userLinks a');
        
        this.events()

    }

    events() {
        this.userIds.forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                this.getUserData(el);
            });
        });
    }

    //methods

    getUserData(link) {
        console.log(link.dataset.id);
        axios.post('/getUserData', {usernameId: link.dataset.id}).then((response) => {
            if(response.data) {
                console.log(response.data);
                //populate form with data !!
                




                // this.showValidationError(this.username, "That username is already taken");
                // this.username.isUnique = false;
            } else {
                // this.username.isUnique = true;
                // this.hideValidationError(this.username);
            }
        }).catch(() => {
            console.log("Problem connecting with DB")
        })
        


        
    }

}


