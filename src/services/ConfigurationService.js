export default {
  uUIDGenerator() {
    const UUIDGeneratorBrowser = () =>
      ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      );
    return UUIDGeneratorBrowser();
  },
  apiKeyGenerator(length) {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789§°+*ç%&/(()=?-";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  getConfiguration() {
    let configuration = JSON.parse(localStorage.getItem("kite_configuration"));

    if (configuration == null) {
      configuration = {
        name: "",
        description: "",
        server: "",
        port: 443,
        ssl: true,
        api_key: this.apiKeyGenerator(30),
        enabled: false,
        address: {
          id: "*",
          address: this.uUIDGenerator(),
          host: "",
          type: "browser",
          domain: ""
        }
      };
      return configuration;
    } else {
      return configuration;
    }
  },

  saveConfiguration(configuration) {
    localStorage.setItem("kite_configuration", JSON.stringify(configuration));
  }
};
