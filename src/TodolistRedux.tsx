import React, {ChangeEvent} from 'react';
import {FilterValuesType} from "./AppWithRedux";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {AddItemForm} from "./AddItemForm";
import {AppRootStateType} from "./state/store";
import {TaskType} from "./Todolist";
import {useDispatch, useSelector} from "react-redux";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {ChangeTodolistFilterAC, ChangeTodolistTitleAC, RemoveTodolistAC} from "./state/todolists-reducer";

type TodolistReduxPropsType = {
    todolistId:string,
    title:string,
    filter:FilterValuesType
}


export const TodolistRedux = ({todolistId,title,filter}:TodolistReduxPropsType) => {
    let tasks = useSelector<AppRootStateType,Array<TaskType>>(state=>state.tasks[todolistId])
    const dispatch = useDispatch()
    const changeTodolistTitle =(title:string)=>{  dispatch(ChangeTodolistTitleAC(todolistId, title))}
    const removeTodolist = () => {
        dispatch(RemoveTodolistAC(todolistId))
    }
    const addTask = (title:string) => {
        dispatch(addTaskAC(title,todolistId))
    }
    if (filter === "active") {
        tasks = tasks.filter(t => !t.isDone);
    }
    if (filter === "completed") {
        tasks = tasks.filter(t => t.isDone);
    }
    const onAllClickHandler = () => dispatch(ChangeTodolistFilterAC(todolistId,"all"));
    const onActiveClickHandler = () => dispatch(ChangeTodolistFilterAC(todolistId,"active"));
    const onCompletedClickHandler = () => dispatch(ChangeTodolistFilterAC(todolistId,"completed"));
    return (
        <div>
            <h3> <EditableSpan value={title} onChange={changeTodolistTitle} />
                <IconButton onClick={removeTodolist}>
                    <Delete />
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask}/>
            <div>
                {
                    tasks.map(t => {
                        const onClickHandler = () => dispatch(removeTaskAC(t.id,todolistId))
                        const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                            let newIsDoneValue = e.currentTarget.checked;
                            dispatch(changeTaskStatusAC(t.id,newIsDoneValue,todolistId))
                        }
                        const onTitleChangeHandler = (newValue: string) => {
                            dispatch(changeTaskTitleAC(t.id,newValue,todolistId))
                        }
                        return <div key={t.id} className={t.isDone ? "is-done" : ""}>
                            <Checkbox
                                checked={t.isDone}
                                color="primary"
                                onChange={onChangeHandler}
                            />

                            <EditableSpan value={t.title} onChange={onTitleChangeHandler} />
                            <IconButton onClick={onClickHandler}>
                                <Delete />
                            </IconButton>
                        </div>
                    })
                }
            </div>
            <div>
                <Button variant={filter === 'all' ? 'outlined' : 'text'}
                        onClick={onAllClickHandler}
                        color={'default'}
                >All
                </Button>
                <Button variant={filter === 'active' ? 'outlined' : 'text'}
                        onClick={onActiveClickHandler}
                        color={'primary'}>Active
                </Button>
                <Button variant={filter === 'completed' ? 'outlined' : 'text'}
                        onClick={onCompletedClickHandler}
                        color={'secondary'}>Completed
                </Button>
            </div>
        </div>
    );
};


