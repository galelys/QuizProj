# QuizProj — Technical Document

Client-side **Exam Builder & Runner** for a Web Development course.
Authors: **Gal Elisha (324052133)** and **Yasmin Shapochkin**.

The whole application runs in the browser only. There is **no server and no database** —
all data is persisted in the browser's **`localStorage`** as JSON. The code is built on
three required foundations from the course brief: **ES Modules**, **OOP classes**, and **JSON + localStorage**.

---

## 1. GitHub & Deploy

| Item | Value |
|------|-------|
| **GitHub repository** | https://github.com/galelys/QuizProj |
| **Main branch** | `main` |
| **Development branches** | Each feature/module was developed on its own branch (e.g. `CREATE-EXAM`, `EDIT-EXAM`, `EXAMS-LIST`, `EXAM-RUN`, `STUDENT`, `Y-LOG-IN`, `menu-buttons`, `ui-upgrades`) and merged into `main`, so every commit represents a development step (as required by the brief). |
| **Deploy (GitHub Pages)** | Expected URL: `https://galelys.github.io/QuizProj/app/index.html` |

> **Note on deploy:** the repository does not yet contain a Pages configuration file
> (`.github/workflows`, `CNAME`, etc.). To publish, enable **GitHub Pages → Deploy from branch → `main` / root**
> in the repository settings. Because the app uses **ES Modules** (`<script type="module">`),
> it must be served over **http(s)** — opening the files directly with `file://` will block the
> module imports. During development you can serve locally, e.g. `python -m http.server` or the
> VS Code *Live Server* extension.

The real application lives under the **`app/`** folder. Its entry point is **`app/index.html`**.

---

## 2. Repository structure

```
QuizProj/
├── index.html            # Standalone single-page prototype (old "Exam Builder & Runner")
├── pageA.html/pageB.html # Early navigation exercise (pass value via URL query string)
│
├── js/                   # Shared ES Modules used by the whole app
│   ├── app.js            # Logic for the root index.html prototype
│   ├── models/           # OOP domain classes
│   │   ├── exam.js       # Exam class
│   │   ├── Question.js   # Question class
│   │   └── user.js       # User class
│   ├── services/         # Data-access layer (localStorage)
│   │   ├── ExamService.js
│   │   ├── UserService.js
│   │   └── MenuButtons.js
│   └── ui/               # Presentation layer
│       ├── ExamUI.js     # Renders exam lists, runner, editor
│       └── theme.js      # Dark / light mode toggle
│
├── css/                  # Shared styles
│   ├── baseStyle.css     # Global styling + dark-mode rules
│   ├── login.css
│   └── style.css
│
└── app/                  # THE ACTUAL MULTI-PAGE APPLICATION
    ├── index.html/.js    # Landing page ("start")
    ├── auth/             # Login + Register
    │   ├── login.html/.js
    │   └── register.html/.js
    ├── student/          # Student area
    │   └── home.html/.js
    ├── teacher/          # Teacher area
    │   ├── nav.js        # Shared teacher navigation bar (Create / Exams / Home)
    │   ├── Home/home.html/.js
    │   ├── create/createExam.html + app.js
    │   ├── ExamsList/ExamsList.html/.js/.css
    │   └── Edit/Edit.html/.js
    └── ExamRunner/ExamRunner.html/.js/.css
```

**Architectural layers (used across the whole `app/`):**

```
HTML page  →  page controller (*.js)  →  Service (ExamService / UserService)  →  localStorage
                       │
                       └────────────→  ExamUI / theme  (DOM rendering)
```

---

## 3. Pages & Navigation

The application is a **multi-page website**: navigation is done by changing
`window.location.href`. Data needed by the next page is passed either through the
**URL query string** (`?id=...`) or through **`localStorage`** (e.g. `examID`).

### Navigation map

```
                         app/index.html  (landing – "start")
                                │  click "start"
                                ▼
                       app/auth/login.html  ◄──────────┐
                        │            │                  │ "login"
              "register"│            │ successful login │
                        ▼            │                  │
              app/auth/register.html─┘                  │
                        │  after register / after login │
        ┌───────────────┴───────────────┐               │
        ▼ (type === "teacher")           ▼ (type==="student")
 app/teacher/Home/home.html      app/student/home.html
        │  (shared nav bar: Create / Exams / Home)
        ├──────────────┬──────────────┐
        ▼              ▼              ▼
 create/            ExamsList/     Home/
 createExam.html    ExamsList.html home.html
                        │
        ┌───────────────┼────────────────┐
        ▼ "Edit"        ▼ "Run"          ▼ "Export"
   Edit/Edit.html   ExamRunner/       (downloads a
                    ExamRunner.html    .json file)
```

### Page-by-page

| Page | File | Purpose | Navigates to |
|------|------|---------|--------------|
| **Landing** | `app/index.html` | Welcome screen with a **start** button. | `auth/login.html` |
| **Login** | `app/auth/login.html` | Sign in with **ID + password**. Validates empty fields, calls `UserService.login`. | Teacher/Student home (by role), or `register.html` |
| **Register** | `app/auth/register.html` | Create a new user (radio: **teacher/student**, name, id, password). Calls `UserService.addUser`. | Teacher/Student home (by role) |
| **Teacher Home** | `app/teacher/Home/home.html` | Greets the logged-in teacher. Shows the shared teacher nav bar. | Create / Exams / Home |
| **Create Exam** | `app/teacher/create/createExam.html` | Build a new exam: title, category, time limit, and add multiple questions (text, 4 answers, correct index, difficulty). Calls `ExamService.saveExam`. | via nav bar |
| **Exams List** | `app/teacher/ExamsList/ExamsList.html` | Lists all saved exams as cards. Search/clear by title. Each card → **Run / Edit / Delete / Export**. | ExamRunner / Edit |
| **Edit Exam** | `app/teacher/Edit/Edit.html` | Edit exam metadata and per-question content (select, edit, add, delete question). | via nav bar |
| **Exam Runner** | `app/ExamRunner/ExamRunner.html` | Runs an exam question-by-question (Prev / Next / Submit), then shows score & percentage. | — |
| **Student Home** | `app/student/home.html` | Greets the logged-in student. (Student exam-taking flow is a future feature.) | — |

The **teacher navigation bar** is injected on every teacher page by `app/teacher/nav.js`,
which renders three buttons (**Create**, **Exams**, **Home**) into the `#menuBTNS` container
and wires their `click` handlers to the corresponding `window.location.href`.

> **Legacy pages** (not part of the main flow): the root `index.html` + `js/app.js` are an
> earlier single-page prototype of the builder/runner; `pageA.html` / `pageB.html` are an early
> exercise demonstrating passing a value between pages via the URL query string.

---

## 4. JSON Data Format (localStorage)

All persistent data is stored under a few **string keys** in `localStorage`. Objects are
serialized with `JSON.stringify` on write and rebuilt into class instances with `JSON.parse`
on read (the services re-hydrate plain objects back into `Exam` / `Question` instances).

### Storage keys

| Key | Written by | Content |
|-----|-----------|---------|
| `"exams"` | `ExamService` | Array of exam objects (see below). |
| `"users"` | `UserService` | Array of user objects. |
| `"theme"` | `theme.js` | `"dark"` or `"light"`. |
| `"examID"` | ExamsList page | ID of the exam selected for Run/Edit (passed to the next page). |
| `"selected_category"` | `ExamUI` / Create page | Category chosen while building an exam (temporary). |
| `"currentQuestionIndex"` | `ExamUI` / Edit page | Index of the question currently being edited (temporary). |
| `"activeUser"` | (read by teacher home) | The logged-in user object. |

### `exams` — one exam object

```json
{
  "id": "3f2a9c1e-8b4d-4e6a-9f2c-1d7e0a5b6c88",
  "title": "JavaScript Basics",
  "questions": [
    {
      "id": "a1b2c3d4-...",
      "text": "What is const?",
      "answers": ["A block-scoped constant", "A loop", "A function", "A CSS rule"],
      "correctAnswerIndex": 0,
      "difficulty": 3
    }
  ],
  "createdAt": "2026-07-10T12:00:00.000Z",
  "timeLimit": 30,
  "category": "Java"
}
```

**Field notes**
- `id` — generated with `crypto.randomUUID()`.
- `answers` — always an array of **4** strings (multiple-choice).
- `correctAnswerIndex` — **0-based** index of the correct answer (the UI collects a 1–4 number and stores `number − 1`).
- `difficulty` — integer `0–10` (from a slider).
- `timeLimit` — minutes; `0` means **unlimited**.
- `category` — one of `ExamService.categories`: `Java, c++, Math, English, History, Python`.
- `createdAt` — ISO timestamp.

The whole array is stored as: `localStorage.setItem("exams", JSON.stringify(examsArray))`.

### `users` — one user object

```json
{
  "id": "123456789",
  "name": "gal",
  "password": "1234",
  "type": "teacher"
}
```

- `type` — `"teacher"` or `"student"`; determines which home page the user is routed to.
- `id` — user-entered ID; used as the login key and passed between pages via `?id=`.

### Exported exam file

The **Export** button (`ExamsList.js → exportExam`) serializes a single exam with
`JSON.stringify(exam, null, 2)`, wraps it in a `Blob` of type `application/json`, and triggers
a download named `<exam title>.json`. The file has the same shape as one `exams[]` entry above.

---

## 5. Main Classes (UML)

### 5.1 Class diagram

```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│            Exam               │        │           Question            │
├───────────────────────────────┤        ├───────────────────────────────┤
│ + id: string (UUID)           │ 1    * │ + id: string (UUID)           │
│ + title: string               │◄───────│ + text: string                │
│ + questions: Question[]       │        │ + answers: string[4]          │
│ + createdAt: string (ISO)     │        │ + correctAnswerIndex: number  │
│ + timeLimit: number           │        │ + difficulty: number          │
│ + category: string            │        ├───────────────────────────────┤
├───────────────────────────────┤        │ + isCorrect(userIdx): bool    │
│ + addQuestion(q)              │        │ + updateQuestion(text,answers,│
│ + removeQuestion(index)       │        │        correctIdx, difficulty)│
│ + updateQuestion(index, q)    │        └───────────────────────────────┘
│ + getQuestionCount(): number  │
│ + addTimeLimit(time)          │
│ + addCategory(category)       │
│ + updateExam(title, timeLimit)│
└───────────────────────────────┘

┌───────────────────────────────┐        ┌───────────────────────────────┐
│            User               │        │            theme (module)     │
├───────────────────────────────┤        ├───────────────────────────────┤
│ + id: string                  │        │ + initThemeToggle()           │
│ + name: string                │        │   (reads/writes "theme" key)  │
│ + password: string            │        └───────────────────────────────┘
│ + type: "teacher"|"student"   │
├───────────────────────────────┤
│ + checkPassword(input): bool  │
│ + getUserName(): string       │
└───────────────────────────────┘
```

### 5.2 Service & UI layer

```
┌────────────────────────────────────────────┐
│                ExamService                 │  ── talks to localStorage["exams"]
├────────────────────────────────────────────┤
│ - storageKey = "exams"                     │
│ - categories: string[]                     │
├────────────────────────────────────────────┤
│ + getAllExams(): Exam[]        (re-hydrate) │
│ + saveExam(exam)          (insert / update)│
│ + deleteExam(examId)                       │
│ + getExamById(examId): Exam                │
│ + getCategories(): string[]                │
│ + getExamsByCategory(category): Exam[]     │
│ + clearAllExams()                          │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│                UserService                 │  ── talks to localStorage["users"]
├────────────────────────────────────────────┤
│ - storageKey = "users"                     │
├────────────────────────────────────────────┤
│ + addUser(user): bool                      │
│ + findUserByName(name): User|null          │
│ + findUserById(id): User|null              │
│ + login(id, password): User|null           │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│                  ExamUI                    │  ── owns DOM rendering; uses ExamService
├────────────────────────────────────────────┤
│ - examService: ExamService                 │
│ - (DOM element references)                 │
├────────────────────────────────────────────┤
│ + renderExamList(userType)                 │
│ + renderExamListSearchTeacher(exams)       │
│ + sorterListTeacher(value)                 │
│ + renderExamRunner(exam)                   │
│ + checkExam(exam, userAnswers)             │
│ + renderExamEdit(exam)                     │
│ + renderExamInformationEdit(exam)          │
│ + renderQuestionSelect(exam, selectedIdx)  │
│ + renderQuestion(exam, index)              │
│ + renderEmptyQuestion()                    │
│ + showExamCategories(card, categories)     │
│ + showBuilderMessage(msg, type)            │
└────────────────────────────────────────────┘
```

### 5.3 Dependencies

```
Page controllers (app.js, Edit.js, ExamsList.js, ExamRunner.js, login.js, register.js)
        │  import
        ├──► Exam, Question, User         (models)
        ├──► ExamService / UserService    (services)  ──► localStorage
        ├──► ExamUI                        (ui)        ──► DOM  +  ExamService
        └──► initThemeToggle               (ui/theme)  ──► localStorage["theme"]
```

**Design principle:** models hold data + behaviour, services own persistence (localStorage),
UI owns DOM rendering, and page controllers wire events together. The UI never touches
`localStorage` directly — it always goes through `ExamService`.

---

## 6. Central Flows (who calls whom, what is passed)

### Flow A — Register & Login (authentication)

```
register.html                     login.html
   │ user fills form                  │ user enters id + password
   ▼                                  ▼
register.js.registser()           login.js.login()
   │ new User(name,password,type,id)  │ validate not-empty
   │ UserService.addUser(user)        │ UserService.login(id, password)
   │   └► localStorage["users"].push  │   └► findUserById(id) → compare password
   ▼                                  ▼
goToPage(id)                       success? → goToPage(id)
   │ findUserById(id)                 │ findUserById(id) → read user.type
   │ user.type ? teacher : student    ▼
   ▼                              teacher → app/teacher/Home/home.html?id=...
redirect with ?id=<id>           student → app/student/home.html?id=...
```

- **Passed forward:** the user **id** via the URL query string (`?id=<id>`).
- The destination home page reads `?id=` (or `activeUser`) and displays `welcome <name>`.

### Flow B — Create an Exam (teacher)

```
createExam.html + app.js
   │ "Add Question" click
   │   validate title / question text / 4 answers / correct 1–4
   │   currentExam ??= new Exam(title)
   │   q = new Question(text, answers, correctIdx, difficulty)
   │   currentExam.addQuestion(q)          ← builds exam in memory
   │
   │ "Save Exam" click
   │   currentExam.category   = localStorage["selected_category"]
   │   currentExam.timeLimit  = Number(timeLimit input)
   │   ExamService.saveExam(currentExam)
   │        └► getAllExams() → find by id → push/replace → JSON.stringify → localStorage["exams"]
   ▼
   ExamUI.showBuilderMessage("Exam saved successfully.")
```

- Categories are rendered by `ExamUI.showExamCategories(...)`; the clicked category is stored
  temporarily in `localStorage["selected_category"]` and consumed on save.

### Flow C — List, Search, Export, Delete (teacher)

```
ExamsList.html + ExamsList.js
   │ on load: ExamUI.renderExamList("teacher")
   │            └► ExamService.getAllExams() → renderExamListSearchTeacher(exams)
   │                  builds a card per exam with Run / Edit / Delete / Export buttons
   │
   │ search():  ExamUI.sorterListTeacher(value)
   │              └► getAllExams().filter(title.includes(value)) → render
   │
   │ one delegated click listener on #examList reads event.target.dataset.id:
   │   • run-btn    → localStorage["examID"]=id → go to ExamRunner.html
   │   • edit-btn   → localStorage["examID"]=id → go to Edit.html
   │   • delete-btn → confirm() → ExamService.deleteExam(id) → re-render
   │   • export-btn → exportExam(exam) → JSON.stringify → Blob → download <title>.json
```

- **Passed forward to Run/Edit:** the selected exam **id** via `localStorage["examID"]`.
- Uses **event delegation**: a single listener on the list container handles all card buttons.

### Flow D — Run an Exam & score (the core exam flow)

```
ExamRunner.html + ExamRunner.js
   │ examID = localStorage["examID"]
   │ exam   = ExamService.getExamById(examID)     ← re-hydrated Exam + Questions
   │ ExamUI.renderExamRunner(exam)
   ▼
ExamUI.renderExamRunner(exam)
   │ userAnswers = []          (index = question no., value = chosen answer index; -1 = unanswered)
   │ questionIndex = 0
   │ renderQuestionExam()      → shows current question + 4 radio options
   │
   │ Next  → save selected value into userAnswers[questionIndex], questionIndex++, re-render
   │ Prev  → save selected value, questionIndex--, re-render (restores previous choice)
   │ Submit→ ExamUI.checkExam(exam, userAnswers)
   ▼
ExamUI.checkExam(exam, userAnswers)
   │ score = 0
   │ for each question: if question.isCorrect(userAnswers[i]) score++
   │        (Question.isCorrect compares userIdx === correctAnswerIndex)
   ▼
   render "Score: score / total"  and  "Percent: round(score/total*100)%"
```

- **What passes:** the exam id (via `localStorage`) → a re-hydrated `Exam` object → the in-memory
  `userAnswers` array → a final numeric score/percentage rendered to the page.

### Flow E — Edit an Exam / its Questions (teacher)

```
Edit.html + Edit.js
   │ examID = localStorage["examID"]; exam = ExamService.getExamById(examID)
   │ ExamUI.renderExamEdit(exam)
   │     ├─ renderExamInformationEdit(exam)   (title + time limit inputs)
   │     ├─ renderQuestionSelect(exam)         (dropdown of "Question N")
   │     └─ renderQuestion(exam, 0)            (loads Q into inputs; stores currentQuestionIndex)
   │
   │ dropdown change → renderQuestion(exam, index) → localStorage["currentQuestionIndex"]=index
   │
   │ "Save Changes" (saveQuestion):
   │     index = localStorage["currentQuestionIndex"]
   │     q = new Question(text, answers, correctNumber, difficulty)
   │     isNewQuestion ? exam.addQuestion(q) : exam.updateQuestion(index, q)
   │     ExamService.saveExam(exam) → re-render selector + question
   │
   │ "Add New Question": isNewQuestion=true; currentQuestionIndex = exam.getQuestionCount();
   │                     renderEmptyQuestion()
   │
   │ "Delete Question": exam.removeQuestion(index) → ExamService.saveExam(exam) → re-render
   │
   │ "Save Exam" (saveExam): exam.updateExam(title, timeLimit) → ExamService.saveExam(exam)
```

- **What passes:** exam id (localStorage) → `Exam` object; the edited question index travels
  through `localStorage["currentQuestionIndex"]`; `saveExam` writes the whole updated exam back
  into `localStorage["exams"]`.

### Cross-cutting flow — Theme (dark/light)

Every page loads `theme.js` and calls `initThemeToggle()`:
reads `localStorage["theme"]`, applies the `dark-mode` class to `<body>`, and toggles + persists
the choice when the **Dark/Light Mode** button is clicked.

---

## 7. Technologies

- **HTML5 + Bootstrap 5** (CDN) for layout and components.
- **Vanilla JavaScript, ES Modules** (`import`/`export`, `<script type="module">`).
- **OOP** — `Exam`, `Question`, `User` domain classes + `ExamService`, `UserService`, `ExamUI` classes.
- **JSON + `localStorage`** for all persistence (no backend).
- **`crypto.randomUUID()`** for unique ids.
- **Blob + object URL** for exporting an exam to a downloadable `.json` file.
- Custom CSS with a **dark-mode** theme (`css/baseStyle.css`).
```
