import { key } from "localforage";
import { useReducer } from "react";

export default function ToDoObject() {
  let ID_Count = 4;
  const toDoList = {
    1: {
      id: 1,
      orderValue: 1,
      content: "Teste 1",
      checked: false,
      editting: false,
    },

    2: {
      id: 2,
      orderValue: 2,
      content: "Teste 2",
      checked: true,
      editting: false,
    },
    3: {
      id: 3,
      orderValue: 3,
      content: "Teste 3",
      checked: false,
      editting: false,
    },
    4: {
      id: 4,
      orderValue: 4,
      content: "Teste 4",
      checked: false,
      editting: false,
    },
  };

  const toDoDefault = {
    content: "",
    checked: false,
    editting: false,
  };

  const reducer = (state, condition) => {
    const { type, payload } = condition;
    if (state !== undefined) {
      const actualToDoList = { ...state };
      const actualID = payload.id ? payload.id : null;
      const actualItem = actualToDoList[actualID];
      switch (type) {
        case "toDo/moveUp":
          if (actualItem.orderValue > 1) {
            var index = Object.values(actualToDoList).findIndex(
              (item) => item.orderValue === actualItem.orderValue - 1
            );
            return {
              ...state,
              [actualID]: {
                ...actualItem,
                orderValue: actualItem.orderValue - 1,
              },
              [index + 1]: {
                ...Object.values(actualToDoList)[index],
                orderValue: actualItem.orderValue,
              },
            };
          }
          return { ...state };
        case "toDo/moveDown":
          if (actualItem.orderValue < Object.keys(actualToDoList).length) {
            var index = Object.values(actualToDoList).findIndex(
              (item) => item.orderValue === actualItem.orderValue + 1
            );
            console.log(index + 1, actualID);
            return {
              ...state,
              [actualID]: {
                ...actualItem,
                orderValue: actualItem.orderValue + 1,
              },
              [index + 1]: {
                ...Object.values(actualToDoList)[index],
                orderValue: actualItem.orderValue,
              },
            };
          }
          return { ...state };
        case "toDo/check":
          return {
            ...state,
            [actualID]: { ...actualItem, checked: !actualItem.checked },
          };

        default:
          return { ...state };
      }
    }
  };

  const [state, dispatch] = useReducer(reducer, toDoList);
  console.log("Rendenizou", state);

  const moveItem = (direction, id) => {
    if (direction === "UP") {
      dispatch({ type: "toDo/moveUp", payload: { id: id } });
    }
    if (direction === "DOWN") {
      dispatch({ type: "toDo/moveDown", payload: { id: id } });
    }
    return;
  };
  const checkItem = (id) => {
    dispatch({ type: "toDo/check", payload: { id: id } });
    return;
  };

  return (
    <>
      <div style={{ margin: "8px", border: "1px solid", padding: "8px" }}>
        {Object.values(state)
          .sort((a, b) => a.orderValue - b.orderValue)
          .map((element) => {
            return (
              <div
                key={element.id}
                style={{ margin: "8px", border: "1px solid", padding: "8px" }}
              >
                <ToDoItemPosControl
                  id={element.id}
                  move={moveItem}
                  check={checkItem}
                  checkBox={element.checked}
                />
                <ToDoItemContent
                  content={element.content}
                  order={element.orderValue}
                />
                <ToDoItemControl />
              </div>
            );
          })}
        <ToDoItemAdd />
      </div>
    </>
  );
}

const ToDoItemContent = ({ content, order }) => {
  return <p>{order + " " + content}</p>;
};

const ToDoItemPosControl = ({ id, move, check, checkBox }) => {
  return (
    <>
      <button onClick={() => move("UP", id)}>^</button>
      <input type="checkbox" onChange={() => check(id)} checked={checkBox} />
      <button onClick={() => move("DOWN", id)}>v</button>
    </>
  );
};

const ToDoItemControl = () => {
  return (
    <>
      <button>Edit</button>
      <button>Delete</button>
    </>
  );
};

const ToDoItemAdd = () => {
  return (
    <>
      <button>+</button>
    </>
  );
};
