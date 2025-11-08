package test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;

public class AddressReader {

    static final int ADDRESSON = 0;
    static final int ADDRESSOFF = 1;
    static final int CONNECT_ERROR = 2;
    static final int ARGUMENT_ERROR = 3;
    static final int EXECUTE_ERROR = 4;


    static String ipAddress = null;
    static int systemNo = -99999;
    static int addressTypeNo = -99999;
    static String pmcAddress = null;

    public static void main(String[] args){
        System.out.println("check input status");
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
                case "AddressType":
                    String addressType = contentParts[1];
                    switch (addressType) {
                        case "X":
                            addressTypeNo = 3;
                            break;
                        case "Y":
                            addressTypeNo = 2;
                            break;
                        case "R":
                            addressTypeNo = 5;
                            break;
                    }
                    break;
                case "Address":
                    pmcAddress = contentParts[1];
                    break;
            }
        }

        if (ipAddress == null || systemNo == -99999 || addressTypeNo == -99999 || pmcAddress == null) {
            System.exit(ARGUMENT_ERROR);
        }

        AddressReader addressReader = new AddressReader();
        int resultCode = addressReader.readAddress();
        System.exit(resultCode);
    }


    int readAddress(){
        if (!isLiving(ipAddress)){
            return CONNECT_ERROR;
        }
        Connect checkStatusConnect = new Connect(ipAddress, systemNo);
        if (!checkStatusConnect.ConnectMc()) {
            return CONNECT_ERROR;
        }
        int res;
        BigDecimal bigDecimal = new BigDecimal(pmcAddress);
        int address = bigDecimal.intValue();
        long[] buf = new long[5];
        res = Fwlib32.pmcReadPmcrng(Connect.handle, addressTypeNo, 0, address, address, 8+1, buf);
        if (res != 0) {
            checkStatusConnect.freeLibHandle();
            return EXECUTE_ERROR;
        }
        String addressDecimalData = bigDecimal.subtract(new BigDecimal(address)).toPlainString();
        int decimalToIntData = (int) (Float.parseFloat(addressDecimalData) * 10);
        long addressStatus = (buf[4] >> decimalToIntData) &1;
        checkStatusConnect.freeLibHandle();
        if (addressStatus == 0) {
            return ADDRESSOFF; // Error that the machine is not in a good status to insert data into the machine
        }else {
            return ADDRESSON;
        }
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
