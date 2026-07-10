import { Question } from "../../../js/models/Question.js";
import { Exam } from "../../../../js/models/exam.js";
import { ExamService } from "../../../js/services/ExamService.js";
import { ExamUI } from "../../../js/ui/ExamUI.js";
import { initThemeToggle } from "../../../js/ui/theme.js";
import { UserService } from "../../../js/services/UserService.js";

const examService = new ExamService();
const examUI = new ExamUI(examService);
const userService = new UserService();
const activeUser = JSON.parse(localStorage.getItem('activeUser'));
const user = userService.findUserById(activeUser.id);

let currentExam = null;

const examTitleInput = document.getElementById("examTitle");
const questionTextInput = document.getElementById("questionText");

const answer1Input = document.getElementById("answer1");
const answer2Input = document.getElementById("answer2");
const answer3Input = document.getElementById("answer3");
const answer4Input = document.getElementById("answer4");

const correctAnswerInput = document.getElementById("correctAnswer");
let timeLimitInput = document.getElementById('timeLimit');

const addQuestionBtn = document.getElementById("addQuestionBtn");
const saveExamBtn = document.getElementById("saveExamBtn");
let categorsCard = document.getElementById('categoryCard');
let categories = examService.getCategories();



// Import button + its hidden file input
let importBtn = document.getElementById("importBTN");
let importFileInput = document.getElementById("importFile");

// Clicking the visible button opens the file picker
importBtn.addEventListener("click", () => importFileInput.click());
// When a file is chosen, read and import it
importFileInput.addEventListener("change", importExam);

//const examListElement = document.getElementById("examList");
initThemeToggle();
examUI.showExamCategories(categorsCard, categories);

// the difficulty slider
const sliderQDiff = document.getElementById("questionDiff");
const outputQDiff = document.getElementById("diffValue");

// set initial value
outputQDiff.textContent = sliderQDiff.value;

// update on change
sliderQDiff.addEventListener("input", () => {
  outputQDiff.textContent = sliderQDiff.value;
});


addQuestionBtn.addEventListener("click", () => {
  const title = examTitleInput.value.trim();
  const questionText = questionTextInput.value.trim();

  // the difficulty slider
  let questionDiff = Number(sliderQDiff.value);
  //console.log(questionDiff);

  const answers = [
    answer1Input.value.trim(),
    answer2Input.value.trim(),
    answer3Input.value.trim(),
    answer4Input.value.trim()
  ];

  const correctAnswerNumber = Number(correctAnswerInput.value);

  if (!title) {
    examUI.showBuilderMessage("Please enter exam title.", "danger");
    return;
  }

  if (!questionText) {
    examUI.showBuilderMessage("Please enter question text.", "danger");
    return;
  }

  if (answers.some(answer => answer === "")) {
    examUI.showBuilderMessage("Please fill all 4 answers.", "danger");
    return;
  }

  if (correctAnswerNumber < 1 || correctAnswerNumber > 4) {
    examUI.showBuilderMessage("Correct answer must be a number from 1 to 4.", "danger");
    return;
  }

  if (!currentExam) {
    const user = JSON.parse(localStorage.getItem('activeUser'));
    currentExam = new Exam(title, user.id);
  }

  const correctAnswerIndex = correctAnswerNumber - 1;

  const question = new Question(
    questionText,
    answers,
    correctAnswerIndex,
    questionDiff
  );

  currentExam.addQuestion(question);

  examUI.showBuilderMessage(
    `Question added. Current exam has ${currentExam.getQuestionCount()} question(s).`,
    "success"
  );

  clearQuestionInputs();
});

saveExamBtn.addEventListener("click", () => {
  if (!currentExam) {
    examUI.showBuilderMessage("Create an exam and add at least one question first.", "danger");
    return;
  }

  if (currentExam.getQuestionCount() === 0) {
    examUI.showBuilderMessage("Cannot save exam without questions.", "danger");
    return;
  }
  currentExam.category = localStorage.getItem('selected_category');
  if (currentExam.category === null) {
    examUI.showBuilderMessage("Cannot save exam without a category.", "danger");
    return;
  }
  localStorage.removeItem('selected_category');
  let time = Number(timeLimitInput.value);
  if (isNaN(time) || time <= -1) {
    examUI.showBuilderMessage("Cannot save exam without questions.", "danger");
    return;

  }
  currentExam.timeLimit = time;

  // Record this exam under the teacher who created it
  user.addExamCreation(currentExam.id);
  userService.saveUser(user);

  examService.saveExam(currentExam);

  examUI.showBuilderMessage("Exam saved successfully.", "success");

  currentExam = null;

  examTitleInput.value = "";


});


function clearQuestionInputs() {
  questionTextInput.value = "";

  answer1Input.value = "";
  answer2Input.value = "";
  answer3Input.value = "";
  answer4Input.value = "";

  correctAnswerInput.value = "";
}


/**
* Imports an exam from a JSON file selected by the user.
* Reads the file, parses the JSON, rebuilds it as an Exam
* object (with fresh ids so it never overwrites an existing exam),
* saves it to localStorage, and refreshes the list.
*/
function importExam(event) {

  // The file the user picked
  const file = event.target.files[0];
  if (!file) { return; }

  const reader = new FileReader();

  reader.onload = e => {
    try {
      // Turn the file text back into an object
      const data = JSON.parse(e.target.result);

      // Rebuild a clean Exam object from the raw data.
      // Uses the module-level `user` (a real User instance with addExamCreation),
      // not a plain object parsed from localStorage.
      const exam = new Exam(data.title, user.id);

      // New id so importing the same file twice does not overwrite
      exam.id = crypto.randomUUID();
      exam.createdAt = new Date().toISOString();
      exam.timeLimit = data.timeLimit || 0;
      exam.category = data.category || "";

      // Rebuild each question
      exam.questions = (data.questions || []).map(q => {
        const question = new Question(
          q.text,
          q.answers,
          q.correctAnswerIndex,
          q.difficulty
        );
        return question;
      });


      // Record this exam under the teacher who created it
      user.addExamCreation(exam.id);
      userService.saveUser(user);
      // Save the imported exam and refresh the list
      examService.saveExam(exam);
      alert("Exam was added successfully");
    } catch (err) {
      // The file was not valid exam JSON
      alert("Invalid exam file.");
    }

    // Reset the input so the same file can be imported again
    event.target.value = "";
  };

  // Read the file as text (triggers reader.onload above)
  reader.readAsText(file);
}


