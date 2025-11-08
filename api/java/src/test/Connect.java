package test;

/**
 * ver 1.07  Aug.21 2018  by Hirabayashi
 *           adjustable frequency for Diagnosis value
 *
 */
public class Connect {
    String ipaddr;
    static int handle=-1;
    static int SystemNumber;
    int[] aHandle = new int[1];
    public Connect(String cipaddr, int cSystemNumber){
        ipaddr=cipaddr;
        SystemNumber=cSystemNumber;
    }

    public boolean ConnectMc(){
        int res = Fwlib32.cncAllocLibHandle3(ipaddr,8193,10,aHandle);
        if(res!=0){
            System.err.println(ipaddr+" error at cncAllocLibHandle3 : "+ res);
            handle=-1;
            return false;
        }
        handle= aHandle[0];
        res = Fwlib32.cncSetPath(handle,SystemNumber);
        if(res!=0){
            System.err.println("ConnectMC error at cncSetPath");
            handle=-1;
            return false;
        }
System.err.println("@ConnectMc handle= "+handle + ", SystemNumber= " + SystemNumber);
        return true;
    }



    boolean freeLibHandle(){
        int res = Fwlib32.cncFreeLibHandle(handle);
        if(res!=0){
            System.err.println(ipaddr + " error @ freeLibHandle");
            handle=-1;
            return false;
        }
        return true;
    }
}
