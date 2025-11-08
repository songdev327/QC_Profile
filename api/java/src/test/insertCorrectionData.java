package test;

import java.math.BigDecimal;

public class insertCorrectionData {

    BigDecimal CurrentToolOffsetAmount;


    void setCurrentToolOffsetAmount(BigDecimal data) {
        this.CurrentToolOffsetAmount = data;
    }

    BigDecimal getCurrentToolOffsetAmount() {
        return CurrentToolOffsetAmount;
    }


    /**
     * @param handle      connect handle
     * @param toolNumber  Ex.T1 = 1, T2 = 2
     * @param offsetType  wear_X = 0 wear_Z = 2 wear_R = 4
     * @param offsetValue insert collection value EX machine add 0.00001 value = offsetValue 1
     * @return
     */
    int write_offset(int handle, int toolNumber, int offsetType, long offsetValue) {
//        int currentAmountRes = readToolOffset(handle, toolNumber, offsetType);
//        if (currentAmountRes == 0) {
//            long insertOffsetAmount = (getCurrentToolOffsetAmount().multiply(new BigDecimal(100000))).longValue() + offsetValue;
//            System.err.println(insertOffsetAmount);
//            int res = Fwlib32.cncWriteOffset(handle, toolNumber, offsetType, insertOffsetAmount);
            int res = Fwlib32.cncWriteOffset(handle, toolNumber, offsetType, offsetValue);
            if (res != 0) {
                System.err.println("write error:" + res);
            }
            return res;
//        } else {
//            System.err.println("error load currentAmountData");
//            return currentAmountRes;
//        }
    }


    /**
     * @param handle       connect handle
     * @param offsetNumber Ex T1= 1 T2= 2
     * @param offsetType   wear_X = 0, geometry_x = 1 wear_Z = 2 geometry_z = 3 wear_R = 4 geometry_R =  5
     * @return
     */
    int readToolOffset(int handle, int offsetNumber, int offsetType) {
        int[] ReadOffsetData = new int[3];
        final int CncRdtofsDataLength = 8;

        int res = Fwlib32.cncrdtofs(handle, offsetNumber, offsetType, CncRdtofsDataLength, ReadOffsetData);
        if (res != 0) {
            System.err.println(" rdtofs error at cncrdtofs : " + res);
            return res;
        }
        //processing of decimal point position
        String offsetAmount = String.valueOf(ReadOffsetData[2]);
        int lng = offsetAmount.length();
        String correctData;
        StringBuilder sb = new StringBuilder(offsetAmount);
        if (offsetAmount.contains("-")){
            /**  Ex -1234567 == -12.34567    -123456 = -1.23456  */
            if (lng >=7){
                sb.insert(lng -5,".");
                correctData = sb.toString();

            }else {
                /** Ex -12  == -0.00012    -512 == -0.00512 */
                while (lng < 7){
                    sb.insert(1,0);
                    lng++;
                }
                sb.insert(lng -5,".");
                correctData = sb.toString();
            }

        }else {
            /** Ex 123456 = 1.23456   */
            if (lng >=6){
                sb.insert(lng -5 ,".");
                correctData = sb.toString();
            }else {
                /** Ex 12 =   0.00012    153 = 0.00153*/
                while (lng < 6){
                    sb.insert(0,0);
                    lng++;
                }
                sb.insert(lng -5 ,".");
                correctData = sb.toString();
            }
        }

        //////////////////////////////////
        BigDecimal getData = new BigDecimal(correctData);
        setCurrentToolOffsetAmount(getData);
        return res;
    }

}