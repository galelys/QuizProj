export class User {
    constructor(name , password ,type , ID) {
        this.id = ID;
        this.name = name;
        this.password = password; 
        this.type = type;
  }

    checkPassword(inputPassword) {
        return this.password === inputPassword;
    }

    getUserName(){
        return this.name;
    }

    getUserType(){
        return this.type;
    }
    
}