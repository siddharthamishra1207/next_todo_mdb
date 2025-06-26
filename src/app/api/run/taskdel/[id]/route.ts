import { connect } from "@/dbConfig/dbConfig";
import Task from "@/models/tasks";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { getDataFromToken } from "@/helper/getDataFromToken"; // Adjust path as needed

connect();

export async function DELETE(request: NextRequest) {
  try {
   // const taskId = params.id;
   const url = new URL(request.url);
    const taskId = url.pathname.split("/").pop()||" " // Extract task ID from URL


    // 1. Validate task ID
    if (!Types.ObjectId.isValid(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    // 2. Get current user ID from token in cookie
    const userId = getDataFromToken(request);

    // 3. Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // 4. Check if the task belongs to the current user
    if (task.user.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized to delete this task" }, { status: 403 });
    }

    // 5. Delete the task
    await Task.findByIdAndDelete(taskId);

    return NextResponse.json({
      message: "Task deleted successfully",
      success: true,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// import { connect } from "@/dbConfig/dbConfig";
// import Task from "@/models/tasks";
// import { NextRequest, NextResponse } from "next/server";
// import { Types } from "mongoose";

// connect();

// // DELETE a task by ID
// export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const taskId = params.id;

//     if (!Types.ObjectId.isValid(taskId)) {
//       return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
//     }

//     const deletedTask = await Task.findByIdAndDelete(taskId);

//     if (!deletedTask) {
//       return NextResponse.json({ error: "Task not found" }, { status: 404 });
//     }

//     return NextResponse.json({
//       message: "Task deleted successfully",
//       success: true,
//       deletedTask,
//     });
//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
//     return NextResponse.json({ error: errorMessage }, { status: 500 });
//   }
// }
