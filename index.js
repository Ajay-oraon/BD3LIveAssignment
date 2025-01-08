const express = require("express");
const app = express();

const tasks = [
  {
    id: 1,
    title: "Fix a critical bug",
    project: "Project Alpha",
    assignedTo: "Bob",
    priority: "high",
    status: "open",
  },
  {
    id: 2,
    title: "Implement a new feature",
    project: "Project Alpha",
    assignedTo: "Charlie",
    priority: "medium",
    status: "in progress",
  },
  {
    id: 3,
    title: "Write documentation",
    project: "Project Beta",
    assignedTo: "Bob",
    priority: "low",
    status: "open",
  },
];

//View All Tasks for a Project:

function getTaskByProjectName(task, name) {
  return task.project === name;
}

//View All Tasks Assigned to a Person:

function findTaskByUserName(name, task) {
  return task.assignedTo === name;
}

app.get("/users/:name/tasks", (req, res) => {
  let name = req.params.name;
  let result = tasks.filter((task) => findTaskByUserName(name, task));
  res.json(result);
});

app.get("/projects/:name/tasks", (req, res) => {
  const name = req.params.name;
  const result = tasks.filter((task) => getTaskByProjectName(task, name));
  res.json(result);
});

//find pending task

app.get("/tasks/pending", (req, res) => {
  const result = [];
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].status === "open") {
      result.push(tasks[i]);
    }
  }
  if (result.length === 0) {
    return res.json({ message: "No task pending" });
  }
  res.json(result);
});

// 

//udpdate task status
function updateTaskById(tasks,id,status){
    const task= tasks.find((task)=>task.id===id)
    task.status=status
    return task;
}

app.post("/tasks/:id/status",(req,res)=>{
    const id= parseInt(req.params.id);
    const status= req.query.status;
    const result= updateTaskById(tasks,id,status)

    res.json({updatedTask:result})
});

//Sort Tasks by Project Size:

// app.get("/projects/sort/by-task-size",(req,res)=>{
//     let sortedProject;
//     for(let i=0;i<tasks.length;i++){
//         if()
//     }
// })

function validateId(id) {
  return tasks.find((task) => task.id === id);
}

//eg.http://localhost:3000/tasks?id=4&title=fix%20bug&project=Project%20Alpha&assignedTo=suraj&priority=Low&status=open

app.get("/tasks", (req, res) => {
  const { id, title, project, assignedTo, priority, status } = req.query;
  if (!id || !title || !project || !assignedTo || !priority || !status) {
    return res.json({ error: "some field is required! Please recheck" });
  }
  if (validateId(parseInt(id))) {
    return res.json({ error: "Task Id already exists" });
  }
  const newTask = {
    id: parseInt(id),
    title,
    project,
    assignedTo,
    priority,
    status,
  };
  tasks.push(newTask);
  res.json({ updatedTasks: tasks });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
