export class Exam {
  constructor(title) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.questions = [];
    this.createdAt = new Date().toISOString();
    this.timeLimit = 0;
    this.category = "";

  }

  addQuestion(question) {
    this.questions.push(question);
  }
    removeQuestion(index) {
        if (index >= 0 && index < this.questions.length) {
            this.questions.splice(index, 1);
        }
    }
  
updateQuestion(index, question) {
    if (index >= 0 && index < this.questions.length) {
        this.questions[index] = question;
    }
}

  getQuestionCount() {
    return this.questions.length;
  }

  addTimeLimit(time) {
    this.timeLimit = time;
  }

  addCategory(category) {
    this.category = category;
  }

}