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
            exam.description = examData.description || "";
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

    /*
    Builds a self-contained copy of an exam as it exists right now.
    Stored inside a student's result at submit time so the read-only
    review always reflects the exam they actually took, even after the
    teacher edits or deletes it.

    Deliberately excludes `stats`: the snapshot only needs the questions
    and correct answers, and leaving stats out keeps stored results small
    and prevents an exam from accumulating nested copies of itself.
    */
    createExamSnapshot(exam) {
        if (!exam) {
            return null;
        }

        return {
            title: exam.title,
            description: exam.description || "",
            timeLimit: exam.timeLimit,
            category: exam.category,
            questions: (exam.questions || []).map(question => ({
                text: question.text,
                answers: [...question.answers],
                correctAnswerIndex: question.correctAnswerIndex,
                difficulty: question.difficulty
            }))
        };
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

    getExamCountByCreatorId(creatorId) {
        return this.getExamByCreatorId(creatorId).length;
    }

    calculateExamResultys(exam, results) {
        // No statistics/results available yet
        if (!results || !results.userAnswers || results.userAnswers.length === 0) {
            return "No stats yet";
        }
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

    calculateExamRunCount(exams) {
        // single exam was passed convert it to an array
        if (!Array.isArray(exams)) {
            exams = [exams];
        }
        let attempts = 0;
        exams.forEach(exam => {
            (exam.stats || []).forEach(stat => {
                attempts++;
            });

        });

        return attempts;
    }

    calculateExamAverage(exams, userID = null) {
        // Average percentage score across every recorded attempt of these exams.
        // Each exam holds its attempts in `stats`; each attempt has a raw `score`
        // (number of correct answers), converted to a percentage of the exam length.
        // When `userID` is given, only that student's attempts are counted.
        let total = 0;
        let attempts = 0;

        exams.forEach(exam => {
            (exam.stats || []).forEach(stat => {

                if (userID && stat.userID !== userID) {
                    return;
                }

                // Guard against a zero max score (e.g. every question has
                // difficulty 0) so the attempt counts as 0% instead of NaN.
                total += stat.examMaxScore > 0
                    ? (stat.score / stat.examMaxScore) * 100
                    : 0;
                attempts++;
            });
        });

        return attempts === 0 ? 0 : Math.round(total / attempts);
    }

    calculateExamTimeAverage(exams) {

        // Support single exam or array of exams
        if (!Array.isArray(exams)) {
            exams = [exams];
        }


        let totalTime = 0;
        let attempts = 0;


        exams.forEach(exam => {

            (exam.stats || []).forEach(stat => {

                // Only count attempts that actually recorded a duration.
                // Older attempts saved before time tracking existed have no
                // numeric `timeTaken`; including them would give NaN:NaN.
                if (typeof stat.timeTaken === "number" && !isNaN(stat.timeTaken)) {
                    totalTime += stat.timeTaken;
                    attempts++;
                }

            });

        });


        // No attempts with a recorded duration yet
        if (attempts === 0) {
            return "No stats yet";
        }


        const averageSeconds = totalTime / attempts;


        // Convert seconds to MM:SS
        const minutes = Math.floor(averageSeconds / 60);
        const seconds = Math.floor(averageSeconds % 60);


        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    /** for calculating currently best preforming exam */
    getBestExam(exams) {

        if (exams.length === 0) { return null; }

        let bestExam = exams[0];
        let bestAverage = this.calculateExamAverage([bestExam]);

        exams.forEach(exam => {
            const average = this.calculateExamAverage([exam]);
            if (average > bestAverage) {
                bestAverage = average;
                bestExam = exam;
            }

        });

        return { exam: bestExam, average: bestAverage };
    }

    /** for calculating currently worst preforming exam */
    getWorstExam(exams) {

        if (exams.length === 0) { return null; }

        let worstExam = exams[0];
        let worstAverage = this.calculateExamAverage([worstExam]);

        exams.forEach(exam => {
            const average = this.calculateExamAverage([exam]);
            if (average < worstAverage) {
                worstAverage = average;
                worstExam = exam;
            }

        });

        return { exam: worstExam, average: worstAverage };
    }
}

