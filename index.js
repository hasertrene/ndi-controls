const easymidi = require("easymidi");
// const http = require("http");
const Cam = require("onvif").Cam;

let presetArray = [];
const CAMERA_HOST = "2.0.0.6",
  CAMERA_NAME = "Midi Fighter Twister",
  USERNAME = "admin",
  PASSWORD = "admin",
  PORT = 2000;

const input = new easymidi.Input(CAMERA_NAME);

if (!input) {
  throw new Error("No MIDI input found");
}

const cam = new Cam(
  {
    hostname: CAMERA_HOST,
    username: USERNAME,
    password: PASSWORD,
    port: PORT,
  },
  function (err) {
    if (err) {
      console.log(
        "Connection Failed for " +
          CAMERA_HOST +
          " Port: " +
          PORT +
          " Username: " +
          USERNAME +
          " Password: " +
          PASSWORD
      );
      return;
    }

    console.log("Camera connected: " + CAMERA_HOST + " Port: " + PORT);

    this.getPresets({}, function (err, presets) {
      if (err) {
        console.error(err);
      }

      presetArray = presets;
      console.log("Presets loaded: ", presets);
    });

    // THIS IS THE STREAMING PART
    // this.getStreamUri({ protocol: "RTSP" }, function (err, stream) {
    // http
    // .createServer(function (req, res) {
    // res.writeHead(200, { "Content-Type": "text/html" });
    // console.log(stream)
    // res.end(
    // "<html><body>" +
    // '<video target="' +
    // stream.uri +
    // '"></video>' +
    // "</boby></html>"
    // );
    // })
    // .listen(3030);
    // });
  }
);

const step = 0.3;
const zoom = 0.3;
const speed = 1;
let i;

input.on("noteoff", function (msg) {
  console.log("NoteOFF:", msg)
  
  i && clearInterval(i);
  i !== null && cam.stop({}, console.log);
});

input.on("noteon", function (msg) {
  console.log("NoteON:", msg);
  switch (msg.note) {
    case 84:
      i = null;
      setPreset(0);
      break;
    case 85:
      i = null;
      setPreset(1);
      break;
    case 86:
      i = null;
      setPreset(2);
      break;
    case 87:
      i = null;
      setPreset(3);
      break;
    case 88:
      i = null;
      setPreset(4);
      break;
    case 89:
      i = null;
      setPreset(5);
      break;
    case 90:
      i = null;
      setPreset(6);
      break;
    case 91:
      i = null;
      setPreset(7);
      break;
    case 92:
      // PAN plus
      i = setInterval(function () {
        cam.continuousMove(
          { x: step, speed, onlySendPanTilt: true },
          console.log
        );
      }, 200);
      break;
    case 93:
      // PAN minus
      i = setInterval(function () {
        cam.continuousMove(
          { x: -step, speed, onlySendPanTilt: true },
          console.log
        );
      }, 200);
      break;
    case 94:
      // TILT plus
      i = setInterval(function () {
        cam.continuousMove(
          { y: step, speed, onlySendPanTilt: true },
          console.log
        );
      }, 200);
      break;
    case 95:
      // TILT minus
      i = setInterval(function () {
        cam.continuousMove(
          { y: -step, speed, onlySendPanTilt: true },
          console.log
        );
      }, 200);
      break;
    case 96:
      // ZOOM plus
      i = setInterval(function () {
        cam.relativeMove({ speed, zoom: 1 }, console.log);
      }, 200);
      break;
    case 97:
      // ZOOM minus
      i = setInterval(function () {
        cam.relativeMove({ speed, zoom: 0 }, console.log);
      }, 200);
      break;
  }
});

const setPreset = (preset) => {
  if (preset === NaN) {
    throw new Error("Preset is not a number");
  }
  cam.gotoPreset({ preset: presetArray[preset] }, console.log);
};
