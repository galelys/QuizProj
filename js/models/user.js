export class User {
    constructor(name , password ) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.password = password; 


  }

    checkPassword(inputPassword) {
        return this.password === inputPassword;
    }

    getUserName(){
        return this.name;
    }
    
}