import { useContext, useReducer } from "react";

export default function ToDo() {
  const ToDoItem = (props) => {
    const reducerElement = {
      actualCommand: "",
      id: null,
      toDoList: props.toDoList,
    };

    const reducer = (state, action) => {
      switch (action.actualCommand) {
        case "MoveUp":
          const index = state.toDoList.findIndex(action.id);
          if (index === 0) {
            return { ...state };
          }
          const actualToDoList = { ...state.toDoList };
          const actualToDoItem = actualToDoList[index];
          const beforeToDoItem = actualToDoList[index - 1];
          actualToDoList.splice(index, {
            ...beforeToDoItem,
            orderValue: index,
          });
          actualToDoList.splice(index - 1, {
            ...actualToDoItem,
            orderValue: index - 1,
          });

          return {
            ...state,
            actualCommand: "",
            id: null,
            toDoList: actualToDoList,
          };
          break;
        default:
          break;
      }
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
    const editToDo = () => {
      return;
    };
    const addToDo = () => {
      return;
    };
    const removeToDo = () => {
      return;
    };

    return props.toDoList
      .sort(
        (actualElement, nextElement) =>
          actualElement.orderValue - nextElement.orderValue
      )
      .map((element) => (
        <div
          key={element.ID}
          style={{ margin: "8px", border: "1px solid", padding: "8px" }}
        >
          <button onClick={moveToDo("UP", element.id)}>^</button>
          <input type="checkbox" />
          <button onClick={moveToDo("DOWN", element.id)}>v</button>
          <p>{element.content}</p>
          <button>Edit</button>
          <button>X</button>
        </div>
      ));
  };

  const toDoListArray = [
    {
      ID: 0,
      content: "Teste 1",
      orderValue: 0,
      delete: false,
      checked: false,
    },
    {
      ID: 1,
      content: "Teste 2",
      orderValue: 1,
      delete: false,
      checked: false,
    },
  ];

  const toDoItemInitial = {
    ID: null,
    content: "",
    orderValue: null,
    delete: false,
    checked: false,
  };

  return (
    <>
      <div style={{ margin: "8px", border: "1px solid", padding: "8px" }}>
        <p>ToDoContainer</p>
        <ToDoItem toDoList={toDoListArray} />
        <button>+</button>
      </div>
    </>
  );
}
