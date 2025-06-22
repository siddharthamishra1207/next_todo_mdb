import { connect } from "@/dbConfig/dbConfig";
import Task from "@/models/tasks";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";  // Adjust path if needed

connect();

export async function POST(request: NextRequest) {
  try {
    // 1. Get user ID from JWT token in cookies
    const userId = getDataFromToken(request);

    // 2. Parse request body
    const reqBody = await request.json();
    const { taskTitle, taskDetails } = reqBody;

    // 3. Create a new task linked to this user
    const newTask = new Task({
      taskTitle,
      taskDetails,
      user: userId, // link task to the authenticated user
    });

    const savedTask = await newTask.save();

    return NextResponse.json({
      message: "Task created successfully",
      success: true,
      savedTask,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}