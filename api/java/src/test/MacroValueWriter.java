package test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class MacroValueWriter {

    static final int SUCCESS = 0;
    static final int CONNECT_ERROR = 1;
    static final int ARGUMENT_ERROR = 2;
    static final int EXECUTE_ERROR = 3;

    static String ipAddress = null;
    static int systemNo;
    static int macroNo = -1;
    static int macroValue = -99999;
    static int decimalValue = -99999;

    public static void main(String[] args){
        System.out.println("start write macro Offset");
        if (args.length == 0) {
            System.exit(ARGUMENT_ERROR);
        }

        String[] enterContents = args[0].split(",");
        for (String content : enterContents) {
            System.out.println(content);
            String[] contentParts = content.split("_");
            switch (contentParts[0]) {
                case "IP":
                    ipAddress = contentParts[1];
                    break;
                case "SystemNo":
                    systemNo = Integer.parseInt(contentParts[1]);
                    break;
                case "MacroNo":
                    macroNo = Integer.parseInt(contentParts[1]);
                    break;
                case "MacroVal":
                    macroValue = Integer.parseInt(contentParts[1]);
                    break;
                case "DecimalVal":
                    decimalValue = Integer.parseInt(contentParts[1]);
                    break;
            }
        }

        if (ipAddress == null || macroNo == -1 || macroValue == -99999 || decimalValue == -99999){
            System.exit(ARGUMENT_ERROR);
        }

        MacroValueWriter macroValueWriter = new MacroValueWriter();
        int executeResult = macroValueWriter.writeMacroValue();
        System.exit(executeResult);
    }

    int writeMacroValue(){
        if (!isLiving(ipAddress)){
            return CONNECT_ERROR; // cannot communicate machine
        }

        Connect connect = new Connect(ipAddress, systemNo);
        if (!connect.ConnectMc()) {
            return CONNECT_ERROR; // disable connect Error
        }

        int res = Fwlib32.cncWrmacro(Connect.handle, macroNo, macroValue, decimalValue);
        if(res != 0) {
            System.err.println( ipAddress + " error at cncWriteMacro : "+res);
            connect.freeLibHandle();
            return EXECUTE_ERROR;
        }
        connect.freeLibHandle();
        return SUCCESS;
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
