import { useRef, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import axios from "axios";

// import DragSortableList from "react-drag-sortable";
import { Toaster, toast } from "react-hot-toast";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  let dragItem = useRef(null);
  let dragOverItem = useRef(null);

  const backendUrl = "http://localhost:5000";
  useEffect(() => {
    const fetchData = async () => {
      let todos = await axios.get(`${backendUrl}/`);
      const sortedTodos = todos.data.todos.sort(
        (item1, item2) => item1.position - item2.position
      );
      setTodos(sortedTodos);
      return todos;
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(newTodo);
    if (newTodo === "") {
      toast.error("Please add text first");
      return;
    }
    try {
      const todo = await axios.post(`${backendUrl}/add-todo`, {
        text: newTodo,
        status: "pending",
      });
      // console.log(todo.data.todo);
      setTodos((todos) => {
        return [...todos, todo.data.todo];
      });
      setNewTodo("");
    } catch (err) {
      console.log(err);
    }
  };
  const handleClick = async (todo) => {
    // console.log(todo);
    const res = await axios.patch(`http://localhost:5000/${todo._id}`, {...todo, status: todo.status === "pending" ? "complete" : "pending"})
    // console.log(res.data.todo)
    let newTodo = res.data.todo
    setTodos((todos) => {
      // console.log(todos)
      return todos.map((item) =>
        item === todo
          ? {
              ...newTodo
            }
          : item
      );
    });
  };

  const dragStart = (e, todo, index) => {
    // console.log("drag started");
    dragItem.current = index;
  };
  const dragEnter = (e, todo, index) => {
    dragOverItem.current = index;
  };

  const drop = async (e) => {
    let copyListItems = [...todos];
    // getting the item that is being dropped
    let dragItemContent = copyListItems[dragItem.current];
    let dragOverItemContent = copyListItems[dragOverItem.current];
    dragItemContent = { ...dragItemContent, position: dragOverItem.current };
    dragOverItemContent = {
      ...dragOverItemContent,
      position: dragItem.current,
    };
    // console.log(dragItemContent, "dragItemContent");
    // console.log(dragItem.current, "index of item being dropped");
    // console.log(dragOverItemContent, "dragItemContent");
    // console.log(dragOverItem.current, "index of item being replaced");
    // deleteing the item that is being dropped
    copyListItems.splice(dragItem.current, 1);
    // placing the item at another position
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);

    // console.log(copyListItems);
    dragItem.current = null;
    dragOverItem.current = null;
    copyListItems = copyListItems.map((todo, index) => ({
      ...todo,
      position: index,
    }));
    setTodos(copyListItems);
    const updatedTodos = await axios.put(
      "http://localhost:5000/update-all",
      copyListItems
    );
    // console.log(updatedTodos);
  };
  ///////////////////////////////////////////

  return (
    <div className="bg-slate-500 min-h-screen ">
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

        {todos.length !== 0 ? (
          <>
            {todos.map((todo, index) => (
              <div
                key={Math.floor(Math.random() * 10000)}
                // onClick={() => handleClick(todo)}
                className={
                  todo.status === "pending"
                    ? "flex items-center space-x-4 p-4 shadow-lg m-2"
                    : "line-through flex items-center space-x-4 p-4 shadow-lg m-2"
                }
                draggable
                // onDragStartCapture={(e) => dragStart(e, index)}
                onDragStart={(e) => dragStart(e, todo, index)}
                onDragEnter={(e) => dragEnter(e, todo, index)}
                // onDragEnter={(e) => (dragOverItem.current = index)}
                onDragEnd={drop}
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
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
}

export default App;
