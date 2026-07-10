import { User } from "../models/user.js";

export class UserService {
  constructor() {
    this.storageKey = "users";
  }

  // add new user
  addUser(user) {
    if (this.findUserById(user.id) !== null) {
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

    return users.find(u => String(u.name) === String(name)) || null;
  }

  findUserById(id) {

    const data = localStorage.getItem(this.storageKey);

    if (!data) {
      return null;
    }


    const users = JSON.parse(data);

    const userData = users.find(
      u => u.id === id
    );


    if (!userData) {
      return null;
    }


    // recreate User class object
    const user = new User(
      userData.name,
      userData.password,
      userData.type
    );


    // restore saved properties
    user.id = userData.id;
    user.examsResults = userData.examsResults || [];
    user.examsCreated = userData.examsCreated || [];


    return user;
  }

  // login check
  login(id, password) {
    let usr = this.findUserById(id);
    //in case that id is not in our datd
    if (!usr) {
      return null;
    }

    if (usr.password === password) {
      return usr;
    }
    return null;

  }

  saveUser(user) {

    const data = localStorage.getItem(this.storageKey);

    const users = data ? JSON.parse(data) : [];


    // Find existing user: update if present, append if new
    const index = users.findIndex(u => u.id === user.id);
    if (index === -1) users.push(user); else users[index] = user;

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(users)
    );

  }



}