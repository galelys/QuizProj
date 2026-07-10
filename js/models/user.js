export class User {
    constructor(name, password, type, ID) {
        this.id = ID;
        this.name = name;
        this.password = password;
        this.type = type;
        this.examsResults = [];
        this.examsCreated = [];
  }

    checkPassword(inputPassword) {
        return this.password === inputPassword;
    }

    getUserName() {
        return this.name;
    }

    getUserType() {
        return this.type;
    }

    addExamResults(results) {
        this.examsResults.push(results);
    }

    addExamCreation(examID){
        this.examsCreated.push(examID);
    }

    getExamsCreatedCount(){
        return this.examsCreated.length;
    }

    
}