import React from "react";

export function ListaCompraItem({ todo, cambiarEstado, cambiarColorTarjeta }) {
  const { id, lista, numero, categoria, notas, monto, completed } = todo;

  const handleCheckboxChange = () => {
    cambiarEstado(id);
    cambiarColorTarjeta(id);
  };

  return (
    <li className={` col 4 mt-3 d-flex p-2 list-group-item ${completed ? "completed " : ""}`}>
      <div className="form-check">
        <input
          className="form-check-input col 4 mt-3 d-flex p-2  "
          type="checkbox"
          checked={completed}
          onChange={handleCheckboxChange}
        />
        <label className="form-check-label">
          <p>Producto: {lista}</p>
          <p>Cantidad a comprar:{numero}</p>
          <p>{categoria}</p>
          <p>{notas}</p>
          <p>Monto: ${monto}</p>
        </label>
      </div>
    </li>
  );
}


