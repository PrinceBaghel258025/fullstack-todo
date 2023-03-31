import { useReducer, useRef, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import axios from "axios";

import DragSortableList from "react-drag-sortable";
import { Toaster, toast } from "react-hot-toast";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [list, setList] = useState([])
  let dragItem = useRef(null);
  let dragOverItem = useRef(null);

  const backendUrl = 'http://localhost:5000'
  useEffect(() => {
    
    const fetchData = async () => {
      const todos = await axios.get(`${backendUrl}/`)
      setTodos(todos.data.todos)
      return todos;
    }
    fetchData()
    // console.log(todos)
    // setTodos(todos.todos)
  },[])


  const handleSubmit = async  (e) => {
    e.preventDefault();
    // console.log(newTodo);
    if(newTodo === "") {
      toast.error("Please add text first")
      return 
    }
    try {
      const todo = await axios.post(`${backendUrl}/add-todo`, {
        text: newTodo,
        status: 'pending'
      })
      console.log(todo.data.todo)
      setTodos((todos) => {
        console.log("todos changed")
        return [
          ...todos,
          todo.data.todo
        ];
      })
      setNewTodo("");
    } catch(err) {
      console.log(err)
    }
    
  };
  const handleClick = (todo) => {
    console.log("todo");
    setTodos((todos) => {
      // console.log(todos)
      return todos.map((item) =>
        item === todo
          ? {
              text: item.text,
              status: item.status === "pending" ? "complete" : "pending",
            }
          : item
      );
      // return todos
    });
  };

  // const handleSort = () => {
  //   let _todos = [...todos];

  //   const draggedItemContent = _todos.splice(dragItem.current, 1)[0];

  //   _todos.splice(dragOverItem.current, 0, draggedItemContent);

  //   dragItem.current = null;
  //   dragOverItem.current = null;
  // };

  useEffect(() => {
    let list = todos.length !== 0
    ? todos.map((todo, index) => {
        return {
          content: (
            <div
              key={Math.floor(Math.random() * 10000)}
              // onClick={() => handleClick(todo)}
              className={
                todo.status === "pending"
                  ? "flex items-center space-x-4 p-4 shadow-lg m-2"
                  : "line-through flex items-center"
                  + "p-4 space-x-4"
              }
              draggable
              // onDragStart={(e) => (dragItem.current = index)}
              // onDragEnter={(e) => (dragOverItem.current = index)}
              // onDragEnd={handleSort}
              // onDragOver={(e) => e.preventDefault()}
            >
              <input
                draggable
                id="here"
                type="checkbox"
                checked={todo.status === "pending" ? false : true}
                onChange={() => handleClick(todo)}
                className=" checked:bg-blue-500 h-12 w-8 rounded-md"
                value={"here is the first item"}
              />
              <label className="text-2xl" htmlFor="here" draggable>
                {todo.text}
              </label>
            </div>
          ),
        };
      })
    : [
        {
          content: <div>No Content</div>,
        },
      ];
      setList(list)
  }, [todos])
  
    

  const placeholder = <div className="placeholderContent">PLACEHOLDER</div>;
  const onSort = function (sortedList, dropEvent) {
    console.log("sortedList", sortedList, dropEvent);
  };

  return (
    <div className="bg-slate-500 h-screen">
      <Toaster />
      <Navbar />
      <div className="flex justify-center my-4 mx-24">
        <div className="container">
          <form onSubmit={handleSubmit} className="flex flex-1 space-x-4">
            <input
              className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 font-medium text-lg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
              placeholder="Add Todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <button
              type="submit"
              className="btn px-8 py-2 bg-sky-500 rounded-lg font-medium text-lg text-white"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className=" my-8 mx-24 ">
        <h2 className="text-4xl font-medium">Todos</h2>
        <DragSortableList
          items={list}
          placeholder={placeholder}
          onSort={onSort}
          dropBackTransitionDuration={0.3}
          type="vertical"
        />
        {/* {todos.length !== 0 ? (
          <>
            {todos.map((todo, index) => (
              <div
                key={Math.floor(Math.random() * 10000)}
                // onClick={() => handleClick(todo)}
                className={todo.status === 'pending' ? "flex items-center" : "line-through flex items-center"}
                draggable
                onDragStart={(e) => (dragItem.current = index)}
                onDragEnter={(e) => (dragOverItem.current = index)}
                onDragEnd={handleSort}
                onDragOver={(e) => e.preventDefault()}
              >
                <input
                draggable
                  id="here"
                  type="checkbox"
                  checked={todo.status === 'pending' ? false : true}
                  onChange={() => handleClick(todo)}
                  className=" checked:bg-blue-500 h-12 w-8 rounded-md"
                  value={"here is the first item"}
                />
                <label className="text-2xl" htmlFor="here" draggable>
                  {todo.text}
                </label>
              </div>
            ))}
          </>
        ) : null} */}
      </div>
    </div>
  );
}

export default App;
