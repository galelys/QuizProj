/*
===========================================================
 ExamUI
 ----------------------------------------------------------
 Responsible for all UI rendering related to exams:
 - displaying exam lists
 - searching exams
 - running exams
 - editing exams
 - displaying validation messages

 The class communicates with ExamService to retrieve/update data,
 but it does not directly manage storage.
===========================================================


 IMPORTANT FUNCTIONS:

 renderExamList(user)
 --------------------
 Displays exams depending on the user type.

 teacher:
    -> shows exams with teacher actions:
       Run / Edit / Delete / Export

 student:
    -> future implementation


 renderExamListSearchTeacher(exams)
 ----------------------------------
 Receives an array of exams and creates HTML cards.

 sorterListTeacher(value)
 ------------------------
 Filters exams by title.
 Supports partial search:
 Example:
    Search: "math"
    Matches:
       "Mathematics Exam"
       "Math Quiz"


 renderExamRunner(exam)
 ----------------------
 Displays an exam question by question

 Editing:
 --------
 renderExamEdit(exam)
    Creates the editing interface.

 renderQuestionSelect(exam)
    Updates dropdown with available questions.

 renderQuestion(exam,index)
    Loads selected question into inputs.

 renderEmptyQuestion()
    Clears inputs for creating a new question.

===========================================================
*/


export class ExamUI {
  constructor(examService) {
    // Service layer responsible for CRUD operations
    // and communication with localStorage.
    this.examService = examService;
    // References to existing HTML containers.
    // These elements are used to dynamically insert UI.
    this.examListElement = document.getElementById("examList");
    this.examRunnerElement = document.getElementById("examRunner");
    this.builderMessageElement = document.getElementById("builderMessage");
    this.examEditElement = document.getElementById("examEdit");
    this.examEditButtonsElement = document.getElementById("questionsBTNCard");

  }

  /*
  Displays messages to the user while building/editing exams.

  type:
     success -> green message
     danger  -> red error message
     warning -> yellow message
  */

  showBuilderMessage(message, type = "success") {
    this.builderMessageElement.innerHTML = `
      <div class="alert alert-${type}">
        ${message}
      </div>
    `;
  }

  /*Removes current validation/status messages.*/
  clearBuilderMessage() {
    this.builderMessageElement.innerHTML = "";
  }

  /*
  Creates category buttons dynamically.

  Responsibilities:
  - create category buttons
  - highlight selected category
  - save selection in localStorage
  */
  showExamCategories(categoriesCard, categories) {
    categoriesCard.innerHTML = "";

    categories.forEach(category => {
      const button = document.createElement("button");
      button.textContent = category;
      button.className = "category-btn";

      if (this.selectedCategory === category) { button.classList.add("active"); }

      button.addEventListener("click", () => {

        // Save selected category for later usage
        localStorage.setItem('selected_category', category);
        categoriesCard.querySelectorAll(".category-btn").forEach(btn =>
          btn.classList.remove("active"));
        // Highlight current selection
        button.classList.add("active");

      });

      categoriesCard.appendChild(button);
    });
  }

  /*
  Search logic for teacher exam list.

  Gets all exams from service,
  filters by title,
  sends results to rendering function.
  */
  sorterListTeacher(val) {
    const exams = this.examService.getAllExams();
    // find by TITLE
    let results = exams.filter(exam =>
      exam.title.includes(val)
    );

    this.renderExamListSearchTeacher(results);

  }
  /*
  Entry point for displaying exams.
  Decides which UI to render based on user role.
  */
  renderExamList(user) {
    const exams = this.examService.getAllExams();
    if (user === "teacher") {
      this.renderExamListSearchTeacher(exams);
    }
    else if (user == "student") {
      //this.renderExamListSearchStudent(exams);
      console("future featuer");
    }
    else {
      return;
    }

  }

  /*
  Creates exam cards for teacher view.

  Each card contains:
  - exam information
  - run button
  - edit button
  - delete button
  - export button
  */
  renderExamListSearchTeacher(exams) {

    this.examListElement.innerHTML = "";

    if (exams.length === 0) {
      this.examListElement.innerHTML = `
        <p class="text-muted">No exams saved yet.</p>
      `;
      return;
    }

    // for each Exam object create div and add it to html
    exams.forEach(exam => {
      const div = document.createElement("div");
      div.className = "exam-card mainCard main-text";

      div.innerHTML = `
        <h4>
         ${exam.category} - ${exam.title} -
        ${exam.timeLimit === 0 ? "Unlimited" : `${exam.timeLimit} min`}
        </h4>

        <p class="small-muted">
          Questions: ${exam.getQuestionCount()} 
        </p>

        <p class="small-muted">
          Created: ${new Date(exam.createdAt).toLocaleString()}
        </p>

        <button
          class="btn btn-sm btn-success run-btn base-btn"
          data-id="${exam.id}">
          Run Exam
        </button>

        <button
          class="btn btn-sm btn-danger edit-btn base-btn"
          data-id="${exam.id}">
          Edit
        </button>

        <button
          class="btn btn-sm btn-danger delete-btn base-btn"
          data-id="${exam.id}">
          Delete
        </button>
        <button
          class="btn btn-sm btn-danger export-btn base-btn"
          data-id="${exam.id}">
          Export
        </button>

      `;

      this.examListElement.appendChild(div);
    });
  }



  /*
    ===========================================================
    renderExamRunner(exam)
    Responsible for displaying an exam to the student.
    The function does not modify the exam.
    It only collects the student's answers.
    ===========================================================
    */
  renderExamRunner(exam) {
    // Validate that the requested exam exists
    if (!exam) {
      this.examRunnerElement.innerHTML = `
            <div class="alert alert-danger">
                Exam not found.
            </div> `;
      return;
    }
    // Prevent running empty exams
    if (exam.questions.length === 0) {
      this.examRunnerElement.innerHTML = `
            <div class="alert alert-warning">
                This exam has no questions.
            </div>  `;
      return;
    }
    // Display exam header information
    this.examRunnerElement.innerHTML = `
        <h4>${exam.title}</h4>
        <p class="tsecond-text">
            Answer all questions and submit the exam.
        </p>
    `;

    // creating the question div where the current question will be displayed
    const questionDiv = document.createElement("div");
    questionDiv.className = "question-box";

    // Save user's selected answers
    // Index = question number
    // Value = selected answer index
    const userAnswers = [];
    let questionIndex = 0;


    /*
    Creates the HTML of the current question.

    Called:
    - when exam starts
    - when moving next
    - when moving previous
    */
    function renderQuestionExam() {
      const question = exam.questions[questionIndex];
      questionDiv.innerHTML = `
            <h5> ${questionIndex + 1}. ${question.text} </h5>
            
            ${question.answers.map((answer, answerIndex) => `
            <div style="padding: 5px;">
            <label class="answer-label">
            <input
            type="radio"
            name="question-${questionIndex}"
            value="${answerIndex}">
            <span>${answer}</span>
            </label>
            </div>
            `).join("")}
            `;


      // Needed when user presses "Prev".
      // Restore previous answer if user goes back
      if (userAnswers[questionIndex] !== undefined) {
        const radio = questionDiv.querySelector(
          `input[value="${userAnswers[questionIndex]}"]`
        );
        if (radio) {
          radio.checked = true;
        }
      }
    }


    // Create navigation buttons dynamically
    // Create navigation buttons dynamically.
    const nextButton = document.createElement("button");
    const prevButton = document.createElement("button");
    const submitButton = document.createElement("button");



    nextButton.className = "base-btn btn-primary";
    prevButton.className = "base-btn btn-primary";
    submitButton.className = "base-btn btn-primary";



    nextButton.textContent = "Next";
    prevButton.textContent = "Prev";
    submitButton.textContent = "Submit";


    /*
    Submit button:
    submits it into local storage for later to calculate final score.
    */
    submitButton.addEventListener("click", () => {
      this.checkExam(exam, userAnswers)
    });
    /*
    Next button:
    1. Saves current answer.
    2. Moves to next question.
    3. Re-renders the question.
    */
    nextButton.addEventListener("click", () => {
      const selected = questionDiv.querySelector(
        `input[name="question-${questionIndex}"]:checked`
      );
      // If no answer selected,
      // save -1 as unanswered.
      if (!selected) { userAnswers[questionIndex] = -1; }
      else { userAnswers[questionIndex] = Number(selected.value); }

      if (questionIndex < exam.questions.length - 1) {
        questionIndex++;
        renderQuestionExam();
      }

    });


    /*
    Previous button:
    Saves current answer and returns
    to the previous question.
    */
    prevButton.addEventListener("click", () => {
      const selected = questionDiv.querySelector(
        `input[name="question-${questionIndex}"]:checked`
      );

      if (!selected) { userAnswers[questionIndex] = -1; }
      else { userAnswers[questionIndex] = Number(selected.value); }

      if (questionIndex != 0) {
        questionIndex--;
        renderQuestionExam();
      }

    });
    // Display first question.
    renderQuestionExam();

    // Add generated elements to the page.
    this.examRunnerElement.appendChild(questionDiv);
    this.examRunnerElement.appendChild(prevButton);
    this.examRunnerElement.appendChild(nextButton);
    this.examRunnerElement.appendChild(submitButton);

  }




  /*
===========================================================
checkExam(exam,userAnswers)

Compares student answers with the correct answers.

Calculates:
- number of correct answers
- percentage score

Displays the final result.
===========================================================
*/
  checkExam(exam, userAnswers) {
    let score = 0;
    // Check every question
    exam.questions.forEach((question, questionIndex) => {
      if (question.isCorrect(userAnswers[questionIndex])) {
        score++;
      }
    });

    const resultDiv = document.createElement("div");
    resultDiv.className = "alert alert-info mt-3";

    // Remove exam UI.
    this.examRunnerElement.innerHTML = ``;
    resultDiv.innerHTML = `
      <h5> Exam Result</h5 >
      <p>Score: ${score} / ${exam.questions.length}</p>
      <p>Percent: ${Math.round((score / exam.questions.length) * 100)}%</p>
    `;

    this.examRunnerElement.appendChild(resultDiv);
  }



  /*
  ===========================================================
  renderExamInformationEdit(exam)

  Displays exam-level information editing.

  Editable fields:
  - title
  - time limit

  This function only creates the UI.
  Saving is handled outside by Edit.js.
  ===========================================================
  */
  renderExamInformationEdit(exam) {
    let title = document.getElementById('examInfoCard');
    title.innerHTML = ``;
    title.innerHTML = `< h4 class="main-text" > Exam name ${exam.title}</h4 > 
    <label>Exam title</label>
    <input id="examTitle" class="form-control mb-2 inpt" value="${exam.title}">
    <label>Exam time limit</label>
    <input id="examTimeLimit" class="form-control mb-2 inpt" value="${exam.timeLimit}">
    `;

  }




  /*
 ===========================================================
 renderExamEdit(exam)

 Initializes the exam editing page.

 Responsibilities:
 - render exam information
 - create question dropdown
 - connect dropdown changes
 - display first question
 ===========================================================
 */
  renderExamEdit(exam) {
    this.renderExamInformationEdit(exam)
    const select = document.getElementById("questionSelect");

    this.renderQuestionSelect(exam);
    // When user selects another question,
    // load it into the editor.
    select.onchange = (e) => {
      this.renderQuestion(exam, Number(e.target.value));
    };
    // Load first question initially.
    this.renderQuestion(exam, 0);

  }



  /*
Creates the question dropdown.

Example output:

Question 1
Question 2
Question 3

selectedIndex controls which option is selected.
*/
  renderQuestionSelect(exam, selectedIndex = 0) {
    const select = document.getElementById("questionSelect");

    // clear old options
    select.innerHTML = "";

    exam.questions.forEach((q, index) => {
      const option = document.createElement("option");

      option.value = index;
      option.textContent = `Question ${index + 1}`;

      select.appendChild(option);
    });

    // select the wanted question
    select.value = selectedIndex;
  }



  /*
  Loads an existing question into the editor.
  
  Used when:
  - selecting question from dropdown
  - returning after save
  
  Stores current index in localStorage
  so Edit.js knows which question is being edited.
  */
  renderQuestion(exam, index) {
    const q = exam.questions[index];

    document.getElementById("questionText").value = q.text;
    // Load all four answers
    for (let i = 0; i < 4; i++) {
      document.getElementById(`answer${i}`).value = q.answers[i];
    }

    document.getElementById("correctAnswer").value = q.correctAnswerIndex;
    document.getElementById("questionDiff").value = q.difficulty;
    document.getElementById("diffValue").textContent = q.difficulty;

    const sliderQDiff = document.getElementById("questionDiff");
    const outputQDiff = document.getElementById("diffValue");
    sliderQDiff.value = q.difficulty;

    const currectAnswer = document.getElementById("correctAnswer");
    currectAnswer.value = q.correctAnswerIndex;
    // Remember current question
    localStorage.setItem('currentQuestionIndex', index);
  }



  /*
  Clears the editor for creating a new question.

  Does not add the question to the exam.
  The question is added only after Save is pressed.
  */
  renderEmptyQuestion() {

    document.getElementById("questionText").value = "";

    for (let i = 0; i < 4; i++) {
      document.getElementById(`answer${i}`).value = "";
    }

    document.getElementById("correctAnswer").value = "";
    document.getElementById("questionDiff").value = 0;
    document.getElementById("diffValue").textContent = 0;
  }

}