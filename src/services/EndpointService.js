import ConfigurationService from "@/services/ConfigurationService";
import { reactive, toRefs } from "vue";

export default function endpointService() {
  let conf = ConfigurationService.getConfiguration();
  let conn;

  const endpointService = reactive({
    connected: false,
    message: "",
    endpoints: fakeEndpoints()
  });

  function newConnection() {
    let url =
      (conf.ssl ? "wss://" : "ws://") + conf.server + ":" + conf.port + "/ws";

    conn = new WebSocket(url);

    conn.onerror = function(event) {
      connectionOnError(event);
    };

    conn.onopen = function(event) {
      // sending registration information
      conn.send(
        JSON.stringify({
          action: "register",
          sender: conf.address,
          data: conf.api_key
        })
      );
      console.log(event);
    };

    conn.onmessage = function(event) {
      connectionOnMessage(event);
    };

    conn.onclose = function(event) {
      connectionOnClose(event);
    };
  }

  function connectionOnError(event) {
    console.log("Error connecting server --> " + event.returnValue);
  }

  function connectionOnClose(event) {
    console.log("Connection closed by peer --> " + event.data);
    endpointService.connected = false;
    conn = null;
    setTimeout(() => {
      newConnection();
    }, 5000);
  }

  function connectionOnMessage(event) {
    let received = { Action: "", Data: {}, Sender: {}, Receiver: {} };
    received = JSON.parse(event.data);

    let receiver = {
      domain: conf.address.domain,
      type: "*",
      host: "*",
      address: "*",
      id: "*"
    };

    console.log(received);
    switch (received.Action) {
      case "accepted":
        endpointService.connected = true;
        // conn.send(
        //   JSON.stringify({
        //     action: "cmd",
        //     sender: conf.address,
        //     receiver: receiver,
        //     data: "read"
        //   })
        // );
        conn.send(
          JSON.stringify({
            action: "discover",
            sender: conf.address,
            receiver: receiver,
            data: ""
          })
        );
        break;
      case "notify":
        console.log(received.Data);
        endpointService.message = received.Data;
        break;
      case "value":
        endpointService.message =
          received.Data.description +
          " (" +
          received.Data.type +
          ") " +
          received.Data.value +
          (received.Data.unit ? " " + received.Data.unit : "");

        console.log(endpointService.message);
        break;
      case "inform":
        endpointService.endpoints = received.Data;
        break;
      case "read":
        break;
      default:
        console.log("Unknown action for this message --> " + received);
    }
  }

  function fakeEndpoints() {
    return [];
    /*
    return [
      {
        name: "joran.endpoint.pizero01.32.7",
        description: "Commanded push button",
        address: {
          domain: "joran",
          type: "endpoint",
          host: "pizero01",
          address: "32",
          id: "7"
        },
        ic: {
          address: 32,
          type: "mcp23008",
          name: "32",
          description: "I/O expander module 0x20"
        },
        attributes: {
          mode: "push",
          duration: 5000
        },
        notification: {
          telegram: false
        }
      },
      {
        name: "joran.endpoint.pizero01.72.AIN1",
        description: "Ohm meter",
        address: {
          domain: "joran",
          type: "endpoint",
          host: "pizero01",
          address: "72",
          id: "AIN1"
        },
        ic: {
          address: 72,
          type: "ads1115",
          name: "ADC",
          description: "Analog/Digital Converter"
        },
        attributes: {
          mode: "value",
          unit: "[KOhm]",
          scale: 0.001,
          vcc: 5.07,
          refresh_interval: 30,
          reference: 330000,
          convert: "OhmMeter"
        },
        notification: {
          telegram: false
        }
      },
      {
        name: "joran.endpoint.pizero01.32.3",
        description: "Yellow LED",
        address: {
          domain: "joran",
          type: "endpoint",
          host: "pizero01",
          address: "32",
          id: "3"
        },
        ic: {
          address: 32,
          type: "mcp23008",
          name: "32",
          description: "I/O expander module 0x20"
        },
        attributes: {
          state: 0,
          mode: "output"
        },
        notification: {
          telegram: true
        }
      }
    ];
    */
  }

  return { ...toRefs(endpointService), newConnection };
}
