import { Exam } from "../models/Exam.js";
import { Question } from "../models/Question.js";

export class ExamService {
    constructor() {
        this.storageKey = "exams";
        this.categories = ["Java" , "c++" , "Math" , "English" , "History" , "Python"];
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


            //inner clone for questions
            exam.questions = examData.questions.map(questionData => {
                const question = new Question(
                    questionData.text,
                    questionData.answers,
                    questionData.correctAnswerIndex
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

    deleteExam(examId) {
        const exams = this.getAllExams();

        const filteredExams = exams.filter(exam => exam.id !== examId);

        localStorage.setItem(this.storageKey, JSON.stringify(filteredExams));
    }

    getExamById(examId) {
        const exams = this.getAllExams();

        return exams.find(exam => exam.id === examId);
    }

    getCategories(){
        return this.categories;
    }

    clearAllExams() {
        localStorage.removeItem(this.storageKey);
    }

    getExamsByCategory(category) {
        const exams = this.getAllExams();
        return exams.filter(exam => exam.category === category);
    }

}
