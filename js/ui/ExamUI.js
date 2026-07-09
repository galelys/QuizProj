/*IMPORTANT!!
  the render list functions 

  ! renderSearchListTeacher( exams) - the search UI for the teacher
  recives the exams list that is needed to show

  ! renderExamList(val) - shows all the exams in a list, 
  recives a string of the user that requesting the list 

  ! sorterListTeacher - 
  recives the string that was inserted in the search bar
  it filters the exams by that, works alsowith partially dosent have to be exact
  then calls renderSearchListTeacher( exams)

  ! in the builder, there are the id names for the needed divs to insert there the exams 

*/


export class ExamUI {
  constructor(examService) {
    //get service for CRUD Operations on Exams
    this.examService = examService;
    //Get References for UI Elements
    this.examListElement = document.getElementById("examList");
    this.examRunnerElement = document.getElementById("examRunner");
    this.builderMessageElement = document.getElementById("builderMessage");
    this.examEditElement = document.getElementById("examEdit");
    this.examEditButtonsElement = document.getElementById("questionsBTNCard");

  }

  showBuilderMessage(message, type = "success") {
    this.builderMessageElement.innerHTML = `
      <div class="alert alert-${type}">
        ${message}
      </div>
    `;
  }

  clearBuilderMessage() {
    this.builderMessageElement.innerHTML = "";
  }
  /* creates buttons adds the categories and adds the currect color depending on the status of the button 
  also saves the category in local storage */
  showExamCategories(categoriesCard, categories) {
    categoriesCard.innerHTML = "";

    categories.forEach(category => {
      const button = document.createElement("button");
      button.textContent = category;
      button.className = "category-btn";

      if (this.selectedCategory === category) {
        button.classList.add("active");
      }

      button.addEventListener("click", () => {
        //this.selectedCategory = category; 
        localStorage.setItem('selected_category', category);
        categoriesCard.querySelectorAll(".category-btn").forEach(btn =>
          btn.classList.remove("active"));
        button.classList.add("active");

      });

      categoriesCard.appendChild(button);
    });
  }

  sorterListTeacher(val) {
    const exams = this.examService.getAllExams();
    // find by TITLE
    let results = exams.filter(exam =>
      exam.title.includes(val)
    );

    this.renderExamListSearchTeacher(results);

  }

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


      `;

      this.examListElement.appendChild(div);
    });
  }

  renderExamRunner(exam) {
    if (!exam) {
      this.examRunnerElement.innerHTML = `
        <div class="alert alert-danger">
          Exam not found.
        </div>
      `;
      return;
    }

    if (exam.questions.length === 0) {
      this.examRunnerElement.innerHTML = `
        <div class="alert alert-warning">
          This exam has no questions.
        </div>
      `;
      return;
    }

    this.examRunnerElement.innerHTML = `
      <h4>${exam.title}</h4>
      <p class="text-muted">
        Answer all questions and submit the exam.
      </p>
    `;

    exam.questions.forEach((question, questionIndex) => {
      const questionDiv = document.createElement("div");
      questionDiv.className = "question-box";

      questionDiv.innerHTML = `
        <h5>${questionIndex + 1}. ${question.text}</h5>

        ${question.answers.map((answer, answerIndex) => `
          <label class="answer-label">
            <input
              type="radio"
              name="question-${questionIndex}"
              value="${answerIndex}">
            ${answer}
          </label>
        `).join("")}
      `;

      this.examRunnerElement.appendChild(questionDiv);
    });

    const submitButton = document.createElement("button");
    submitButton.className = "btn btn-primary";
    submitButton.textContent = "Submit Exam";

    submitButton.addEventListener("click", () => {
      this.checkExam(exam);
    });

    this.examRunnerElement.appendChild(submitButton);
  }

  checkExam(exam) {
    let score = 0;

    exam.questions.forEach((question, questionIndex) => {
      const selectedAnswer = document.querySelector(
        `input[name="question-${questionIndex}"]:checked`
      );

      if (!selectedAnswer) {
        return;
      }

      const userAnswerIndex = Number(selectedAnswer.value);

      if (question.isCorrect(userAnswerIndex)) {
        score++;
      }
    });

    const resultDiv = document.createElement("div");
    resultDiv.className = "alert alert-info mt-3";

    resultDiv.innerHTML = `
      <h5>Exam Result</h5>
      <p>Score: ${score} / ${exam.questions.length}</p>
      <p>Percent: ${Math.round((score / exam.questions.length) * 100)}%</p>
    `;

    this.examRunnerElement.appendChild(resultDiv);
  }

  renderExamInformationEdit(exam) {
    let title = document.getElementById('examInfoCard');
    title.innerHTML = ``;
    title.innerHTML = `<h4 class="main-text"> Exam name ${exam.title}</h4> 
    <label>Exam title</label>
    <input id="examTitle" class="form-control mb-2 inpt" value="${exam.title}">
    <label>Exam time limit</label>
    <input id="examTimeLimit" class="form-control mb-2 inpt" value="${exam.timeLimit}">
    `;

  }

  renderExamEdit(exam) {
    this.renderExamInformationEdit(exam)
    const select = document.getElementById("questionSelect");

    this.renderQuestionSelect(exam);

    select.onchange = (e) => {
      this.renderQuestion(exam, Number(e.target.value));
    };

    this.renderQuestion(exam, 0);

  }

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

  renderQuestion(exam, index) {
    const editor = document.getElementById("questionEditor");
    const q = exam.questions[index];
    editor.innerHTML = ``;
    editor.innerHTML = `
      <label class="form-label second-text">Question: </label>
      <input id="questionText" class="form-control mb-2 inpt" value="${q.text}">

    ${q.answers.map((a, i) => `
      <label class="form-label second-text">Answer ${i + 1}</label>
      <input id="answer${i}" class="form-control mb-2 edit-answer inpt"
             data-index="${i}"
             value="${a}">
    `).join("")} 
    `;

    const sliderQDiff = document.getElementById("questionDiff");
    const outputQDiff = document.getElementById("diffValue");
    sliderQDiff.value = q.difficulty;

    const currectAnswer = document.getElementById("correctAnswer");
    currectAnswer.value = q.correctAnswerIndex;
    localStorage.setItem('currentQuestionIndex', index);
  }


  // function for rendering the edit file
  /*renderExamEdit(exam) {
    this.examEditElement.innerHTML = "";
    if (!exam) {
      this.examEditElement.innerHTML = `
        <div class="alert alert-danger">
          Exam not found.
        </div>
      `;
      return;
    }
    if (exam.questions.length === 0) {
      this.examEditElement.innerHTML = `
        <div class="alert alert-warning">
          This exam has no questions.
        </div>
      `;
      return;
    }
    let title = document.getElementById('examName');
    title.innerHTML = `
      <h4 class="main-text">EDIT: ${exam.title}</h4>
  `;

    const select = document.getElementById("questionSelect");

    exam.questions.forEach((q, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = `Question ${index + 1}`;
      select.appendChild(option);

    });

    const editor = document.getElementById("questionEditor");

    function renderQuestion(index) {
      const q = exam.questions[index];

      editor.innerHTML = `
    <input id="editText" class="form-control mb-2 inpt" value="${q.text}">

    ${q.answers.map((a, i) => `
      <input class="form-control mb-2 edit-answer inpt"
             data-index="${i}"
             value="${a}">
    `).join("")}
    `;
    }

    select.addEventListener("change", (e) => {
      renderQuestion(Number(e.target.value));
    });

    renderQuestion(0);

  }*/



}