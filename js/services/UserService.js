import { User } from "../models/User.js";

export class UserService {
  constructor() {
    this.storageKey = "users";
  }
  


  // add new user
  addUser(user) {
    if(this.findUserById(user.id) !== null){
      return false;
    }

    const data = localStorage.getItem(this.storageKey);
    const plainUsers = data ? JSON.parse(data) : [];
    plainUsers.push(user);

    localStorage.setItem(this.storageKey, JSON.stringify(plainUsers));
    return true;
 
  }

  // find user by name
  findUserByName(name) {
    const data = localStorage.getItem(this.storageKey);

    if (!data) {
      return null; //if not exist return null
    }

    const users = JSON.parse(data);

    return users.find( u => u.name === name ) || null;
  }

  findUserById(id){
    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      return null; //if not exist return null
    }
    const users = JSON.parse(data);
    return users.find( u => u.id === id ) || null;
  }

  // login check
  login(id, password) {
    let usr = this.findUserById(id);
    if(usr.password === password ){
      return usr
    }
    return null;
    
  }

}