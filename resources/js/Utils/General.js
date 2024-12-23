class General {

  static set = (name, value) => {
    General[name] = value;
  }

  static get = (name) => {
    return General[name] ?? null
  }
}

export default General