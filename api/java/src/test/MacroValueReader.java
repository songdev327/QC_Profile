package test;

import java.io.*;

public class MacroValueReader {
    static String ipAddress = null;
    static int systemNo;
    static int macroNo;
    static String writeFileName  = null;

    static final int SUCCESS = 0;
    static final int CONNECTERROR = 1;
    static final int EXECUTEERROR = 2;
    static final int ARGUMENTERROR = 3;
    static final int WRITEERROR = 4;

    static double writeValue;


    public static void main(String[] args) {
        if (args.length == 0) {
            System.exit(ARGUMENTERROR);
        }
        String[] enterContents = args[0].split(",");
        for (String content : enterContents) {
            String[] contentParts = content.split("_");
            switch (contentParts[0]) {
                case "IP":
                    ipAddress = contentParts[1];
                    break;
                case "systemNo":
                    systemNo = Integer.parseInt(contentParts[1]);
                    break;
                case "MacroNo":
                    macroNo = Integer.parseInt(contentParts[1]);
                    break;
                case "File":
                    writeFileName = contentParts[1];
            }
        }
        if (ipAddress == null || writeFileName == null){
            System.exit(ARGUMENTERROR);
        }

        MacroValueReader macroValueReader = new MacroValueReader();
        int executeResult = macroValueReader.readMacro();
        if (executeResult != SUCCESS){
            System.exit(executeResult);
        }else {
            String writeFilePath = "data/"+writeFileName;
            int writeResult = macroValueReader.writeFile(writeFilePath, String.valueOf(writeValue));
            System.exit(writeResult);
        }
    }

    int readMacro(){
        if (!isLiving(ipAddress)){
            return CONNECTERROR; // cannot communicate machine
        }

        Connect connect = new Connect(ipAddress, systemNo);
        if (!connect.ConnectMc()) {
            return CONNECTERROR; // disable connect Error
        }
        /** Read Macro Value  */
        long[] macro = new long[4];
        int res = Fwlib32.cncReadMacro(Connect.handle, macroNo,10,macro);
        if(res != 0) {
            System.err.println( ipAddress + " error at cncReadMacro : "+res);
            connect.freeLibHandle();
            return EXECUTEERROR;
        }
        connect.freeLibHandle();
        double macroNumber = macro[2];
        double macroIndex = macro[3];
        double readMacroValue = macroNumber/Math.pow(10,macroIndex);
        writeValue = readMacroValue;
        return SUCCESS;
    }

    int writeFile(String writeFileName, String writeContent){
        int resultValue;
        BufferedWriter writer = null;
        try {
            writer = new BufferedWriter(new FileWriter(writeFileName));
            writer.write(writeContent);
            resultValue = SUCCESS;
        } catch (IOException e) {
            e.printStackTrace();
            resultValue = WRITEERROR;
        }finally {
            if (writer != null){
                try {
                    writer.close();
                }catch (IOException e){
                    resultValue =  WRITEERROR;
                }
            }
        }
        return resultValue;
    }

    /**
     * this method to check if you can communicate with the machine
     * @param ip_address
     * @return
     */
    boolean isLiving(String ip_address) {
        String timeout = "1";
        String[] command = {"ping","-c","1","-w",timeout, ip_address};  // ping -c 1 -w 1 ipAddress
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        try {
            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String resultString;  // String for command execution

            if ((resultString = reader.readLine()) == null){
                return false;   //This case is when the PC is not connected network
            }
            do {
                if (resultString.contains("100% packet loss")){  // This case is when CNC machine id disconnected
                    return false;
                }
            }while ((resultString = reader.readLine()) != null);

        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
        return true;    // CNC machine connect
    }
}
