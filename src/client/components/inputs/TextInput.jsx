function TextInput(props) {
  const changed = (event) => {
    props.chg(event.target.value);
  };

  return (
    <input
      placeholder={props.placeholder || "..."}
      className={`form-control ${props.className || ""}`}
      value={props.vl}
      type={props.type}
      onChange={changed}
    />
  );
}

export default TextInput;
