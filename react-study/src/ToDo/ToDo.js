import { useContext, useReducer } from "react";

export default function ToDo() {
  const toDoListArray = [
    {
      id: 0,
      content: "Teste 1",
      orderValue: 0,
      delete: false,
      checked: false,
    },
    {
      id: 1,
      content: "Teste 2",
      orderValue: 1,
      delete: false,
      checked: false,
    },
    {
      id: 2,
      content: "Teste 3",
      orderValue: 2,
      delete: false,
      checked: false,
    },
  ];

  const toDoItemInitial = {
    id: null,
    content: "",
    orderValue: null,
    delete: false,
    checked: false,
  };

  const ToDoItem = ({ toDoList, moveToDo }) => {
    return toDoList.map((element) => (
      <div
        key={element.id}
        style={{ margin: "8px", border: "1px solid", padding: "8px" }}
      >
        <p>{element.orderValue}</p>
        <button onClick={() => moveToDo("UP", element.id)}>^</button>
        <input type="checkbox" />
        <button onClick={() => moveToDo("DOWN", element.id)}>v</button>
        <p>{element.content}</p>
        <button>Edit</button>
        <button>X</button>
      </div>
    ));
  };

  const reducerElement = {
    actualCommand: "",
    id: null,
    toDoList: toDoListArray,
  };

  const reducer = (state, action) => {
    if (action.toDoList !== undefined) {
      switch (action.actualCommand) {
        case "MoveUp": {
          const index = state.toDoList.findIndex(
            (element) => element.id === action.id
          );
          if (index === 0) {
            return { ...state };
          }
          const actualToDoList = [...state.toDoList];
          const actualToDoItem = actualToDoList[index];
          const beforeToDoItem = actualToDoList[index - 1];
          actualToDoList.splice(index, 1, {
            ...beforeToDoItem,
            orderValue: actualToDoList[index].orderValue,
          });
          actualToDoList.splice(index - 1, 1, {
            ...actualToDoItem,
            orderValue: actualToDoList[index - 1].orderValue,
          });
          return {
            ...state,
            actualCommand: "",
            id: null,
            toDoList: actualToDoList,
          };
          break;
        }
        case "MoveDown": {
          const index = state.toDoList.findIndex(
            (element) => element.id === action.id
          );
          if (index === state.toDoList.length - 1) {
            return { ...state };
          }
          const actualToDoList = [...state.toDoList];
          const actualToDoItem = actualToDoList[index];
          const afterToDoItem = actualToDoList[index + 1];
          actualToDoList.splice(index, 1, {
            ...afterToDoItem,
            orderValue: actualToDoList[index].orderValue,
          });
          actualToDoList.splice(index + 1, 1, {
            ...actualToDoItem,
            orderValue: actualToDoList[index + 1].orderValue,
          });
          return {
            ...state,
            actualCommand: "",
            id: null,
            toDoList: actualToDoList,
          };
          break;
        }
        case "Check": {
          break;
        }
        default:
          break;
      }
    }
    return { ...state };
  };

  const [state, dispatch] = useReducer(reducer, reducerElement);

  const moveToDo = (direction, id) => {
    if (direction === "UP") {
      dispatch({ ...state, id: id, actualCommand: "MoveUp" });
    }
    if (direction === "DOWN") {
      dispatch({ ...state, id: id, actualCommand: "MoveDown" });
    }
    return;
  };
  const checkToDo = (id) => {
    dispatch({ ...state, id: id, actualCommand: "Check" });
    return;
  };
  const editToDo = () => {
    return;
  };
  const addToDo = () => {
    return;
  };
  const removeToDo = () => {
    return;
  };

  return (
    <>
      <div style={{ margin: "8px", border: "1px solid", padding: "8px" }}>
        <p>ToDoContainer</p>
        <ToDoItem toDoList={state.toDoList} moveToDo={moveToDo} />
        <button>+</button>
      </div>
    </>
  );
}
