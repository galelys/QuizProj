export class Exam {
  constructor(title , creatorID , version = 0 ) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = "";
    this.questions = [];
    this.createdAt = new Date().toISOString();
    this.timeLimit = 0;
    this.category = "";
    this.creatorID = creatorID;
    this.stats = [];
  }

  updateStats(stats){
    this.stats.push(stats);
  }

  addQuestion(question) {
    this.questions.push(question);
  }

  getExamId(){
    return this.id;
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

  updateExam(title, timeLimit, description = "") {
    this.timeLimit = timeLimit;
    this.title = title;
    this.description = description;
  }



}