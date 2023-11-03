function TextInput(props) {
  const changed = (event) => {
    props.chg(event.target.value);
  };

  return (

    <input className="input"
      placeholder={props.placeholder || "..."}
      value={props.vl}
      type={props.type}
      onChange={changed}
    />
  );
}

export default TextInput;
