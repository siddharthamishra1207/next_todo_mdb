import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    taskTitle:{
        type:String,
        require:[true,"please provide a task title"],
        unique: true,
    },
    taskDetails:{
        type:String
    },
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
}, { timestamps: true }
)

const Task = mongoose.models.tasks || mongoose.model("tasks",taskSchema);
export default Task;