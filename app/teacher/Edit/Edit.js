import { Question } from "../../../js/models/Question.js";
import { Exam } from "../../../js/models/exam.js";
import { ExamService } from "../../../js/services/ExamService.js";
import { ExamUI } from "../../../js/ui/ExamUI.js";
import { initThemeToggle } from "../../../js/ui/theme.js";

document.addEventListener('DOMContentLoaded', function () {

  // Initialize dark/light theme
  initThemeToggle();

  // Create service and UI instances
  const examService = new ExamService();
  const examUI = new ExamUI(examService);

  // Load the selected exam using the ID stored in localStorage
  let examID = localStorage.getItem("examID");
  let exam = examService.getExamById(examID);


  // Render the exam editor
  examUI.renderExamEdit(exam);

  // Main action buttons
  let saveBTN = document.getElementById('saveQuestionBtn');
  let deleteBTN = document.getElementById('deleteQuestionBtn');
  let addBTN = document.getElementById('addQuestionBtn');
  let saveExamBTN = document.getElementById("saveExamBTN");

  // Frequently used input elements
  const questionTextInput = document.getElementById("questionText");
  const sliderQDiff = document.getElementById("questionDiff");
  const outputQDiff = document.getElementById("diffValue");
  const correctAnswerInput = document.getElementById("correctAnswer");

  // Indicates whether the user is creating a new question
  // or editing an existing one
  let isNewQuestion = false;


  // saving button events
  saveBTN.addEventListener("click", saveQuestion);
  saveExamBTN.addEventListener("click", saveExam);

  // update on change
  sliderQDiff.addEventListener("input", () => {
    outputQDiff.textContent = sliderQDiff.value;

  });


  /**
   * Saves general exam information
   * (title and time limit).
   */
  function saveExam() {

    // Keep the time limit numeric so `exam.timeLimit === 0` (the "Unlimited"
    // check used across the UI) keeps working after an edit.
    let timeLimitInput = Number(document.getElementById('examTimeLimit').value);
    let examTitle = document.getElementById('examTitle').value;
    let examDescription = document.getElementById('examDescription').value.trim();

    exam.updateExam(examTitle, timeLimitInput, examDescription);
    // save changes
    examService.saveExam(exam);
    // Refresh the UI
    examUI.renderExamEdit(exam);

  }

  /**
 * Saves either:
 * 1. A newly created question
 * 2. Updates an existing question
 */
  function saveQuestion() {
    // Read current question values
    const questionText = document.getElementById("questionText").value.trim();
    const correctAnswerNumber = Number(correctAnswerInput.value) -1;

    const questionDiff = Number(
      document.getElementById("questionDiff").value
    );
    const answers = [
      document.getElementById("answer0").value,
      document.getElementById("answer1").value,
      document.getElementById("answer2").value,
      document.getElementById("answer3").value
    ];
    //const correctAnswerIndex = correctAnswerNumber - 1;

    // Create a Question object
    const question = new Question(
      questionText,
      answers,
      correctAnswerNumber,
      questionDiff
    );

    // Current question being edited.
    let index = localStorage.getItem('currentQuestionIndex');
    // ----- Validation -----
    if (!questionText) {
      examUI.showBuilderMessage("Please enter question text.", "danger");
      return;
    }

    if (answers.some(answer => answer === "")) {
      examUI.showBuilderMessage("Please fill all 4 answers.", "danger");
      return;
    }

    if (correctAnswerNumber < 0 || correctAnswerNumber > 3) {
      examUI.showBuilderMessage("Correct answer must be a number from 1 to 4.", "danger");
      return;
    }

    // ----- Save -----
    if (isNewQuestion) {
      // Add a brand-new question to the exam
      exam.addQuestion(question);
      // Switch back to edit mode
      isNewQuestion = false;
    } else {
      // Update the currently selected question
      exam.updateQuestion(index, question);
    }
    examUI.showBuilderMessage(
      `Question added. Current exam has ${exam.getQuestionCount()} question(s).`,
      "success"
    );
    // Save the updated exam to localStorage
    examService.saveExam(exam);

    // Refresh the question selector and editor
    examUI.renderQuestionSelect(exam, index);
    examUI.renderQuestion(exam, index);
  }

  /**
   * Deletes the currently selected question.
   */
  deleteBTN.addEventListener('click', () => {
    let index = localStorage.getItem('currentQuestionIndex');
    exam.removeQuestion(index);
    examService.saveExam(exam);
    examUI.renderExamEdit(exam);

  });

  /**
   * Clears the editor so the user can create a new question.
   * The question is NOT added until Save is pressed.
   */
  addBTN.addEventListener('click', () => {
    isNewQuestion = true;
    // Reserve the next available index
    localStorage.setItem('currentQuestionIndex', exam.getQuestionCount());
    // Display an empty form
    examUI.renderEmptyQuestion();

  });


});