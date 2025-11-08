const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const app = express();

// POST endpoint สำหรับรับข้อมูลจากฟอร์ม React
app.post("/machine/machineRegisterIP", (req, res) => {
    const { ip_address, system_no, address_type, address_no } = req.body;

    const argument_str = `IP_${ip_address},SystemNo_${system_no},AddressType_${address_type},Address_${address_no}`;

    fs.access("java/writeAddress.sh", fs.constants.X_OK, (err) => {
        if (err) {
            console.error("Shell script writeAddress.sh is not executable or not found");
            return res.status(403).send({ message: "Shell script writeAddress.sh is not executable or not found" });
        }

        exec(`cd java && ./writeAddress.sh ${argument_str}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Execution error: ${error.message}`);
                return res.status(500).send({ message: `Execution error: ${error.message}` });
            }

            if (stderr) {
                // ตรวจสอบเฉพาะข้อความ stderr ที่เป็นข้อผิดพลาดจริง
                if (!stderr.includes("load FwLibJNI.dll OK") && !stderr.includes("@ConnectMc handle")) {
                    console.error(`Unexpected stderr: ${stderr}`);
                    return res.status(500).send({ message: `stderr: ${stderr}` });
                }
            }

            // // ตรวจสอบผลลัพธ์จาก stdout
            // console.log(`stdout: ${stdout}`);
            // if (stdout.includes("ADDRESSON")) {
            //     return res.status(200).send({ message: "Machine is ON, ready for insertion" });
            // } else if (stdout.includes("ADDRESSOFF")) {
            //     return res.status(400).send({ message: "Machine is OFF, not ready for insertion" });
            // } else {
            //     console.error("Unknown machine status");
            //     return res.status(500).send({ message: "Unknown machine status" });
            // }

            // ตรวจสอบผลลัพธ์จาก stdout
            console.log(`stdout: ${stdout}`);
            if (stdout.includes("ADDRESSON") || stdout.includes("machine status check")) {
                return res.status(200).send({ message: "Machine is ON, ready for insertion or status check passed" });
            } else if (stdout.includes("ADDRESSOFF")) {
                return res.status(400).send({ message: "Machine is OFF, not ready for insertion" });
            } else {
                console.error("Unknown machine status");
                return res.status(500).send({ message: "Unknown machine status" });
            }

        });
    });
});

  
  module.exports = app;