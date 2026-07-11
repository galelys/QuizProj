# QuizProj — Technical Document

Client-side **Exam Builder, Runner & Statistics** system for a Web Development course.
Authors: **Gal Elisha** and **Yasmin Shapochkin**.

The whole application runs **in the browser only** — there is no server and no database.
All data is persisted in the browser's **`localStorage`** as JSON. The project is built on the
three required foundations: **ES Modules**, **OOP classes**, and **JSON + localStorage**.

---

## 1. GitHub & Deploy

| Item | Value |
|------|-------|
| **Repository** | https://github.com/galelys/QuizProj |
| **Main branch** | `main` |
| **Feature branches** | Each module was developed on its own branch and merged into `main`, so every commit is a development step: `Y-LOG-IN`, `CREATE-EXAM`, `EDIT-EXAM`, `EXAMS-LIST`, `EXAM-RUN`, `STUDENT`, `TEACHER-HOME`, `LOG-OUT`, `menu-buttons`, `ui-upgrades`. |
| **Deploy (GitHub Pages)** | `https://galelys.github.io/QuizProj` |

---

## 2. Pages & Navigation

The app is a **multi-page website**. Navigation is done with `window.location.href`; the data the
next page needs is passed either through the **URL query string** (`?id=`) or through
**`localStorage`** (e.g. `examID`). Every teacher/student page injects a shared **navigation bar**
via `nav.js` (`#menuBTNS`).

| Page | File | Role |
|------|------|------|
| Landing | `index.html` | "Start" button → login. |
| Login | `app/auth/login.html` | Sign in with ID + password (`UserService.login`). |
| Register | `app/auth/register.html` | Create a user: name, id, password, role radio (`UserService.addUser`). |
| **Teacher** Home | `app/teacher/Home/home.html` | Dashboard: exams created, average, best/worst exam. |
| Create Exam | `app/teacher/create/createExam.html` | Build an exam + questions; **Import** a `.json` exam. |
| Exams List | `app/teacher/ExamsList/ExamsList.html` | All exams as cards: Run / Edit / Delete / Export / Statistics + search. |
| Edit Exam | `app/teacher/Edit/Edit.html` | Edit exam info and per-question content. |
| Statistics | `app/teacher/Statistics/ExamStats.html` | Per-exam stats + table of students who took it. |
| **Student** Home | `app/student/Home/home.html` | Greeting, pending exams, previous grades, average. |
| Exam Find | `app/student/ExamFind/ExamFind.html` | Browse/search exams: Start Exam / View My Answers. |
| Exam Runner | `app/ExamRunner/ExamRunner.html` | Take an exam (Prev / Next / Submit) + timer; shows score. |
| Exam Results | `app/ExamRunner/ExamResults.html` | Read-only, color-coded review of a completed attempt. |

### Navigation map

**Auth**
```
 index.html ──"start"──► auth/login.html ◄──"register"──► auth/register.html
                              │
                              │  successful login / register  (redirect ?id=)
                 ┌────────────┴────────────┐
        type == "teacher"          type == "student"
                 ▼                         ▼
       teacher/Home/home.html     student/Home/home.html
```

**Teacher**  ── nav: `Home | Exams | Create | Log Out`
```
 teacher/Home/home.html
        │
        ├─ "Create" ─► teacher/create/createExam.html        (build / import an exam)
        │
        └─ "Exams"  ─► teacher/ExamsList/ExamsList.html
                          one card per exam, buttons:
                            ├─ "Run"        ─► ExamRunner/ExamRunner.html
                            ├─ "Edit"       ─► teacher/Edit/Edit.html
                            ├─ "Delete"     ─► removes the exam, re-renders the list
                            ├─ "Export"     ─► downloads <title>.json
                            └─ "Statistics" ─► teacher/Statistics/ExamStats.html
```

**Student**  ── nav: `Home | Exams | Log Out`
```
 student/Home/home.html
        │
        └─ "Exams" ─► student/ExamFind/ExamFind.html
                         one card per exam, buttons:
                           ├─ "Start Exam"      ─► ExamRunner/ExamRunner.html
                           │                         │ on finish:
                           │                         ├─ "watch questions" ─► ExamRunner/ExamResults.html
                           │                         └─ "Return"          ─► student/Home/home.html
                           └─ "View My Answers" ─► ExamRunner/ExamResults.html   (already taken)
```

**Rules enforced by the flow:** a student may take each exam **once** — if a saved result exists,
the Runner redirects to the review page. Teachers can re-run an exam freely (nothing is saved for them).

---

## 3. JSON Data Format (localStorage)

Objects are written with `JSON.stringify` and rebuilt into class instances with `JSON.parse`
(the services **re-hydrate** plain objects back into `Exam` / `Question` / `User`).

### Storage keys

| Key | Written by | Content |
|-----|-----------|---------|
| `"exams"` | `ExamService` | Array of exam objects (below). |
| `"users"` | `UserService` | Array of user objects (below). |
| `"activeUser"` | auth + page controllers | The currently logged-in user object. |
| `"examID"` | ExamsList / ExamFind | ID of the exam selected for Run / Edit / Stats / Review. |
| `"lastResult"` | `ExamUI.checkExam` | The most recent attempt result (fallback for the review page). |
| `"selected_category"` | Create page | Category chosen while building an exam (temporary). |
| `"currentQuestionIndex"` | Edit page | Index of the question being edited (temporary). |
| `"theme"` | `theme.js` | `"dark"` or `"light"`. |

### `exams` — one exam object

```json
{
  "id": "3f2a9c1e-…",
  "title": "JavaScript Basics",
  "description": "Intro quiz",
  "category": "Java",
  "timeLimit": 30,
  "createdAt": "2026-07-10T12:00:00.000Z",
  "creatorID": "123456789",
  "questions": [
    {
      "id": "a1b2c3d4-…",
      "text": "What is const?",
      "answers": ["A block-scoped constant", "A loop", "A function", "A CSS rule"],
      "correctAnswerIndex": 0,
      "difficulty": 3
    }
  ],
  "stats": [ /* one attempt-result object per time a student took the exam */ ]
}
```

- `id` / question `id` — `crypto.randomUUID()`.
- `answers` — always **4** strings; `correctAnswerIndex` is **0-based** (UI collects 1–4, stores `n − 1`).
- `difficulty` — integer weight from a slider; it is the **points** the question is worth.
- `timeLimit` — minutes; `0` means **unlimited**.
- `category` — one of `ExamService.categories`: `Java, c++, Math, English, History, Python`.
- `creatorID` — id of the teacher who owns the exam.

### attempt / result object (an entry in `exam.stats` and in `user.examsResults`)

```json
{
  "userAnswers": [0, 2, -1],        // chosen answer index per question; -1 = unanswered
  "score": 5,                        // sum of difficulty of correct answers
  "examMaxScore": 8,                 // sum of all difficulties
  "percentage": 63,                  // round(score / examMaxScore * 100)
  "answersCount": 2,                 // how many questions were answered
  "timeTaken": 74,                   // seconds spent
  "timeLeft": 226,
  "userID": "987654321",
  "examID": "3f2a9c1e-…"
}
```

The copy saved in the **student's history** also carries an **`examSnapshot`** — a self-contained
copy of the exam (title, description, category, timeLimit, questions) taken at submit time, so the
review stays correct even if the teacher later edits or deletes the exam. The copy pushed into
`exam.stats` deliberately has **no** snapshot (keeps the exam from nesting copies of itself).

### `users` — one user object

```json
{
  "id": "987654321",
  "name": "yasmin",
  "password": "1234",
  "type": "student",
  "examsResults": [ /* attempt objects (with examSnapshot) */ ],
  "examsCreated": [ /* exam ids created by a teacher */ ]
}
```

### Exported exam file

**Export** (`ExamsList.js → exportExam`) serializes one exam with `JSON.stringify(exam, null, 2)`,
wraps it in a `Blob` (`application/json`) and downloads `<title>.json`. **Import** (Create / Exams List)
reads such a file and rebuilds it as a fresh exam (new ids, so it never overwrites an existing one).

---

## 4. Main Classes (UML)

### 4.1 Domain models

```
┌──────────────────────────────┐        ┌──────────────────────────────┐
│            Exam              │        │           Question           │
├──────────────────────────────┤ 1    * ├──────────────────────────────┤
│ + id: string (UUID)          │◇───────│ + id: string (UUID)          │
│ + title, description         │        │ + text: string               │
│ + category, timeLimit        │        │ + answers: string[4]         │
│ + createdAt, creatorID       │        │ + correctAnswerIndex: number │
│ + questions: Question[]      │        │ + difficulty: number         │
│ + stats: Result[]            │        ├──────────────────────────────┤
├──────────────────────────────┤        │ + isCorrect(userIdx): bool   │
│ + addQuestion(q)             │        │ + updateQuestion(t,a,idx,d)  │
│ + removeQuestion(i)          │        └──────────────────────────────┘
│ + updateQuestion(i, q)       │
│ + updateExam(title,time,desc)│        ┌──────────────────────────────┐
│ + updateStats(result)        │        │             User             │
│ + getQuestionCount(): number │        ├──────────────────────────────┤
│ + addCategory / addTimeLimit │        │ + id, name, password         │
└──────────────────────────────┘        │ + type: "teacher"|"student"  │
                                        │ + examsResults: Result[]     │
                                        │ + examsCreated: string[]     │
                                        ├──────────────────────────────┤
                                        │ + checkPassword(pw): bool    │
                                        │ + getUserName / getUserType  │
                                        │ + addExamResults(result)     │
                                        │ + addExamCreation(examID)    │
                                        │ + getExamsCreatedCount()     │
                                        └──────────────────────────────┘
```

### 4.2 Services & UI

```
┌───────────────────────────────────────────┐   ┌──────────────────────────────────┐
│ ExamService   → localStorage["exams"]     │   │ UserService → …["users"]         │
├───────────────────────────────────────────┤   ├──────────────────────────────────┤
│ + getAllExams(): Exam[]      (re-hydrate) │   │ + addUser(user): bool            │
│ + saveExam(exam) / deleteExam(id)         │   │ + findUserById(id): User|null    │
│ + getExamById(id): Exam                   │   │ + findUserByName(name): User|null│
│ + getExamsByCategory / getExamByCreatorId │   │ + login(id, pw): User|null       │
│ + createExamSnapshot(exam)                │   │ + saveUser(user)                 │
│ + calculateExamAverage / …RunCount /      │   │ + removeExamResultsFromAll…(id)  │
│   …TimeAverage / getBest/WorstExam        │   └──────────────────────────────────┘
│ + getCategories() / clearAllExams()       │
└───────────────────────────────────────────┘   ┌──────────────────────────────────┐
                                                │ ExamUI  (owns DOM; uses          │
                                                │          ExamService)            │
                                                ├──────────────────────────────────┤
 theme.js (module)                              │ + renderExamList(userType)       │
 ─────────────────                              │ + renderExamListSearch…(exams)   │
 + initThemeToggle()   ← reads/writes "theme"   │ + sorterList(val, userType)      │
                                                │ + renderExamRunner(exam,onFinish)│
                                                │ + checkExam(exam, results)       │
                                                │ + renderExamResults(exam,results)│
                                                │ + renderExamEdit / renderQuestion│
                                                │ + showExamCategories / messages  │
                                                └──────────────────────────────────┘
```

**Design principle:** models hold data + behaviour; **services** own persistence (localStorage);
**ExamUI** owns DOM rendering; **page controllers** (`*.js`) wire DOM events to services/UI.
The UI never touches `localStorage` directly — it always goes through `ExamService`.

```
page controller (*.js)
    ├─► Exam / Question / User        (models)
    ├─► ExamService / UserService     (services) ─► localStorage
    ├─► ExamUI                        (ui)       ─► DOM  +  ExamService
    └─► initThemeToggle()             (theme)    ─► localStorage["theme"]
```

---

## 5. Central Flows (who calls whom, what is passed)

### Flow A — Register / Login
```
register.js / login.js
  ├ validate inputs (non-empty)
  ├ register: new User(name, pw, type, id) → UserService.addUser() → users[]
  ├ login:    UserService.login(id, pw) → findUserById(id) + compare password
  └ goToPage(id): save user → localStorage["activeUser"]
                  redirect by role → teacher/Home or student/Home  (?id=<id>)
```
*Passed forward:* the user **id** (URL `?id=`) and the whole user object (`activeUser`).

### Flow B — Create an Exam (teacher)  · `create.js`
```
"Add Question"  → validate → new Question(text, answers, correctIdx, difficulty)
                  currentExam ??= new Exam(title, user.id) ; currentExam.addQuestion(q)
"Save Exam"     → set category (localStorage["selected_category"]), timeLimit, description
                  user.addExamCreation(exam.id) ; UserService.saveUser(user)
                  ExamService.saveExam(currentExam)  ─►  localStorage["exams"]
```
*Import* rebuilds an exam from a chosen `.json` file with fresh ids, then `saveExam`.

### Flow C — List / Search / Delete / Export / Stats (teacher)  · `ExamsList.js`
```
on load  → ExamUI.renderExamList("teacher") → getAllExams() → one card per exam
search   → ExamUI.sorterList(text, "teacher")  (filter by title/id + category)
one delegated click listener on #examList reads event.target.dataset.id:
  run-btn → set examID → ExamRunner.html      edit-btn → set examID → Edit.html
  delete-btn → confirm → deleteExam(id)        export-btn → JSON → Blob → download
  statistics-btn → set examID → ExamStats.html
```
*Passed forward to Run/Edit/Stats:* the exam **id** via `localStorage["examID"]`.

### Flow D — Take an Exam & score  · **core flow** · `ExamRunner.js` + `ExamUI`
```
ExamRunner.js
  examID = localStorage["examID"] ; exam = ExamService.getExamById(examID)
  (student who already has a result for this exam → redirect to ExamResults.html)
  ExamUI.renderExamRunner(exam, onFinish)
        │  userAnswers[i] = -1 ; questionIndex = 0 ; start timer (if timeLimit > 0)
        │  Next/Prev → store chosen radio value into userAnswers[i], re-render
        │  Submit / time-up → ExamUI.checkExam(exam, results)
        ▼
  ExamUI.checkExam
        score = Σ difficulty of correct answers ; examMaxScore = Σ difficulty
        results = {score, examMaxScore, percentage, answersCount, timeTaken, userAnswers}
        render "Score x/total • percent%" ; localStorage["lastResult"] = results
        onFinish(results)  ◄── back in ExamRunner.js (student only):
              exam.updateStats(results) ; ExamService.saveExam(exam)     // feeds teacher stats
              result + examService.createExamSnapshot(exam) → user.examsResults
              UserService.saveUser(user) ; update activeUser
```
*What passes:* exam id → re-hydrated `Exam` → in-memory `userAnswers` → a `results` object
persisted **twice** (on the exam's `stats`, and on the student's history **with a snapshot**).

### Flow E — Review answers (student)  · `ExamResults.js`
```
find the student's result for examID (history, else lastResult)
examForReview = result.examSnapshot ?? live exam        // survives edits/deletes
ExamUI.renderExamResults(exam, results) → read-only questions:
      correct answer highlighted green, wrong student answer red, "-1" shown as unanswered
```

### Flow F — Edit an Exam (teacher)  · `Edit.js` + `ExamUI`
```
exam = getExamById(localStorage["examID"]) ; ExamUI.renderExamEdit(exam)
dropdown change → renderQuestion(exam, i) → localStorage["currentQuestionIndex"] = i
Save Question → new Question(...) ; isNew ? addQuestion : updateQuestion(i, q) → saveExam
Add Question  → renderEmptyQuestion() ; index = getQuestionCount()
Delete        → exam.removeQuestion(i) → saveExam
Save Exam     → exam.updateExam(title, timeLimit, description) → saveExam
```

### Flow G — Statistics (teacher)  · `ExamStats.js`
```
exam = getExamById(localStorage["examID"])
ExamService.calculateExamRunCount / calculateExamAverage / calculateExamTimeAverage(exam)
for each attempt in exam.stats: UserService.findUserById(stat.userID).getUserName()
                                → table row: name • score/max • percentage
```

### Cross-cutting — Theme
Every page calls `initThemeToggle()`: reads `localStorage["theme"]`, applies the `dark-mode`
class to `<body>`, and toggles + persists the choice on the Dark/Light button.

---

## 6. Technologies

- **HTML5 + Bootstrap 5** (CDN) for layout.
- **Vanilla JavaScript, ES Modules** (`import` / `export`, `<script type="module">`).
- **OOP** — `Exam`, `Question`, `User` models + `ExamService`, `UserService`, `ExamUI` classes.
- **JSON + `localStorage`** for all persistence (no backend).
- **`crypto.randomUUID()`** for ids; **Blob + object URL** for JSON export/import.
- Custom CSS with a **dark-mode** theme (`css/baseStyle.css`).
