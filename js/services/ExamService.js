import { Exam } from "../models/exam.js";
import { Question } from "../models/Question.js";

export class ExamService {
    constructor() {
        this.storageKey = "exams";
        this.categories = ["Java", "c++", "Math", "English", "History", "Python"];
    }

    getAllExams() {
        //get data from localStorage by examkey
        const data = localStorage.getItem(this.storageKey);

        if (!data) {
            return []; //if not exist return empty array
        }


        const plainExams = JSON.parse(data);
        //map function, clone object from examData. avoiding direct manipulation
        return plainExams.map(examData => {
            //create new
            const exam = new Exam(examData.title);
            //clone the data
            exam.id = examData.id;
            exam.createdAt = examData.createdAt;
            exam.timeLimit = examData.timeLimit;
            exam.category = examData.category;
            exam.creatorID = examData.creatorID;
            exam.stats = examData.stats || [];



            //inner clone for questions
            exam.questions = examData.questions.map(questionData => {
                const question = new Question(
                    questionData.text,
                    questionData.answers,
                    questionData.correctAnswerIndex,
                    questionData.difficulty
                );

                question.id = questionData.id;

                return question;
            });

            return exam;
        });
    };
    //save to localStorage
    saveExam(exam) {

        const exams = this.getAllExams();
        //delete(exam.id) to remove old version of the exam
        const index = exams.findIndex(e => e.id === exam.id);

        if (index !== -1) {
            // update existing exam
            exams[index] = exam;
        }
        // add new exam
        else {
            exams.push(exam);
        }
        localStorage.setItem(this.storageKey, JSON.stringify(exams));
    }



    deleteExam(examID) {
        const exams = this.getAllExams();

        const filteredExams = exams.filter(exam => exam.id !== examID);

        localStorage.setItem(this.storageKey, JSON.stringify(filteredExams));
    }

    getExamById(examID) {
        const exams = this.getAllExams();

        return exams.find(exam => exam.id === examID);
    }

    getCategories() {
        return this.categories;
    }

    clearAllExams() {
        localStorage.removeItem(this.storageKey);
    }

    getExamsByCategory(category) {
        const exams = this.getAllExams();
        return exams.filter(exam => exam.category === category);
    }

    getExamByCreatorId(creatorId) {
        const exams = this.getAllExams();
        return exams.filter(exam => exam.creatorID === creatorId);
    }

    calculateExamResultys(exam, results) {
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

        return score;

    }

    calculateExamAverage(exams,userID = null) {
        // Calculates the average percentage score across all recorded attempts.
        // Each exam stores its attempts in `stats`.
        // Every attempt contains the student's earned score (`score`) and the
        // maximum possible score (`examMaxScore`), which are used to calculate
        // the percentage grade.

        let total = 0;
        let attempts = 0;

        exams.forEach(exam => {
            (exam.stats || []).forEach(stat => {

                if (userID && stat.userID !== userID) {
                    return;
                }

                total += (stat.score / stat.examMaxScore) * 100;
                attempts++;
            });
        });

        return attempts === 0 ? 0 : Math.round(total / attempts);
    }
}

