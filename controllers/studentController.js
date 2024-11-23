import Student from "../models/student.js";


export function getStudents(request, response)  {
    //response.json({ message: "Get Request for student Router/Students List" });
    Student.find()
     .then((students) => {
        response.json(students);
      })
     .catch((err) => {
        response.status(500).json({ message: "Failed to get students" });
      });
  }

export function createStudent(request, response)  {
    //response.json({ message: "Post Request for student Router/Students" });
  
    const student =new Student(request.body);
  
    student.save().then(() => {
      response.status(201).json({ message: "Student added successfully" });
  
    }).catch(err => {
      response.status(400).json({ message: "Failed to add student" });
  
    });
  }  

 export function deleteStudent(request, response) {
    Student.deleteOne({name: request.body.name}).then(() => {
        response.json({ message: "Student deleted successfully" });
      })
 }

export function updateStudent(request, response) {
    //response.json({ message: "Update Request for student Router/Students/:id" });
    Student.findByIdAndUpdate(request.params.id, request.body, { new: true })
     .then((student) => {
        if (!student) {
          return response.status(404).json({ message: "Student not found" });
        }
        response.json(student);
      })
     .catch((err) => {
        response.status(500).json({ message: "Failed to update student" });
      });
}

