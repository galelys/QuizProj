export class MenuButtons {

    constructor(){
        this.menuB = {
            teacher:{
                teacherHome: "",
                examRunner: "",
                create: "",
                edit:""
            },

            student:{
                studentHome: "",
                examRunner: "",
            }
            
        }
    }

    getTeacherButtons(){
        return this.teacher;
    }

    getTeacherButtons(){
        return this.student;
    }

}