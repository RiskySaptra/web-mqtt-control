import { useEffect, useState } from "react";
import mqttClient from "./lib/config";

function App() {
  const [messages, setMessages] = useState<any>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    mqttClient.on("connect", function () {
      setIsConnected(true);
      console.log("connected");
    });

    mqttClient.subscribe("testing/nabila", function () {
      console.log("subscribed to ", "testing/nabila");
    });

    mqttClient.on("message", function (topic, message) {
      if (topic == "testing/nabila") {
        const json = JSON.parse(message.toString());
        console.log(json);

        setMessages(json);
      }
    });
  }, []);

  const mqttPublish = (key: any) => {
    const payload = { ...messages };

    payload[key].state = !payload[key].state;

    if (isConnected) {
      mqttClient.publish(
        "testing/nabila",
        JSON.stringify(payload),
        { qos: 0 },
        (error) => {
          if (error) {
            console.log("Publish error: ", error);
          }
        }
      );
    }
  };

  return (
    <div className="container mx-auto pt-10">
      <div className="flex p-5 md:p-0">
        <p className="my-2 md:text-[30px] text-[20px] font-bold">
          MQTT KONTOL Prototype
        </p>
        <svg height="30" width="30" xmlns="http://www.w3.org/2000/svg">
          <circle r="10" cx="15" cy="15" fill={isConnected ? "green" : "red"} />
        </svg>
      </div>

      <div className="grid md:grid-cols-4 grid-cols-1 gap-4 p-5 md:p-0">
        {Object.entries(messages).map(([key, value]: any) => {
          return (
            <div key={key} className="bg-gray-200 p-10">
              <p> {key}</p>
              <p> {value.state ? "Active" : "Non Active"}</p>
              <button
                onClick={() => mqttPublish(key)}
                className="bg-blue-400 px-2 py-1 rounded-sm mt-5"
              >
                {value.state ? "Set Non Active" : "Set Active"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
