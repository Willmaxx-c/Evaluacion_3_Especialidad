import React, { Fragment, useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "bootstrap/dist/css/bootstrap.min.css";
import { ListaCompraItem } from "./listacompraitem.jsx";
import "./pag.css";

export function ListaCompra() {
  const [todos, setTodos] = useState([]);
  const listaRef = useRef();
  const numeroRef = useRef();
  const categoriaRef = useRef();
  const notasRef = useRef();
  const montoRef = useRef();
  const [listaVacia, setListaVacia] = useState(false);
  const [numeroVacio, setNumeroVacio] = useState(false);
  const [montoVacio, setMontoVacio] = useState(false);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null);
  const [recordatorio, setRecordatorio] = useState(false);
  const [productosComprados, setProductosComprados] = useState([]);
  const [informeGenerado, setInformeGenerado] = useState(false);

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTask = () => {
    const lista = listaRef.current.value.trim();
    const numero = numeroRef.current.value.trim();
    const categoria = categoriaRef.current.value.trim();
    const notas = notasRef.current.value.trim();
    const monto = montoRef.current.value.trim();

    if (!/^[a-zA-Z]+$/.test(lista)) {
      setListaVacia(true);
      return;
    }
    if (!/^\d+$/.test(numero)) {
      setNumeroVacio(true);
      return;
    }
    if (!/^\d+$/.test(monto)) {
      setMontoVacio(true);
      return;
    }

    listaRef.current.value = "";
    numeroRef.current.value = "";
    categoriaRef.current.value = "";
    notasRef.current.value = "";
    montoRef.current.value = "";
    setListaVacia(false);
    setNumeroVacio(false);
    setMontoVacio(false);

    const nuevalista = {
      id: uuidv4(),
      lista: lista,
      numero: numero,
      categoria: categoria,
      notas: notas,
      monto: monto,
      completed: false,
      importante: false,
    };

    setTodos((prevTodos) => [...prevTodos, nuevalista]);
  };

  const cambiarEstadoLista = (id) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTarjetaSeleccionada(id);
    setTodos(newTodos);
  };

  const contadorListas = () => {
    return todos.filter((todo) => !todo.completed).length;
  };

  const eliminarListas = () => {
    const newTodos = todos.filter((todo) => !todo.completed);
    setTodos(newTodos);
  };

  const listaImportante = (id) => {
    if (id !== null) {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, importante: !todo.importante };
        }
        return todo;
      });
      setTodos(newTodos);
    }
  };

  const eliminarLista = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };

  const cambiarColorTarjeta = () => { };

  function calcularMontoTotal() {
    return todos.reduce((total, todo) => total + parseFloat(todo.monto), 0);
  }

  const mostrarRecordatorio = () => {
    if (tarjetaSeleccionada) {
      const tarjetaPendiente = todos.find((todo) => todo.id === tarjetaSeleccionada && !todo.completed);
      if (tarjetaPendiente) {
        alert("¡Tienes compras pendiente!");
      } else {
        alert("No hay compras pendientes para esta tarjeta.");
      }
    }
    setRecordatorio(!recordatorio);
  };

  const generarInforme = () => {
    const comprados = todos.filter((todo) => todo.completed);
    setProductosComprados(comprados);
    setInformeGenerado(true);
  };

  const ResumenListas = () => {
    const cant = contadorListas();
    const montoTotal = calcularMontoTotal();

    if (cant === 0) {
      return (
        <div className="alert alert-success mt-3 mb-3 m-5 text-center">
          Felicidades, no tienes Compras pendientes <i className="bi bi-emoji-smile"></i>
          <br />
          El monto total es: ${montoTotal.toFixed(0)}
        </div>
      );
    }

    if (cant === 1) {
      return (
        <div className="alert alert-info mt-3 mb-3 m-5 text-center">
          Te queda {cant} Lista de Compras <i className="bi bi-emoji-neutral-fill"></i>
          <br />
          El monto total es: ${montoTotal.toFixed(0)}
        </div>
      );
    }

    return (
      <div className="alert alert-warning mt-3 mb-3 m-5 text-center">
        Te quedan {cant} Listas de Compra pendientes <i className="bi bi-emoji-frown-fill"></i>
        <br />
        El monto total es: ${montoTotal.toFixed(0)}
      </div>
    );
  };

  return (
    <Fragment>
      <h1 className="text-center mt-5 text-white">Lista de Compras</h1>

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="mb-3">
            <input className={`form-control ${listaVacia ? "is-invalid" : ""}`} placeholder="Nombre del producto" ref={listaRef}></input>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="mb-3">
            <input className={`form-control ${numeroVacio ? "is-invalid" : ""}`} placeholder="Cantidad necesaria" ref={numeroRef}></input>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="mb-3">
            <input className="form-control" placeholder="Categoría" ref={categoriaRef}></input>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="mb-3">
            <input className="form-control" placeholder="Notas adicionales" ref={notasRef}></input>
          </div>
        </div>
        <div className="row  justify-content-center">
          <div className="mb-3">
            <input className={`form-control ${montoVacio ? "is-invalid" : ""}`} placeholder="Monto en dinero" ref={montoRef}></input>
          </div>
        </div>
        <div className="row mt-3 mb-3 m-5 justify-content-center">
          <div className="col-lg-8 col-md-10 col-sm-12">
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <button className="btn btn-success btn-lg" onClick={addTask}>
                <i className="bi bi-plus-circle"></i> Agregar Lista
              </button>
              <button className="btn btn-danger btn-lg" onClick={eliminarListas}>
                <i className="bi bi-trash3"></i> Eliminar Lista
              </button>
              <button className="btn btn-success btn-lg" onClick={() => listaImportante(tarjetaSeleccionada)}>
                <i className="bi bi-plus-circle"></i> Lista Comprada
              </button>
              <button className="btn btn-primary btn-lg" onClick={mostrarRecordatorio}>
                <i className="bi bi-plus-circle"></i> Recordatorio
              </button>
              <button className="btn btn-primary btn-lg" onClick={generarInforme}>
                Generar Informe
              </button>
            </div>
          </div>
        </div>
      </div>

      {listaVacia && <div className="alert alert-danger">El campo 'Nombre del producto' no puede estar vacío</div>}
      {numeroVacio && <div className="alert alert-danger">El campo 'Cantidad necesaria' no puede estar vacío</div>}
      {montoVacio && <div className="alert alert-danger">El campo 'Monto de dinero' no puede estar vacío</div>}

      <div className="container expense-tracker-container order-sm-first order-lg-last text-center">
        <div className="mb-3">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
            {todos.map((todo) => (
              <div key={todo.id} className="col mb-3">
                <div className={`card ${todo.importante ? "important" : ""}`}>
                  <button className="btn btn-danger btn-sm card-remove-button" onClick={() => eliminarLista(todo.id)}>
                    <i className="bi bi-x"></i>
                  </button>
                  <div className="card-body">
                    <ListaCompraItem todo={todo} cambiarEstado={cambiarEstadoLista} cambiarColorTarjeta={cambiarColorTarjeta} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {informeGenerado && (
        <div className="container expense-tracker-container order-sm-first order-lg-last text-center">
          <div className="mb-3">
            <h3 className="text-center mt-5 text-white">Informe de Productos Comprados</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {productosComprados.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.lista}</td>
                    <td>${producto.monto}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>Total</td>
                  <td>${calcularMontoTotal().toFixed(0)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      <ResumenListas />
    </Fragment>
  );
}

