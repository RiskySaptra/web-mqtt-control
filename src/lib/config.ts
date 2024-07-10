import mqtt from 'mqtt';

const client = mqtt.connect(`wss://broker.emqx.io/mqtt`, {
  port: 8084,
  username: '',
  password: '',
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
});

client.on('connect', function () {
  console.log('connected');
});

export default client;