import React, { useState } from "react";
import "./Form.css";

const Form = () => {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const input = document.getElementById("input-route");
    input.select();
    document.execCommand("copy");
    setCopied(true);
    popup();
    return;
  };

  const popup = () => {
    setTimeout(() => {
      setCopied(false);
      return;
    }, 5000);
  };

  return (
    <div className="form-container">
      {copied ? <div className="form-copy">Copié</div> : null}
      <h4>
     Sélectionnez les candidats
      </h4>
      <div className="input-container">
        <input
          id="input-route"
          type="text"
          placeholder="Some route"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div onClick={copy}>COPIER</div>
      </div>
      <div className="form-button">INVITER</div>
      <p>
        Vous bénéficiez du module interview de manière illimité jusqu'au
        19/07/2019. Après quoi, vous aurez un quota de 3 heures par mois.
      </p>
    </div>
  );
};

export default Form;
