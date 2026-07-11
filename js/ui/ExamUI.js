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
      button.className = "category-btn base-btn";

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
      this.renderExamListSearchStudent(exams);
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
          Exam ID: ${exam.id} 
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
          class="btn btn-sm export-btn base-btn"
          data-id="${exam.id}">
          Export
        </button>
        <button
          class="btn btn-sm btn-danger statistics-btn base-btn"
          data-id="${exam.id}">
          Statistics
        </button>

      `;

      this.examListElement.appendChild(div);
    });
  }

  /*
  Creates exam cards for student view.
  
  If the student has not completed the exam:
  - displays Start Exam
  
  If the student has already completed the exam:
  - displays View My Answers
  */
  renderExamListSearchStudent(exams) {
    this.examListElement.innerHTML = "";

    const user = JSON.parse(
      localStorage.getItem("activeUser")
    );

    if (!user) {
      this.examListElement.innerHTML = `
      <p class="text-danger">Active user was not found.</p>
    `;
      return;
    }

    const examResults = Array.isArray(user.examsResults)
      ? user.examsResults
      : [];

    if (exams.length === 0) {
      this.examListElement.innerHTML = `
      <p class="text-muted">No exams available.</p>
    `;
      return;
    }

    exams.forEach(exam => {
      const completedResult = examResults.find(
        result => result.examID === exam.id
      );

      const div = document.createElement("div");
      div.className = "exam-card mainCard main-text";

      const actionButton = completedResult
        ? `
        <button
          class="btn btn-info view-answers-btn base-btn"
          data-id="${exam.id}">
          View My Answers
        </button>
      `
        : `
        <button
          class="btn btn-success run-btn base-btn"
          data-id="${exam.id}">
          Start Exam
        </button>
      `;

      div.innerHTML = `
      <h4>${exam.category} - ${exam.title}</h4>

      <p class="small-muted">
        Questions: ${exam.getQuestionCount()}
      </p>

      <p class="small-muted">
        Time limit:
        ${exam.timeLimit === 0
          ? "Unlimited"
          : `${exam.timeLimit} min`
        }
      </p>

      ${completedResult
          ? `
            <p class="small-muted">
              Score: ${completedResult.percentage}%
            </p>
          `
          : ""
        }

      ${actionButton}
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
  renderExamRunner(exam, onFinish) {
    let results = {};
    // Called when the exam is actually finished (submit or time up),
    // so the caller can save stats/results at the right moment.
    this.onFinish = onFinish;
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
    for (let i = 0; i < exam.getQuestionCount(); i++) {
      userAnswers[i] = -1;
    }
    let questionIndex = 0;


    /*
    Creates the HTML of the current question.

    Called:
    - when exam starts
    - when moving next
    - when moving previous
    */
    let timeLeft = exam.timeLimit * 60; // convert minutes to seconds
    let timerInterval;

    /*
     arrow function keeps the same "this"
    */
    const updateTimer = () => {

      //calculating the timer
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      // updating the thml
      document.getElementById("timerText").textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

      // if time is up stop the interval function  and automatically call for the check exam
      if (timeLeft <= 0) {

        clearInterval(timerInterval);

        alert("Time is up!");

        results.timeLeft = timeLeft;

        results.userAnswers = userAnswers;

        //results.score = this.checkExam(exam, userAnswers);
        // localStorage.setItem("lastResult", JSON.stringify(results));
        this.checkExam(exam, results);
      }
      // update timer
      timeLeft--;
    };

    if (exam.timeLimit > 0) {
      updateTimer();
      timerInterval = setInterval(() => { updateTimer(); }, 1000);

    }

    function renderQuestionExam() {
      const question = exam.questions[questionIndex];
      questionDiv.innerHTML = `
            <h5> ${questionIndex + 1}. ${question.text} </h5>
            <p class="question-points">${question.difficulty} points</p>
            
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

    /*      const nextButton = document.getElementById("nextBTN");
      const prevButton = document.getElementById("prevBTN");
      const submitButton = document.getElementById("submitBTN");*/

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
      const confirmed = confirm("Are you sure you want to submit?");
      if (!confirmed) { return; }

      const selected = questionDiv.querySelector(
        `input[name="question-${questionIndex}"]:checked`
      );
      // If no answer selected,
      // save -1 as unanswered.
      if (!selected) { userAnswers[questionIndex] = -1; }
      else { userAnswers[questionIndex] = Number(selected.value); }
      results.timeLeft = timeLeft;
      clearInterval(timerInterval);

      results.userAnswers = userAnswers;
      //results.score = this.checkExam(exam, userAnswers);
      //localStorage.setItem("lastResult", JSON.stringify(results));
      this.checkExam(exam, results);
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
    let examBtns = document.getElementById("examButtons");
    this.examRunnerElement.appendChild(questionDiv);
    examBtns.appendChild(prevButton);
    examBtns.appendChild(nextButton);
    examBtns.appendChild(submitButton);

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
  checkExam(exam, results) {
    let score = 0;
    let answersCount = 0;
    let higestScore = 0;

    // Check every question
    exam.questions.forEach((question, questionIndex) => {
      higestScore += question.difficulty;
      if (question.isCorrect(results.userAnswers[questionIndex])) {
        score += question.difficulty;
      }
      if (results.userAnswers[questionIndex] != -1) {
        answersCount++;
      }
    });

    const resultDiv = document.createElement("div");
    resultDiv.className = "alert alert-info mt-3";

    // Remove exam UI.
    this.examRunnerElement.innerHTML = ``;
    resultDiv.innerHTML = `
      <h5> Exam Result</h5 >
      <p>Score: ${score} / ${higestScore}</p>
      <p>Amount of answered Questions: ${answersCount} / ${exam.questions.length}</p>
      <p>Score: ${Math.round((score / higestScore) * 100)}%</p>


    `;
    let examBtns = document.getElementById("examButtons");
    examButtons.innerHTML = `      
    <button id="resultsBTN" class="base-btn">watch questions</button>
    <button id="returnBTN" class="base-btn">Return</button>
      `;



    results.score = score;
    results.examMaxScore = higestScore;
    results.answersCount = answersCount;
    this.examRunnerElement.appendChild(resultDiv);
    localStorage.setItem("lastResult", JSON.stringify(results));

    // The exam is truly done now, notify the caller with the final results.
    if (this.onFinish) {
      this.onFinish(results);
    }

    let returnBTN = document.getElementById("returnBTN");

    returnBTN.addEventListener('click', () => {
      // returns to the home page by the user type
      let user = JSON.parse(localStorage.getItem('activeUser'));
      window.location.href = `../${user.type}/Home/home.html`;
    });

    let resultsBTN = document.getElementById("resultsBTN");

    resultsBTN.addEventListener('click', () => {
      // Switch to the read-only, color-coded review of this attempt.
      // Clear the current buttons first so renderExamResults doesn't
      // append its navigation on top of the result screen's buttons.
      examBtns.innerHTML = "";
      this.renderExamResults(exam, results);
    });

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

    // Field is 1-based (1-4); stored index is 0-based, so display +1.
    document.getElementById("correctAnswer").value = q.correctAnswerIndex + 1;
    document.getElementById("questionDiff").value = q.difficulty;
    document.getElementById("diffValue").textContent = q.difficulty;

    const sliderQDiff = document.getElementById("questionDiff");
    const outputQDiff = document.getElementById("diffValue");
    sliderQDiff.value = q.difficulty;

    const currectAnswer = document.getElementById("correctAnswer");
    currectAnswer.value = q.correctAnswerIndex + 1;
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


  /*
  ===========================================================
  renderExamResults(exam, results)

  Read-only review of a completed exam attempt.

  Mirrors the layout of renderExamRunner (question by question,
  Prev / Next navigation) but:
  - inputs are disabled, so nothing can be changed
  - the correct answer is highlighted in green
  - the student's answer, when wrong, is highlighted in red

  `results.userAnswers` holds the student's selected answer index
  per question (-1 means the question was left unanswered).
  ===========================================================
  */
  renderExamResults(exam, results) {
    // Validate that the requested exam exists
    if (!exam) {
      this.examRunnerElement.innerHTML = `
            <div class="alert alert-danger">
                Exam not found.
            </div> `;
      return;
    }
    // Prevent reviewing empty exams
    if (exam.questions.length === 0) {
      this.examRunnerElement.innerHTML = `
            <div class="alert alert-warning">
                This exam has no questions.
            </div>  `;
      return;
    }

    // The student's answers. Fall back to an empty array so a missing
    // result set simply shows every question as unanswered instead of crashing.
    const userAnswers = (results && Array.isArray(results.userAnswers))
      ? results.userAnswers
      : [];

    // Display exam header information
    this.examRunnerElement.innerHTML = `
        <h4>${exam.title}</h4>
        <p class="tsecond-text">
            Reviewing your answers.
            <span style="color: green;">Green</span> is the correct answer,
            <span style="color: red;">red</span> is your answer.
        </p>
    `;

    // creating the question div where the current question will be displayed
    const questionDiv = document.createElement("div");
    questionDiv.className = "question-box";

    let questionIndex = 0;

    /*
    Creates the HTML of the current question in read-only mode.
    Colors each answer:
    - correct answer  -> green
    - student's wrong answer -> red
    */
    function renderQuestionReview() {
      const question = exam.questions[questionIndex];
      const userAnswer = userAnswers[questionIndex];

      // -1 (or a missing entry) means the student left this question blank.
      const notAnswered = userAnswer === undefined || userAnswer === -1;

      questionDiv.innerHTML = `
            <h5> ${questionIndex + 1}. ${question.text} </h5>
            <p class="question-points">${question.difficulty} points</p>

            ${question.answers.map((answer, answerIndex) => {
        const isCorrect = answerIndex === question.correctAnswerIndex;
        const isUserAnswer = answerIndex === userAnswer;

        // The correct answer is always green. The student's answer is
        // only marked red when it differs from the correct one.
        let labelClass = "answer-label";
        if (isCorrect) { labelClass += " answer-correct"; }
        else if (isUserAnswer) { labelClass += " answer-wrong"; }

        return `
            <div style="padding: 5px;">
            <label class="${labelClass}">
            <input
            type="radio"
            name="question-${questionIndex}"
            value="${answerIndex}"
            ${isUserAnswer ? "checked" : ""}
            disabled>
            <span>${answer}</span>
            ${isUserAnswer ? `<span class="answer-tag">(your answer)</span>` : ""}
            </label>
            </div>
            `;
      }).join("")}

            ${notAnswered ? `<p class="not-answered-note">You didn't pick an answer for this question.</p>` : ""}
            `;
    }

    // Create navigation buttons dynamically.
    const nextButton = document.createElement("button");
    const prevButton = document.createElement("button");
    const returnButton = document.createElement("button");

    nextButton.className = "base-btn btn-primary";
    prevButton.className = "base-btn btn-primary";
    returnButton.className = "base-btn";

    nextButton.textContent = "Next";
    prevButton.textContent = "Prev";
    returnButton.textContent = "Return";

    /* Next button: move forward through the questions. */
    nextButton.addEventListener("click", () => {
      if (questionIndex < exam.questions.length - 1) {
        questionIndex++;
        renderQuestionReview();
      }
    });

    /* Previous button: move back through the questions. */
    prevButton.addEventListener("click", () => {
      if (questionIndex != 0) {
        questionIndex--;
        renderQuestionReview();
      }
    });

    /* Return button: back to the user's home page. */
    returnButton.addEventListener("click", () => {
      const user = JSON.parse(localStorage.getItem("activeUser"));
      window.location.href = `../${user.type}/Home/home.html`;
    });

    // Display first question.
    renderQuestionReview();

    // Add generated elements to the page.
    let examBtns = document.getElementById("examButtons");
    this.examRunnerElement.appendChild(questionDiv);

    examBtns.appendChild(prevButton);
    examBtns.appendChild(nextButton);
    examBtns.appendChild(returnButton);
  }
}