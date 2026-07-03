import { User } from "../models/User.js";

export class UserService {
  constructor() {
    this.storageKey = "users";
  }
  

  getAllExams() {
        //get data from localStorage by examkey
    const data = localStorage.getItem(this.storageKey);

    if (!data) {
      return []; //if not exist return empty array
    }


    const plainExams = JSON.parse(data);
        //map function, clone object from examData. avoiding direct manipulation
      return plainExams.map(examData => {
           //create new
        const exam = new Exam(examData.title);
            //clone the data
        exam.id = examData.id;
        exam.createdAt = examData.createdAt;

            //inner clone for questions
        exam.questions = examData.questions.map(questionData => {
          const question = new Question(
            questionData.text,
            questionData.answers,
            questionData.correctAnswerIndex
            );

        question.id = questionData.id;

          return question;
        });

        return exam;
      });
  };

  // add new user
  addUser(User) {
    const exams = this.getAllExams();

    localStorage.setItem(this.storageKey, JSON.stringify(exams));
 
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