/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package test;

/**
 * ver 1.2.0  Sep * 2018  by Hirabayashi
 *            Getting alarm history to csv.
 *
 * fwlib32 interface native methods for linux 32bit
 */
public class Fwlib32 {
    static {
        System.loadLibrary("FwLibJNI");
        System.err.println("load FwLibJNI.dll OK.");
    }
    /** do nothing */
    public static native void cncNull();
    
     /** set log file
     * level     -  log record level
     * filename  -  log file name
     */
    public static native int cncStartupprocess(long level,String filename);
    
    /** allocate library handle for LAN interface
     * ip      - IP address or hostname
     * port    - port number
     * timeout - wait time limit in second
     * handle  - handle[0]: gotton handle number
     */
    public static native int cncAllocLibHandle3(String ip,int port,int timeout
            ,int[] handle);
    /** free library handle
     * handle - handle number to free
     */
    public static native int cncFreeLibHandle(int handle);
    
     /** cncExitprocess
     * 
     */
    public static native int cncExitprocess();
    
     /** cncExitthread
     * 
     */
    public static native int cncExitthread();
    
    
    /** set data path
     * handle - handle number(gotton by cncAllcLibHandle3 method)
     */
    public static native int cncSetPath(int handle,int path);
    /** read parameter
     * handle - handle number (gotton by cncAllcLibHandle3 method)
     * number - parameter number of data to get
     * axis   - parameter number of data to get(-1 = all axis)
     * length - length of data to read (if zero, one data)
     * param  - contener of gotton data
     *          param[0]  : data number
     *          param[1]  : axis number
     *          param[2]  : type (0-bit,1-byte,2-work,3-long word,4-real)
     *          param[3]~ : gotton data 
     */
    public static native int cncReadParam(int handle,int number,int axis,int length
            ,long[] param);
    /** get date and time in NC 
     * handle -  handle number gotton by cncAllcLibHandle3 method
     * time   -  time of NC
     *           time[0]: year
     *           time[1]: month
     *           time[2]: date
     *           time[3]: hour
     *           time[4]: minute
     *           time[5]: second
     */
    public static native int cncGetTimer(int handle,int[] time);
    
        /** read macro valiable number value
     * handle - handle number (gotton by cncAllcLibHandle3 method)
     * number - macro variable number of data to get
     * length - length of data to read (if zero, one data)
     * macro  - contener of gotton data
     *          macro[0]  : data number
     *          macro[1]  : dummy
     *          macro[2]  : macro variable 
     *          macro[3]  : decimal point 
     */
    public static native int cncReadMacro(int handle,int number,int length
            ,long[] macro);
    /** read pmc data
     * handle - handle number (gotton by cncAllcLibHandle3 method)
     * adr_type - pmc address type
     * data_type - pmc data type
     * s_number - starting pmc address
     * e_number - ending pmc address
     * buf  - contener of gotton data
     *          buf[0]  : pmc adress type (0-G,1-F,2-Y,3-X,4-A,5-R,6-T,7-K,8-C)
     *          buf[1]  : pmc number type (0-bit,1-word,2-long)
     *          buf[2]  : Start address
     *          buf[3]  : End address
     *          buf[4]  : gotton data  
     */
    public static native int pmcReadPmcrng(int handle,int adr_type,int data_type,int s_number
            ,int e_number, int length, long[] buf);  
    
        /** read Diagnoss data
     * handle - handle number (gotton by cncAllcLibHandle3 method)
     * number - diagnoss number
     * axis   - axis number of data
     * length - lenght of diagnoss
     * diag  - contener of gotton data
     *          diag[0]  : diagnoss data
     *          diag[1]  : data type
     *          diag[2]  : diagnoss value1
     *          diag[3]  : diagnoss value2
     */
    public static native int cncDiagnoss(int handle,int number,int axis
            ,int length, long[] diag);
    
    /** start recording alarm history
     * handle - handle number
     */
    public static native int cncStartophis(int handle);    
    /** stop recording alarm history
     * handle - handle number
     */
    public static native int cncStopophis(int handle);

    /** get alarm history q'ty
     * handle - handle number
     * hisno   - record q'ty
     */
    public static native int cncRdalmhisno(int handle,int[] hisno);

    /** get alarm history
     * handle - handle number
     * s_no   - start address
     * e_no   - end address
     * length - length of alarm history
     * his    -
     */
    public static native int cncRdalmhistry5(int handle,int s_no,int e_no
            ,int length,int[] his);

    public static native int cncRdalmhistry5Msg(int handle,int s_no,int e_no
            ,int length,char[] his);


    /** start recording operator message history
     * handle - handle number
     */
    public static native int cncStartomhis(int handle);
    /** stop recording operator message history
     * handle - handle number
     */
    public static native int cncStopomhis(int handle);

    /** get operator message history q'ty
     * handle - handle number
     * hisno   - record q'ty
     */
    public static native int cncRdomhisno(int handle,int[] hisno);

    /** get operator message history
     * handle - handle number
     * s_no   - start address
     * e_no   - end address
     * length - length of operator message history
     * his    -
     */
    public static native int cncRdomhistry2(int handle,int s_no,int e_no
            ,int length,int[] his);

    public static native int cncRdomhistry2Msg(int handle,int s_no,int e_no
            ,int length,char[] his);


    public static native int cncprgName(int handle,char[] prg);

    public static native int cncUpload3(int handle,int data_type,int sprog_no,int eprog_no,int prog_len,char[] prog_data);

    public static native int cncrdtofs(int handle,int offsetNumber,int offsetType,int length,int[] data);

    public static native int cncSysInfo(int handle,char[] version);

    public static native int cncRdprogdir2(int handle,int[] prgDir);


    /**
     *  write blade offset value
     *
     *  handle - handle nunmber
     *  Number - blade nunber
     *  type   - where to put offset
     *  data   - offset value to put in
     */
    public static native int cncWriteOffset(int handle, int Number,int type,long data);

    /**
     * This Function to write pmc address
     * @param handle          : handle
     * @param dataBlockLength : data block length
     * @param pmcAddressType  : 0 G , 1 F , 2 Y , 3 X , 4 A, 5 R, 6 T, 7 K , 8 C , 9 D
     * @param pcmDataType     : 0 bite type , 1 word type , 2 long type
     * @param startPMCAddress :
     * @param endPMCAddress   :
     * @param writeValue      : value
     * @return
     */
    public static native int pmcWrpmcrng(int handle, int dataBlockLength,
                                         int pmcAddressType, int pcmDataType, int startPMCAddress, int endPMCAddress, long writeValue);

    public static native int cncWrmacro(int handle, int macroNo, int macroValue, int decimalValue);
    /**
     *  handle - handle nunmber
     *  macroNo - Write macroNo
     *  macro value - Variable value / pseudo part of custom macro variable
     *  decimalValue - Decimal/exponential part of custom macro variables
     */
}
