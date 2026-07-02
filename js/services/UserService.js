import { User } from "../models/user.js";

export class UserService {
  constructor() {
    this.users = [];
  }

  // create new user
  createUser(name, password) {
    const user = new User(name, password);
    this.users.push(user);
    return user;
  }

  // find user by name
  findUserByName(name) {
    return this.users.find(user => user.name === name);
  }

  // login check
  login(name, password) {
    const user = this.findUserByName(name);

    if (!user) return false;

    return user.checkPassword(password);
  }

  // get all users
  getAllUsers() {
    return this.users;
  }
}