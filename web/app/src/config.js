// //config.js

// import { io } from "socket.io-client";

// // สร้าง socket ตาม IP/host ปัจจุบันของเบราว์เซอร์
// const socket = io(`${window.location.protocol}//${window.location.hostname}:${window.location.port}`);

// const config = {
//   api_path: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`,
//   token_name: "pos_token",
//   socket, // ✅ เพิ่ม socket เข้าไป
//   headers: () => {
//     return {
//       headers: {
//         Authorization: "Bearer " + localStorage.getItem("pos_token"),
//       },
//     };
//   },
// };

// export default config;


//---- Start Improve Dev ------------------------------------------------

import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // หรือเปลี่ยนเป็น IP จริงเมื่อ deploy เช่น: io("http://192.168.1.10:3000")

const config = {
  api_path: "http://localhost:3000",
  token_name: "pos_token",
  socket, // ✅ เพิ่ม socket เข้าไปใน config
  headers: () => {
    return {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("pos_token"),
      },
    };
  },
};

export default config;




