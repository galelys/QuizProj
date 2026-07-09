export class Question {
  constructor(text, answers, correctAnswerIndex, difficulty) {
    this.id = crypto.randomUUID();
    this.text = text;
    this.answers = answers;
    this.correctAnswerIndex = correctAnswerIndex;
    this.difficulty = difficulty;
  }

  isCorrect(userAnswerIndex) {
    return userAnswerIndex === this.correctAnswerIndex;
  }

  updateQuestion(text, answers, correctAnswerIndex, difficulty) {
    this.text = text;
    this.answers = answers;
    this.correctAnswerIndex = correctAnswerIndex;
    this.difficulty = difficulty;
  }

}