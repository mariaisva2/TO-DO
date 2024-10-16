import { NextResponse } from "next/server";

export interface Task {
    id: number;
    name: string;
    date: string;
    description: string;
    completed: boolean;
}

const taskList: Task[] = [
    { id: 1, completed: true, date: "hpy", description: "sol", name: "casa" },
    { id: 2, completed: false, date: "hoy2", description: "jugo", name: "mango" }
];

// Método GET
export async function GET(req: Request) {
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    let filterTask = taskList;

    if (!status) return NextResponse.json(filterTask);

    if (status === "completed") {
        filterTask = taskList.filter(task => task.completed);
    } else {
        filterTask = taskList.filter(task => !task.completed);
    }
    
    return NextResponse.json(filterTask);
}
// Método POST
export async function POST(req: Request) {
    const body = await req.json();

    if (!body || !body.date || !body.description || !body.name) {
        return NextResponse.json({
            message: "La tarea no es válida"
        }, { status: 400 });
    }

    const newTask: Task = {
        id: Date.now(),
        completed: false,
        ...body
    };

    taskList.push(newTask);
    return NextResponse.json({ status: 201 });
}
// Método DELETE
export async function DELETE(req: Request) {
    const url = new URL(req.url);
    const taskId = parseInt(url.searchParams.get("id")!)

    if (isNaN(taskId)) {
        return NextResponse.json({
            message: "El id de la tarea no es válido"
        }, { status: 400 });
    }

    const taskIndex = taskList.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        return NextResponse.json({
            message: "La tarea no existe"
        }, { status: 404 });
    }

    taskList.splice(taskIndex, 1);

    return NextResponse.json({ status: 204 });
}
// Método PUT
export async function PUT(req: Request) {
    const url = new URL(req.url);
    const taskId = parseInt(url.pathname.split("/").pop() || "0");

    if (isNaN(taskId)) return NextResponse.json({
        message: "El id de la tarea no es válido"
    }, { status: 400 });

    const updatedTask = await req.json();
    const index = taskList.findIndex(task => task.id === taskId);

    if (index === -1) return NextResponse.json({
        message: "La tarea no existe"
    }, { status: 404 });

    if (!updatedTask.date || !updatedTask.description || !updatedTask.name) {
        return NextResponse.json({
            message: "La tarea no es válida"
        }, { status: 400 });
    }

    taskList[index] = { ...updatedTask, id: taskId };
    return NextResponse.json({ status: 200 });
}

