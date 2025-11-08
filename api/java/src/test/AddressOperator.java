package test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

public class AddressOperator {

    static final int SUCCESS = 0;
    static final int CONNECT_ERROR = 1;
    static final int ARGUMENT_ERROR = 2;
    static final int EXECUTE_ERROR = 3;


    static String ipAddress = null;
    static int systemNo = -99999;
    static int addressTypeNo = -99999;
    static String pmcAddress = null;

    public static void main(String[] args){
        System.out.println("machine status check");
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
        AddressOperator addressOperator = new AddressOperator();
        int resultCode = addressOperator.operateMachine();
        System.exit(resultCode);
    }

    int operateMachine(){
        if (!isLiving(ipAddress)){
            return CONNECT_ERROR; // cannot communicate machine
        }

        Connect connect = new Connect(ipAddress, systemNo);
        if (!connect.ConnectMc()) {
            return CONNECT_ERROR; // disable connect Error
        }

        String[] addressPart = pmcAddress.split("\\.");

        int address = Integer.parseInt(addressPart[0]);
        int addressBit = Integer.parseInt(addressPart[1]);

        boolean writeOnAddressResult =  writePMCOnFlag(Connect.handle, addressTypeNo, address, addressBit);
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        boolean writeOffAddressResult = writePMCOffFlag(Connect.handle, addressTypeNo, address, addressBit);
        connect.freeLibHandle();

        if (!(writeOnAddressResult && writeOffAddressResult)){
            return EXECUTE_ERROR;
        }

        return SUCCESS;
    }

    boolean writePMCOnFlag(int handle, int insertAddressType, int insertAddress, int insertAddressBit){
        long[] buf = new long[5];
        int res = Fwlib32.pmcReadPmcrng(handle,insertAddressType,0,insertAddress,insertAddress,8+1,buf);
        if (res != 0){
            System.err.println("getAddressStatus at pmcReadpmcrng : "+res);
            return false;
        }
        long addressStatus = buf[4];
        Map<Integer, Integer> bitMap = createBitStr();
        long writtenAddressStatus = addressStatus | (bitMap.get(insertAddressBit));
        res = Fwlib32.pmcWrpmcrng(handle,8+1,insertAddressType,0,insertAddress,insertAddress,writtenAddressStatus);
        if (res != 0) {
            System.err.println("writeAddressStatus at pmcWritepmcrng : "+res);
            return false;
        }
        return true;
    }

    boolean writePMCOffFlag(int handle, int insertAddressType, int insertAddress, int insertAddressBit){
        long[] buf = new long[5];
        int res = Fwlib32.pmcReadPmcrng(handle,insertAddressType,0,insertAddress,insertAddress,8+1,buf);
        if (res != 0){
            System.err.println("getAddressStatus at pmcReadpmcrng : "+res);
            return false;
        }
        long addressStatus = buf[4];
        Map<Integer, Integer> bitMap = createBitStr();
        long writtenAddressStatus = addressStatus & ~(bitMap.get(insertAddressBit));
        res = Fwlib32.pmcWrpmcrng(handle,8+1,insertAddressType,0,insertAddress,insertAddress,writtenAddressStatus);
        if (res != 0) {
            System.err.println("pmcWrpmcrng : " + res);
            return false;
        }
        return true;
    }

    private Map<Integer,Integer> createBitStr(){
        Map<Integer, Integer> map = new HashMap<>();
        map.put(0,0x01);
        map.put(1,0x02);
        map.put(2,0x04);
        map.put(3,0x08);
        map.put(4,0x10);
        map.put(5,0x20);
        map.put(6,0x40);
        map.put(7,0x80);
        return map;
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
