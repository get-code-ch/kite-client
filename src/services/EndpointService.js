import { reactive, toRefs } from "vue";

export default function endpointService(conf) {
  let conn;

  const endpointService = reactive({
    connected: false,
    message: "",
    value: "",
    endpoints: fakeEndpoints()
  });

  function newConnection(address, endpoint) {
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
          sender: address,
          data: conf.api_key
        })
      );
      console.log(event);
    };

    conn.onmessage = function(event) {
      connectionOnMessage(event, address, endpoint);
    };

    conn.onclose = function(event) {
      connectionOnClose(event, address);
    };
  }

  function readValue(address, endpoint) {
    conn.send(
      JSON.stringify({
        action: "cmd",
        sender: address,
        receiver: endpoint.address,
        data: "read"
      })
    );
  }

  function connectionOnError(event) {
    console.log("Error connecting server --> " + event.returnValue);
  }

  function connectionOnClose(event, address) {
    console.log("Connection closed by peer --> " + event.data);
    endpointService.connected = false;
    conn = null;
    setTimeout(() => {
      newConnection(address);
    }, 5000);
  }

  function connectionOnMessage(event, address, endpoint) {
    let received = JSON.parse(event.data);

    let receiver = {
      domain: conf.address.domain,
      type: "*",
      host: "*",
      address: "*",
      id: "*"
    };

    //console.log(received);
    let sender = null;
    switch (received.action) {
      case "accepted":
        endpointService.connected = true;
        if (received.receiver.id === "*") {
          conn.send(
            JSON.stringify({
              action: "discover",
              sender: conf.address,
              receiver: receiver,
              data: ""
            })
          );
        }
        break;
      case "notify":
        if (address?.id === "*" || match(received.receiver, address)) {
          endpointService.message = received.data;
        }
        break;
      case "value":
        sender = stringToAddress(received.data?.name);
        if (match(sender, endpoint)) {
          endpointService.value = received.data.unit
            ? received.data.value.toFixed(2) + " " + received.data.unit
            : received.data.value;
        }
        break;
      case "inform":
        endpointService.endpoints = received.data;
        break;
      case "read":
        break;
      default:
        console.log("Unknown action for this message --> " + received);
    }
  }

  function match(endpoint1, endpoint2) {
    return (
      endpoint1?.domain === endpoint2?.domain &&
      endpoint1?.type === endpoint2?.type &&
      endpoint1?.host === endpoint2?.host &&
      endpoint1?.address === endpoint2?.address &&
      endpoint1?.id === endpoint2?.id
    );
  }

  function stringToAddress(addressString) {
    let address = { domain: "*", type: "*", host: "*", address: "*", id: "*" };
    const addressArray = addressString.split(".");

    if (addressArray.length > 0) {
      address.domain = addressArray[0];
    }
    if (addressArray.length > 1) {
      address.type = addressArray[1];
    }
    if (addressArray.length > 2) {
      address.host = addressArray[2];
    }
    if (addressArray.length > 3) {
      address.address = addressArray[3];
    }
    if (addressArray.length > 4) {
      address.id = addressArray[4];
    }

    return address;
  }

  function fakeEndpoints() {
    return [];
    /*
    return [
      {
        name: "fake.endpoint.host.32.7",
        description: "Fake push button",
        address: {
          domain: "fake",
          type: "endpoint",
          host: "host",
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
      }
    ];
    */
  }

  return { ...toRefs(endpointService), newConnection, readValue };
}
