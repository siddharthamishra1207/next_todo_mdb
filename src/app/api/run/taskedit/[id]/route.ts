import { connect } from "@/dbConfig/dbConfig";
import Task from "@/models/tasks";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { getDataFromToken } from "@/helper/getDataFromToken"; // Adjust import path as needed

connect();

export async function PUT(request: NextRequest) {
  try {
     const url = new URL(request.url);
    const taskId = url.pathname.split("/").pop() || ""; 
    

    // 1. Validate task ID
    if (!Types.ObjectId.isValid(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    // 2. Get user ID from token
    const userId = getDataFromToken(request);

    // 3. Get task and verify ownership
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (task.user.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized to edit this task" }, { status: 403 });
    }

    // 4. Get updated data
    const { taskTitle, taskDetails } = await request.json();

    // 5. Update the task
    task.taskTitle = taskTitle;
    task.taskDetails = taskDetails;
    const updatedTask = await task.save();

    return NextResponse.json({
      message: "Task updated successfully",
      success: true,
      updatedTask,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
