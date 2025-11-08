package test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class OffsetWriter {

    static final int SUCCESS = 0;
    static final int CONNECT_ERROR = 1;
    static final int ARGUMENT_ERROR = 2;
    static final int EXECUTE_ERROR = 3;


    static String ipAddress = null;
    static int systemNo = -99999;
    static int toolNo = -99999;
    static int toolSystemNo = -99999;
    static int inputValue = -99999;

    public static void main(String[] args){
        System.out.println("start write Offset");
        if (args.length ==0){
            System.exit(ARGUMENT_ERROR);
        }
        System.out.println(args[0]);
        String[] enterContents = args[0].split(",");
        for (int i=0; i<enterContents.length; i++) {
            String content = enterContents[i];
            String[] contentParts = content.split("_");
            switch (contentParts[0]) {
                case "IP":
                    ipAddress = contentParts[1];
                    break;
                case "SystemNo":
                    systemNo = Integer.parseInt(contentParts[1]);
                    break;
                case "toolNo":
                    toolNo = Integer.parseInt(contentParts[1]);
                    break;
                case "toolSystem":
                    String toolSystem = contentParts[1];
                    switch (toolSystem) {
                        case "x":
                            toolSystemNo = 0;
                            break;
                        case "z":
                            toolSystemNo = 2;
                            break;
                        case "r":
                            toolSystemNo = 4;
                            break;
                    }
                    break;
                case "inputValue":
                    inputValue = Integer.parseInt(contentParts[1]);
                    break;
            }
        }
        if (ipAddress == null || systemNo == -99999 || toolNo == -99999 || toolSystemNo == -99999 || inputValue == -99999) {
            System.exit(ARGUMENT_ERROR);
        }
        OffsetWriter offsetWriter = new OffsetWriter();
        int resultCode = offsetWriter.writeOffsetValue();
        System.exit(resultCode);
    }

    int writeOffsetValue(){
        if (!isLiving(ipAddress)){
            return CONNECT_ERROR; // cannot communicate machine
        }

        Connect connect = new Connect(ipAddress, systemNo);
        if (!connect.ConnectMc()) {
            return CONNECT_ERROR; // disable connect Error
        }

        insertCorrectionData insertCorrectionData = new insertCorrectionData();
        int res = insertCorrectionData.write_offset(Connect.handle, toolNo, toolSystemNo, inputValue);
        if (res != 0){connect.freeLibHandle(); return EXECUTE_ERROR;}
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
