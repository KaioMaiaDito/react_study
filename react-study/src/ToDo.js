import { useReducer, useState } from "react";

//Transformar o ToDoListArray em um Objeto de Objetos
//Mudar os comandos do dispatch para o tipo {type: ... payload: {}}
//Alterar a ordenação usando o sort e o orderValue.

let IDNUMBER = 3;
export default function ToDo() {
  const toDoListArray = [
    {
      id: 0,
      content: "Teste 1",
      delete: false,
      checked: false,
      editting: false,
    },
    {
      id: 1,
      content: "Teste 2",
      delete: false,
      checked: true,
      editting: false,
    },
    {
      id: 2,
      content: "Teste 3",
      delete: false,
      checked: false,
      editting: false,
    },
  ];
  const toDoListObject = {
    1: {
      content: "Teste 1",
      delete: false,
      checked: false,
      editting: false,
    },

    2: {
      content: "Teste 2",
      delete: false,
      checked: true,
      editting: false,
    },
    3: {
      content: "Teste 3",
      delete: false,
      checked: false,
      editting: false,
    },
  };

  const toDoItemInitial = {
    id: null,
    content: "",
    delete: false,
    checked: false,
    editting: false,
  };

  const reducerElement = {
    toDoList: toDoListArray,
  };

  const reducer = (state, condition) => {
    const { type, payload } = condition;
    if (state.toDoList !== undefined) {
      const index =
        payload !== undefined
          ? state.toDoList.findIndex((element) => element.id === payload.id)
          : null;
      switch (type) {
        case "toDo/moveUp": {
          if (index === 0) {
            return { ...state };
          }
          const actualToDoList = [...state.toDoList];
          actualToDoList.splice(
            index - 1,
            0,
            ...actualToDoList.splice(index, 1)
          );
          return {
            ...state,
            id: null,
            toDoList: actualToDoList,
          };
        }
        case "toDo/moveDown": {
          if (index === state.toDoList.length - 1) {
            return { ...state };
          }
          const actualToDoList = [...state.toDoList];
          actualToDoList.splice(
            index + 1,
            0,
            ...actualToDoList.splice(index, 1)
          );
          return {
            ...state,
            id: null,
            toDoList: actualToDoList,
          };
        }
        case "toDo/check": {
          const actualToDoList = [...state.toDoList];
          actualToDoList.splice(index, 1, {
            ...actualToDoList[index],
            checked: !actualToDoList[index].checked,
          });
          return {
            ...state,
            toDoList: actualToDoList,
          };
        }
        case "toDo/addNew": {
          const actualToDoList = [...state.toDoList];
          const newToDoItem = actualToDoList.concat(toDoItemInitial);
          return {
            ...state,
            type: "toDo/addedNew",
            toDoList: newToDoItem,
          };
        }
        case "toDo/cancelNew": {
          const actualToDoList = [...state.toDoList];
          actualToDoList.pop();
          return {
            ...state,
            toDoList: actualToDoList,
          };
        }
        case "toDo/cancelEdit": {
          const actualToDoList = [...state.toDoList];
          actualToDoList[index] = { ...actualToDoList[index], editting: false };
          return {
            ...state,
            toDoList: actualToDoList,
          };
        }
        case "toDo/saveNew": {
          const actualToDoList = [...state.toDoList];
          actualToDoList[actualToDoList.length - 1] = {
            id: IDNUMBER,
            content: payload.text,
            delete: false,
            checked: false,
            editting: false,
          };
          IDNUMBER++; //Mudar depois!!
          return {
            ...state,
            text: "",
            toDoList: actualToDoList,
          };
        }
        case "toDo/removeItem": {
          const actualToDoList = [...state.toDoList];
          actualToDoList.splice(index, 1);
          return {
            ...state,
            id: null,
            toDoList: actualToDoList,
          };
        }
        case "toDo/edit": {
          const actualToDoList = [...state.toDoList];
          actualToDoList[index] = { ...actualToDoList[index], editting: true };
          return {
            ...state,
            text: "",
            toDoList: actualToDoList,
          };
        }
        case "toDo/saveEdit": {
          const actualToDoList = [...state.toDoList];
          actualToDoList[index] = {
            //id: action.toDoList[index].id,
            content: payload.text,
            delete: false,
            checked: false,
            editting: false,
          };

          return {
            ...state,
            text: "",
            toDoList: actualToDoList,
          };
        }
        default:
          break;
      }
    }
    return { ...state };
  };

  const [state, dispatch] = useReducer(reducer, reducerElement);
  const [textToDo, setTextToDo] = useState(toDoItemInitial.content);

  const moveToDo = (direction, id) => {
    if (direction === "UP") {
      dispatch({ type: "toDo/moveUp", payload: { id: id } });
    }
    if (direction === "DOWN") {
      dispatch({ type: "toDo/moveDown", payload: { id: id } });
    }
    return;
  };
  const checkToDo = (id) => {
    dispatch({ type: "toDo/check", payload: { id: id } });
    return;
  };

  const addToDo = () => {
    dispatch({ type: "toDo/addNew" });
    return;
  };
  const saveToDo = (text) => {
    dispatch({ type: "toDo/saveNew", payload: { text: text } });
    setTextToDo("");
    return;
  };
  const cancelNewToDo = () => {
    dispatch({ type: "toDo/cancelNew" });
    setTextToDo("");
    return;
  };

  const editToDo = (id) => {
    const index = state.toDoList.findIndex((element) => element.id === id);
    setTextToDo(String(state.toDoList[index].content));

    dispatch({ type: "toDo/saveEdit", payload: { id: id } });
    return;
  };
  const saveEditToDo = (id, text) => {
    dispatch({ type: "toDo/saveEdit", payload: { id: id, text: text } });
    setTextToDo("");
    return;
  };
  const cancelEditToDo = (id) => {
    dispatch({ type: "toDo/cancelEdit", payload: { id: id } });
    return;
  };

  const removeToDo = (id) => {
    dispatch({ type: "toDo/removeItem", payload: { id: id } });
    return;
  };
  console.log(state);
  return (
    <>
      <div style={{ margin: "8px", border: "1px solid", padding: "8px" }}>
        <p>ToDoContainer</p>
        <ToDoItem
          toDoList={state.toDoList}
          moveToDo={moveToDo}
          checkToDo={checkToDo}
          removeToDo={removeToDo}
          editToDo={editToDo}
          saveEditToDo={saveEditToDo}
          cancelEditToDo={cancelEditToDo}
          onChange={(value) => {
            setTextToDo(value);
          }}
          value={textToDo}
        />
        {state.actualCommand === "toDo/addedNew" && (
          <AddedToDoItem
            onChange={(value) => {
              setTextToDo(value);
            }}
            value={textToDo}
            save={saveToDo}
            cancel={cancelNewToDo}
          />
        )}
        {state.actualCommand !== "toDo/addedNew" && (
          <button onClick={() => addToDo()}>+</button>
        )}
      </div>
    </>
  );
}

const AddedToDoItem = ({ save, cancel, onChange, value }) => {
  const changeText = (event) => {
    onChange(event.target.value);
  };
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        save(value);
      }}
      style={{ margin: "8px", border: "1px solid", padding: "8px" }}
    >
      <label>
        <input
          type="text"
          name="toDoText"
          value={value}
          placeholder="Insira seu texto aqui..."
          onChange={changeText}
        />
      </label>
      <button type="submit">SAVE</button>
      <button type="button" onClick={() => cancel()}>
        CANCEL
      </button>
    </form>
  );
};

const ToDoItem = ({
  toDoList,
  moveToDo,
  checkToDo,
  removeToDo,
  editToDo,
  saveEditToDo,
  onChange,
  cancelEditToDo,
  value,
}) => {
  const changeText = (event) => {
    onChange(event.target.value);
  };
  return toDoList.map((element) => {
    return element.content !== null ? (
      <div
        key={element.id}
        style={{ margin: "8px", border: "1px solid", padding: "8px" }}
      >
        <button onClick={() => moveToDo("UP", element.id)}>^</button>
        <input
          type="checkbox"
          onChange={() => checkToDo(element.id)}
          checked={element.checked}
        />
        <button onClick={() => moveToDo("DOWN", element.id)}>v</button>
        {element.editting ? (
          <input
            type="text"
            name="toDoText"
            value={value}
            placeholder="Insira seu texto aqui..."
            onChange={changeText}
          />
        ) : (
          <p>{element.content}</p>
        )}
        {element.editting ? (
          <button onClick={() => saveEditToDo(element.id, value)}>EDIT</button>
        ) : (
          <button onClick={() => editToDo(element.id)}>Edit</button>
        )}

        {element.editting ? (
          <button type="button" onClick={() => cancelEditToDo(element.id)}>
            CANCEL
          </button>
        ) : (
          <button onClick={() => removeToDo(element.id)}>X</button>
        )}
      </div>
    ) : null;
  });
};
