"use client";
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Task {
    id: number;
    name: string;
    date: string;
    description: string;
    completed: boolean;
}

// Estilos para los componentes
const Container = styled.div`
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
    color: #343a40;
    font-size: 24px;
    margin-bottom: 20px;
`;

const TaskListWrapper = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const TaskItem = styled.li`
    background-color: #ffffff;
    border: 1px solid #dee2e6;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 10px;
    transition: background-color 0.2s;

    &:hover {
        background-color: #f1f1f1;
    }
`;

const TaskName = styled.h2`
    font-size: 18px;
    color: #343a40;
    margin: 0;
`;

const TaskDate = styled.h2`
    font-size: 14px;
    color: #343a40;
`;

const TaskDescription = styled.p`
    color: #343a40;
`;

const DeleteButton = styled.button`
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #c82333;
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
`;

const Input = styled.input`
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ced4da;
    border-radius: 5px;
    color: #343a40;
`;

const TextArea = styled.textarea`
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ced4da;
    border-radius: 5px;
    color: #343a40;
`;

const SubmitButton = styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #0056b3;
    }
`;

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const fetchTasks = async () => {
        const response = await fetch('/api/to-do');
        if (!response.ok) {
            console.error('Error fetching tasks');
            return;
        }
        const data: Task[] = await response.json();
        setTasks(data);
    };
    useEffect(() => {
    

        fetchTasks();
    }, []);

    const deleteTask = async (id: number) => {
        const response = await fetch(`/api/to-do?id=${id}`, {
            method: 'DELETE',
        });

        if (response.status === 204) {
            setTasks(tasks.filter(task => task.id !== id));

            fetchTasks();
        } else {
            console.error('Error deleting task');
        }
    };

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('/api/to-do', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, date, description }),
        });

        if (response.ok) {
            const newTask: Task = await response.json();
            setTasks([...tasks, newTask]);
            setName('');
            setDate('');
            setDescription('');
        } else {
            console.error('Error adding task');
        }
    };

    return (
        <Container>
            <Title>Task List</Title>

            <Form onSubmit={addTask}>
                <Input
                    type="text"
                    placeholder="Nombre de la tarea"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <TextArea
                    placeholder="Descripción de la tarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <SubmitButton type="submit">Añadir Tarea</SubmitButton>
            </Form>

            <TaskListWrapper>
                {tasks.map(task => (
                    <TaskItem key={task.id}>
                        <TaskName>{task.name}</TaskName>
                        <TaskDate>{task.date}</TaskDate>
                        <TaskDescription>{task.description}</TaskDescription>
                        <DeleteButton onClick={() => deleteTask(task.id)}>Eliminar</DeleteButton>
                    </TaskItem>
                ))}
            </TaskListWrapper>
        </Container>
    );
};

export default TaskList;
