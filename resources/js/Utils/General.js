class General {

  static set = (name, value) => {
    General[name] = value;
  }

  static get = (name) => {
    return General[name]
  }
}

export default General