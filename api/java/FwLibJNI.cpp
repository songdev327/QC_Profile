/* Header for class test_Fwlib32
*  History
*
*  ver1.0.10 Nov. 13 2018 by Hirabayashi
             cncRdomhistry2,cncRdomhisno,cncStartomhis,cncStopomhis
*  ver1.0.8 Oct.  4 2018 by Hirabayashi
*           cncStartophis,cncStopophis,cncRdalmhistry5,cncRdalmhistry5Msg
*           cncRdalmhisno
*  ver1.0.5 Jul. 24 2018 by Hirabayashi
*         cncDiagnosis
*  ver1.0.0 Jun. 14 2017 by Hirabayashi
*  linux  CentOS7.4-1708 and 32bit for FOCAS
*/

//#define DUMMY

#include "test_Fwlib32.h"
#include "fwlib32.h"

#include <string.h>
#include <sys/types.h>
#include <sys/stat.h> 
#include <fcntl.h>
#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include<iostream>

static double dummy_param;
static double dummy_param1=0;  // part count
static double dummy_param2=60000;  // power time
static double dummy_param3=50000;  // run time
static double dummy_macro;
static double dummy_macro1;
static double dummy_pmc=0;
static double dummy_pmc1=0;
static double dummyPartcount=0;
static double MySgnl;

JNIEXPORT void JNICALL Java_test_Fwlib32_cncNull
(JNIEnv *env, jclass obj) {
	printf("enter cncNull\n");
}

/*
 * Method  :  cncStartupprocess
 * faculty :  set log file and level
 * argument:  level - log level
 *            filename  - log file name
 * return  :  0      - normal
 *            other  - error
 */
JNIEXPORT jint JNICALL Java_test_Fwlib32_cncStartupprocess
  (JNIEnv *env, jclass cls, jlong level, jstring filename)
{
  	int res;
	const char *filenamechar = env->GetStringUTFChars(filename,0);
	res = cnc_startupprocess((long)level,filenamechar);


#ifdef DUMMY
printf("cnc_startupprocess(%d,%s,%d)\n",(unsigned long)level,filenamechar,res);
return 0;
#endif
	return res;
}

/*
 * Method  :  cncAllcLibHandle3
 * faculty :  allocate library handle (LAN)
 * argument:  ip      - IP address or hostname
 *            port    - port number of NC
 *            timeout - wait time limit in second
 *            handle  - set handle number into handle[0]
 */
JNIEXPORT jint JNICALL Java_test_Fwlib32_cncAllocLibHandle3
  (JNIEnv *env, jclass cls, jstring ip, jint port, jint timeout
  	, jintArray handle)
{
	unsigned short shandle;
	jboolean b;
	jint *ihandle = env->GetIntArrayElements(handle,&b);
	int res;
	const char *ipchar = env->GetStringUTFChars(ip,0);
	res = cnc_allclibhndl3(ipchar,(short)port, (long) timeout
		,&shandle);
        printf("Result : %d,\n" ,res);
#ifdef DUMMY
printf("cnc_allclibhndl3(%s,%d,%d,*)\n",ipchar,(short)port,(long)timeout);
res = 0;shandle = 512;
#endif
	ihandle[0] = shandle;
	env->ReleaseIntArrayElements(handle,ihandle,0);
	return res;
}
/*
 * Method  :  cncFreeLibHandle
 * faculty :  free library handle 
 * argument:  handle  - set handle number into handle[0]
 */
JNIEXPORT jint JNICALL Java_test_Fwlib32_cncFreeLibHandle
  (JNIEnv *env, jclass cls, jint handle)
{
#ifdef DUMMY
printf("cnc_freelibhndl(%d)\n",(unsigned short)handle);
return 0;
#endif
	return cnc_freelibhndl((unsigned short)handle);
}

/*
 * Method  :  cncExitprocess
 * faculty :  free library handle 
 * argument:  
 */
JNIEXPORT jint JNICALL Java_test_Fwlib32_cncExitprocess
  (JNIEnv *env, jclass obj)
{
	printf("cncExitprocess");
}


/*
 * Method  :  cncExitthread
 * faculty :  free library handle 
 * argument:  
 */
JNIEXPORT jint JNICALL Java_test_Fwlib32_cncExitthread
  (JNIEnv *env, jclass obj)
{
	printf("cncExitthread");
}

/*
 * Method  :  cncSetPath
 * faculty :  set data path number
 * argument:  handle - handle number
 *            path   - path number
 * return  :  0      - normal
 *            other  - error
 */
JNIEXPORT jint JNICALL Java_test_Fwlib32_cncSetPath
  (JNIEnv *env, jclass cls, jint handle, jint path)
{
#ifdef DUMMY
//printf("cnc_setpath(%d,%d)\n",(unsigned short)handle,(unsigned short)path);
return 0;
#endif
	return cnc_setpath((unsigned short)handle,(unsigned short)path);
}

/*
 * Method  : cncReadParam
 * faculty : read parameter from NC
 * argument: handle - handle number
 *           number - parameter number of data
 *           axis   - axis number of data
 *           length - length of param[]
 *           param  - data container
 */
JNIEXPORT jint JNICALL Java_test_Fwlib32_cncReadParam
  (JNIEnv *env, jclass cls, jint handle, jint number, jint axis
  	,jint length, jlongArray param)
{
	IODBPSD buf;
	int type;
	jboolean b;
	jlong *lparam = env->GetLongArrayElements(param,&b);
	short res = cnc_rdparam((unsigned short)handle,(unsigned short)number
		,(unsigned short)axis,4 + 4 * MAX_AXIS,&buf);
	if(!res) {
		int l = env->GetArrayLength(param);
		lparam[0] = buf.datano;     // data number
		lparam[1] = buf.type && 0xff;  // axis
		lparam[2] = buf.type >> 8; //  // data type
/*
		printf("param %d %d %d\n"
 *                ,(int)lparam[0],(int)lparam[1],(int)lparam[2]);

		switch(lparam[2]) {
		case 0 : // bit type
		case 1 : // byte type
			lparam[3] = buf.u.cdata;
			break;
		case 2 : // word type
			lparam[3] = buf.u.idata;
			break;
		case 3 : // 2 word type
			lparam[3] = buf.u.ldata;
			break;
		case 4 : // real type
			lparam[3] = (unsigned int)buf.u.rdata.dec_val;
			lparam[3] |= ((jlong)buf.u.rdata.prm_val) << 64;
			break;
		}
*/
                lparam[3] = buf.u.ldata;
       
        }        
        
#ifdef DUMMY
/**printf("cnc_rdparam(%d,%d,%d,%d,*)\n",(unsigned short)handle
,(unsigned short)number,(unsigned short)axis,4 + 4 * MAX_AXIS); */
lparam[0] = number;
lparam[1] = axis;
lparam[2] = 3;

switch(number) {
    case 6750:
       dummy_param2 = dummy_param2 +11;   // pwTime 
       dummy_param = dummy_param2;
       break;
       
    case 6752:
       dummy_param3 = dummy_param3 +20;   // runTime 
       dummy_param = dummy_param3;
       break;
       
    case 6711:  //Part count     
            dummy_param1=dummy_param1+1;   
            dummy_param = dummy_param1;
        break;
    }

lparam[3] = dummy_param;
res = 0;
//printf(" number %d dummy %10.3f \n",number,dummy_param);
#endif 
	env->ReleaseLongArrayElements(param,lparam,0);
	return res;
}
/*
 * Class:     test_Fwlib64
 * Method:    cncGetTime
 * Signature: (I[I)I
 */
/**  Deletion due to compile error 2017/7/12
JNIEXPORT jint JNICALL Java_test_Fwlib32_cncGetTimer
  (JNIEnv *env, jclass cls, jint handle, jintArray atime)
{
	jboolean b;
	IODBTIMER stime;
	
	jint *itime = env->GetIntArrayElements(atime,&b);
    int res;
	stime.type = 0;  // get data
	res = cnc_gettimer((unsigned short)handle,&stime);
	if(!res) {
		itime[0] = stime.data.date.year;
		itime[1] = stime.data.date.month;
		itime[2] = stime.data.date.date;
		stime.type = 1; // get time
		res = cnc_gettimer((unsigned short)handle,&stime);
		if(!res) {
			itime[3] = stime.data.time.hour;
			itime[4] = stime.data.time.minute;
			itime[5] = stime.data.time.second;
		}
	}
#ifdef DUMMY
{
SYSTEMTIME timep;
GetLocalTime(&timep);
printf("cnc_gettimer(%d,*)\n",(unsigned short)handle);
itime[0] = timep.wYear;
itime[1] = timep.wMonth;
itime[2] = timep.wDay;
itime[3] = timep.wHour;
itime[4] = timep.wMinute;
itime[5] = timep.wSecond;
res = 0;
}
#endif
	env->ReleaseIntArrayElements(atime,itime,0);
	return res;
}  
 * /

/*
 * Method  : cncReadMacro
 * faculty : read Macro value from NC
 * argument: handle - handle number
 *           number - Macro number of data
 *           length - length of param[]
 *           macro  - data container
 */
JNIEXPORT jint JNICALL Java_test_Fwlib32_cncReadMacro
  (JNIEnv *env, jclass cls, jint handle, jint number, jint length
    , jlongArray macro)
{
	ODBM smacro;
	jboolean b;
	jlong *lmacro = env->GetLongArrayElements(macro,&b);
	short res = cnc_rdmacro((unsigned short)handle,(unsigned short)number
            ,(unsigned short)length,&smacro);
	if(!res) {

	lmacro[0] = smacro.datano;     // data number
	lmacro[1] = smacro.dummy;      // empty 
        lmacro[2] = smacro.mcr_val;    // custom macro value
        lmacro[3] = smacro.dec_val;    // number of decimal places
       
        }        
        
#ifdef DUMMY
//printf("cnc_rdmacro (%d,%d,%d,*)\n",(unsigned short)handle,(unsigned short)number,(unsigned short)length);
lmacro[0] = number;
lmacro[1] = 0;

int (dummy_macro2)= int(fmod(dummy_macro1, 10));
switch(number) {
    

       case 148:  // cycletime_valid  in Cell
       if(dummy_macro2!=0){    
            dummy_macro = 100000000;
       }else{
           dummy_macro=0;
       }
       lmacro[2] = dummy_macro;
       lmacro[3] = 8;
      
       break;
    
       case 145:  // cutting time in Cell
       dummy_macro = 210000000+rand()/700;   // cycleTime
       lmacro[2] = dummy_macro;
       lmacro[3] = 7;
       break; 
       
       case 146:  // cutting time in Cell
       dummy_macro = 210000000+rand()/700;   // cycleTime
       lmacro[2] = dummy_macro;
       lmacro[3] = 7;
       break;    
        
       case 547:  // cycle time in Cell
       dummy_macro = 715000000+rand()/700;   // cycleTime
       lmacro[2] = dummy_macro;
       lmacro[3] = 7;
       break;
       
       case 541:   //  center line in X-chart
           
       dummy_macro = 0;   // 
       lmacro[2] = dummy_macro;
       lmacro[3] = 10;
       break;

       case 124:
       lmacro[2] = dummy_macro1;
       lmacro[3] = 10;
       break;
       case 129:
       case 130:   //  measuring data in X-chart
           
       dummy_macro = rand()/10;   
       lmacro[2] = dummy_macro;
       lmacro[3] = 10;
       break;
           
    }
dummy_macro1=dummy_macro1+1;
res = 0;

#endif 
	
	env->ReleaseLongArrayElements(macro,lmacro,0);
        
//printf(" number %d dummy_number %10.3f \n",number,dummy_macro);
	return res;        
}
/*
 * Method  : pmcReadPmc
 * faculty : read PMC data from NC
 * argument: handle - handle number
 *           adr_type - type of PMC address
 *           data_type - type of PMC data
 *           s_number - Starting PMC address
 *           e_number - Ending PMC adress
 *           length - length of buf[]
 *           buf  - data container
 */
JNIEXPORT jint JNICALL Java_test_Fwlib32_pmcReadPmcrng
  (JNIEnv *env, jclass cls, jint handle, jint adr_type, jint data_type
  	,jint s_number,jint e_number ,jint length, jlongArray buf)
{
	IODBPMC mbuf;
	int type_a,type_d;
	jboolean b;
	jlong *lbuf = env->GetLongArrayElements(buf,&b);
	short res = pmc_rdpmcrng((unsigned short)handle,(unsigned short)adr_type
		,(unsigned short)data_type,(unsigned short)s_number
                ,(unsigned short)e_number,(unsigned short)length,&mbuf);
	if(!res) {
		int l = env->GetArrayLength(buf);
		lbuf[0] = mbuf.type_a;     // PMC address type
		lbuf[1] = mbuf.type_d;     // PMC data type
		lbuf[2] = mbuf.datano_s;   // Starting PMC address
        lbuf[3] = mbuf.datano_e;   // Ending PMC address
        switch (lbuf[1]){
            case 0:
                lbuf[4] = mbuf.u.cdata[0]; // Getting data
                break;
            case 1:
                lbuf[4] = mbuf.u.idata[0]; // Getting data
                break;
            case 2:
                lbuf[4] = mbuf.u.ldata[0]; // Getting data
                break;
        }
    }
        
#ifdef DUMMY
/**printf("pmc_rdpmcrng(%d,%d,%d,%d,%d,*)\n",(unsigned short)handle
                ,(unsigned short)adr_type
		,(unsigned short)data_type
                ,(unsigned short)s_number
                ,(unsigned short)e_number,8 + 1);  */
//printf("point 0\n");fflush(stdout);
lbuf[0] = adr_type;
lbuf[1] = data_type;
lbuf[2] = s_number;
lbuf[3] = e_number;


dummy_pmc1 =dummy_pmc1+1;
int (dummy_pmc)= int(fmod(dummy_pmc1, 101));
MySgnl= lbuf[2];

//printf("Mysgn=  %d \n",MySgnl);

// 8:Y4.3 Red, 16: Y4.4 Yellow, 32: Y4.5 Green
if (MySgnl==4){

lbuf[4] = 32;
switch(dummy_pmc) {

    case 1:
        lbuf[4] =8 ;   
    break;
    case 34:
        lbuf[4] = 16;   
    break;
    case 59:
        lbuf[4] = 16;   
    break;
    case 62:
        lbuf[4] = 8;   
    break;
    case 99:
        lbuf[4] = 8;   
    break;
    case 125:
        lbuf[4] = 16;  
    break;
    case 153:
        lbuf[4] = 8;   
    break;
    case 170:
        lbuf[4] = 16;  
    break;
    case 173:
        lbuf[4] = 8;   
    break; 
//printf("Mysgnl Y4(%d)\n",MySgnl);
    }
}

// 1:Y11.0 Red, 2: Y11.1 Yellow, 4: Y11.2 Green
else if (MySgnl==11){

lbuf[4] = 4;
switch(dummy_pmc) {

    case 5:
        lbuf[4] =2 ;   
    break;
    case 34:
        lbuf[4] = 1;   
    break;
    case 59:
        lbuf[4] = 1;   
    break;
    case 62:
        lbuf[4] = 2;   
    break;
    case 99:
        lbuf[4] = 2;   
    break;
    case 125:
        lbuf[4] = 1;  
    break;
    case 153:
        lbuf[4] = 2;   
    break;
    case 170:
        lbuf[4] = 1;  
    break;
    case 173:
        lbuf[4] = 1;   
    break; 
//printf("Mysgnl Y11(%d)\n",MySgnl);
    }
}

// X7.4 X7.5 X12.6 X12.7 down time 
else {

lbuf[4] = 128;
//printf("case %d\n",dummy_pmc);
switch(dummy_pmc) {

    case 8:
        lbuf[4] =1 ;
    break;
    case 11:
        lbuf[4] = 16;   
    break;
    case 22:
        lbuf[4] = 128;
    break;
    case 98:
        lbuf[4] = 128;   
    break;
    case 99:
        lbuf[4] = 128;   
    break;
    case 100:
        lbuf[4] = 128;  
    break;
    case 101:
        lbuf[4] = 128;   
    break;
    case 102:
        lbuf[4] = 128;  
    break;
    case 103:
        lbuf[4] = 128;   
    break; 

    }

} 

res = 0;

#endif 

//printf("pmcRdpmcrng (%d,%d,%d,%d,*)\n",lbuf[0],lbuf[1],lbuf[2],lbuf[3]);fflush(stdout);
	env->ReleaseLongArrayElements(buf,lbuf,0);
        

//printf("point 2\n");fflush(stdout);
	return res;
}

//********************************************************************************
// *********************  New edit for diagnoss  *********************************
/*
 * Method  : cncDiagnoss
 * faculty : read Diagnoss data from NC
 * argument: handle - handle number
 *           number - diagnoss number
 *           axis   - axis number of data
 *           length - length of diagnoss
 *           diag   - data container
 */
JNIEXPORT jint JNICALL Java_test_Fwlib32_cncDiagnoss
  (JNIEnv *env, jclass cls, jint handle, jint number, jint axis
  	,jint length, jlongArray diag)
{
	ODBDGN mdiag;

	jboolean b;
	jlong *ldiag = env->GetLongArrayElements(diag,&b);
	short res = cnc_diagnoss((unsigned short)handle,(unsigned short)number
                ,(unsigned short)axis,(unsigned short)length,&mdiag);
	if(!res) {
		int l = env->GetArrayLength(diag);
		ldiag[0] = mdiag.datano;     // diagnoss number
		ldiag[1] = mdiag.type;     //  data type
//printf("cnc_diagnoss (number= %d)\n",number);
                int i = number;
                switch(i){
                    case 410: // word type
                    case 760:
                    case 761:    
                        ldiag[2] = mdiag.u.idatas[0];   // diagnoss value1
                        ldiag[3] = mdiag.u.idatas[1];   // diagnoss value2
                        ldiag[4] = mdiag.u.idatas[2];   // diagnoss value3
                        ldiag[5] = mdiag.u.idatas[3];   // diagnoss value4
                        ldiag[6] = mdiag.u.idatas[4];   // diagnoss value5
                        ldiag[7] = mdiag.u.idatas[5];   // diagnoss value6
                        ldiag[8] = mdiag.u.idatas[6];   // diagnoss value7
                        ldiag[9] = mdiag.u.idatas[7];   // diagnoss value8
                        ldiag[10] = mdiag.u.idatas[8];   // diagnoss value9
                        ldiag[11] = mdiag.u.idatas[9];   // diagnoss value10
//printf("#%d ,ldiag[2]=%d,ldiag[3]=%d,ldiag[4]=%d,ldiag[5]=%d\n",number,ldiag[2],ldiag[3],ldiag[4],ldiag[5]);                         
                        break;   
                    default:  //bit type : 403
                        ldiag[2] = mdiag.u.cdatas[0];   // diagnoss value1
                        ldiag[3] = mdiag.u.cdatas[1];   // diagnoss value2
                        ldiag[4] = mdiag.u.cdatas[2];   // diagnoss value3
                        ldiag[5] = mdiag.u.cdatas[3];   // diagnoss value4
                        ldiag[6] = mdiag.u.cdatas[4];   // diagnoss value5
                        ldiag[7] = mdiag.u.cdatas[5];   // diagnoss value6
                        ldiag[8] = mdiag.u.cdatas[6];   // diagnoss value7
                        ldiag[9] = mdiag.u.cdatas[7];   // diagnoss value8
                        ldiag[10] = mdiag.u.cdatas[8];   // diagnoss value9
                        ldiag[11] = mdiag.u.cdatas[9];   // diagnoss value10
                }
//printf("#%d ,ldiag[1]=%d,ldiag[2]=%d,ldiag[3]=%d,ldiag[4]=%d,ldiag[5]=%d\n",number,ldiag[1],ldiag[2],ldiag[3],ldiag[4],ldiag[5]);                
        }        
        
#ifdef DUMMY
/*printf("cnc_diagnoss(%d,%d,%d,%d,*)\n",(unsigned short)handle
                ,(unsigned short)number
		,(unsigned short)axis,(unsigned short)length);
*/
//printf("point 0\n");fflush(stdout);

ldiag[2] = 255;
ldiag[3] = 200;
ldiag[4] = 150;
ldiag[5] = 100;




res = 0;

#endif 

//printf("point 1(%d,%d,%d,%d,*)\n",lbuf[0],lbuf[1],lbuf[2],lbuf[3]);fflush(stdout);
	env->ReleaseLongArrayElements(diag,ldiag,0);
        

//printf("point 2\n");fflush(stdout);
	return res;
}
/*
 * Method  :  cncStartophis
 * faculty :  start recording alarm history
 * argument:
 * return  :  0      - normal
 *            other  - error
 */
JNIEXPORT jint JNICALL Java_test_Fwlib32_cncStartophis
  (JNIEnv *env, jclass cls, jint handle)
{

#ifdef DUMMY
printf("cnc_startophis(%d)\n",(unsigned short)handle);
return 0;
#endif
	return cnc_startophis((unsigned short)handle);
}
/*
 * Method  :  cncStopophis
 * faculty :  stop recording alarm history
 * argument:
 * return  :  0      - normal
 *            other  - error
 */
JNIEXPORT jint JNICALL Java_test_Fwlib32_cncStopophis
  (JNIEnv *env, jclass cls, jint handle)
{

#ifdef DUMMY
printf("cnc_stopophis(%d)\n",(unsigned short)handle);
return 0;
#endif
	return cnc_stopophis((unsigned short)handle);
}


/*
 * Method  :  cncRdalmhisno
 * faculty :  set alarm history record q'ty
 * argument:  handle - handle number
 *            hisno   - record q'ty
 * return  :  0      - normal
 *            other  - error
 */
JNIEXPORT jint JNICALL Java_test_Fwlib32_cncRdalmhisno
  (JNIEnv *env, jclass cls, jint handle, jintArray hisno)
{
    jboolean b;
    unsigned short shisno;
    jint *ihisno = env->GetIntArrayElements(hisno,&b);
    int res = cnc_rdalmhisno((unsigned short)handle,&shisno);

#ifdef DUMMY
res=0;shisno=10;
printf("cnc_rdalmhisno(%d,%d)\n",(unsigned short)handle,ihisno[0]);
#endif
    ihisno[0]=shisno;
    env->ReleaseIntArrayElements(hisno,ihisno,0);
    return res;
}

/*
 * Method  : cncRdalmhisrty5
 * faculty : read alarm history from CNC
 * argument: handle - handle number
 *           s_no - Starting record line
 *           e_no - Ending record line
 *           length - length of his[]
 *           his  - data container
 */
JNIEXPORT jint JNICALL Java_test_Fwlib32_cncRdalmhistry5
  (JNIEnv *env, jclass cls, jint handle
  	,jint s_no,jint e_no ,jint length, jintArray his)
{
	ODBAHIS5 mhis;
	jboolean b;
	jint *lhis = env->GetIntArrayElements(his,&b);
	short res = cnc_rdalmhistry5((unsigned short)handle
		,(unsigned short)s_no,(unsigned short)e_no,(unsigned short)length,&mhis);
	if(!res) {
	int l = env->GetArrayLength(his);
                
            lhis[0] = mhis.s_no;   // Starting record histroy
            lhis[1] = mhis.e_no;   // Ending record history
            lhis[2] = mhis.alm_his[0].alm_grp; // Getting alarm group
            lhis[3] = mhis.alm_his[0].alm_no;  // Getting alarm number
            lhis[4] = mhis.alm_his[0].axis_no;  // Getting axis number
            lhis[5] = mhis.alm_his[0].year;
            lhis[6] = mhis.alm_his[0].month;
            lhis[7] = mhis.alm_his[0].day;
            lhis[8] = mhis.alm_his[0].hour;
            lhis[9] = mhis.alm_his[0].minute;
            lhis[10] = mhis.alm_his[0].second;
            lhis[11] = mhis.alm_his[0].pth_no;
            lhis[12] = mhis.alm_his[0].len_msg;
    }

#ifdef DUMMY

lhis[2]=3;
lhis[3]=204;
lhis[4]=1;
lhis[5]=2018;
lhis[6]=9;
lhis[7]=5;
lhis[8]=10;
lhis[9]=20;
lhis[10]=30;
lhis[11]=2;
lhis[12]=20;

res = 0;

#endif
	env->ReleaseIntArrayElements(his,lhis,0);
	return res;
}
/*  Method  : cncRDalmhistry5Msg
 *  Faculty : get alarm message
 *  data type :  char
 */
JNIEXPORT jint JNICALL Java_test_Fwlib32_cncRdalmhistry5Msg
  (JNIEnv *env, jclass cls, jint handle
  	,jint s_no,jint e_no ,jint length, jcharArray his)
{
	ODBAHIS5 mhis;
	jboolean b;
	jchar *chis = env->GetCharArrayElements(his,&b);
	short res = cnc_rdalmhistry5((unsigned short)handle
		,(unsigned short)s_no,(unsigned short)e_no,(unsigned short)length,&mhis);
	if(!res) {
	//int l = env->GetArrayLength(his);
      for(int i=0;i<64;i++){
            chis[i] = mhis.alm_his[0].alm_msg[i];
      }
    }

#ifdef DUMMY

for(int j=0;j<63;j++){
    chis[j]='a';
}

res = 0;

#endif
	env->ReleaseCharArrayElements(his,chis,0);
	return res;
}
/*
 * Method  :  cncStartomhis
 * faculty :  start recording operator message history
 * argument:
 * return  :  0      - normal
 *            other  - error
 */
JNIEXPORT jint JNICALL Java_test_Fwlib32_cncStartomhis
  (JNIEnv *env, jclass cls, jint handle)
{

#ifdef DUMMY
printf("cnc_startomhis(%d)\n",(unsigned short)handle);
return 0;
#endif
	return cnc_startomhis((unsigned short)handle);
}
/*
 * Method  :  cncStopomhis
 * faculty :  stop recording operator message history
 * argument:
 * return  :  0      - normal
 *            other  - error
 */
JNIEXPORT jint JNICALL Java_test_Fwlib32_cncStopomhis
  (JNIEnv *env, jclass cls, jint handle)
{

#ifdef DUMMY
printf("cnc_stopomhis(%d)\n",(unsigned short)handle);
return 0;
#endif
	return cnc_stopomhis((unsigned short)handle);
}
/*
 * Method  :  cncRdomhisno
 * faculty :  set operator message history record q'ty
 * argument:  handle - handle number
 *            hisno   - record q'ty
 * return  :  0      - normal
 *            other  - error
 */
JNIEXPORT jint JNICALL Java_test_Fwlib32_cncRdomhisno
  (JNIEnv *env, jclass cls, jint handle, jintArray hisno)
{
    jboolean b;
    unsigned short ohisno;
    jint *mhisno = env->GetIntArrayElements(hisno,&b);
    int res = cnc_rdomhisno((unsigned short)handle,&ohisno);

#ifdef DUMMY
res=0;ohisno=10;
printf("cnc_rdomhisno(%d,%d)\n",(unsigned short)handle,mhisno[0]);
#endif
    mhisno[0]=ohisno;
    env->ReleaseIntArrayElements(hisno,mhisno,0);
    return res;
}
/*
 * Method  : cncRdomhisrty2
 * faculty : read operator message history from CNC
 * argument: handle - handle number
 *           s_no - Starting record line
 *           e_no - Ending record line
 *           length - length of his[]
 *           his  - data container
 */
JNIEXPORT jint JNICALL Java_test_Fwlib32_cncRdomhistry2
  (JNIEnv *env, jclass cls, jint handle
  	,jint s_no,jint e_no ,jint length, jintArray his)
{
	ODBOMHIS2 ohis;
	jboolean b;
	jint *nhis = env->GetIntArrayElements(his,&b);
	short res = cnc_rdomhistry2((unsigned short)handle
		,(unsigned short)s_no,(unsigned short)e_no,(unsigned short)length,&ohis);
	if(!res) {
	int n = env->GetArrayLength(his);

            nhis[0] = ohis.s_no;   // Starting record histroy
            nhis[1] = ohis.e_no;   // Ending record history
            nhis[2] = ohis.opm_his[0].dsp_flg; // Getting message flag
            nhis[3] = ohis.opm_his[0].om_no;  // Getting operator message number
            nhis[4] = ohis.opm_his[0].year;
            nhis[5] = ohis.opm_his[0].month;
            nhis[6] = ohis.opm_his[0].day;
            nhis[7] = ohis.opm_his[0].hour;
            nhis[8] = ohis.opm_his[0].minute;
            nhis[9] = ohis.opm_his[0].second;
    }

#ifdef DUMMY

nhis[2]=0;
nhis[3]=204;
nhis[4]=2018;
nhis[5]=11;
nhis[6]=12;
nhis[7]=10;
nhis[8]=20;
nhis[9]=30;

res = 0;

#endif
	env->ReleaseIntArrayElements(his,nhis,0);
	return res;
}
/*  Method  : cncRdomhistry2Msg
 *  Faculty : get operator message
 *  data type :  char
 */
JNIEXPORT jint JNICALL Java_test_Fwlib32_cncRdomhistry2Msg
  (JNIEnv *env, jclass cls, jint handle
  	,jint s_no,jint e_no ,jint length, jcharArray his)
{
	ODBOMHIS2 omhis;
	jboolean b;
	jchar *dhis = env->GetCharArrayElements(his,&b);
	short res = cnc_rdomhistry2((unsigned short)handle
		,(unsigned short)s_no,(unsigned short)e_no,(unsigned short)length,&omhis);
	if(!res) {

      for(int i=0;i<256;i++){
            dhis[i] = omhis.opm_his[0].ope_msg[i];
            if(dhis[i]=='\0'){break;}
      }
    }

#ifdef DUMMY
int j=0;
for(j=0;j<20;j++){
    dhis[j]='a';
}
dhis[j+1]='\0';

res = 0;

#endif
	env->ReleaseCharArrayElements(his,dhis,0);
	return res;
}

JNIEXPORT jint JNICALL Java_test_Fwlib32_cncprgName
  (JNIEnv *env, jclass cls, jint handle
        , jcharArray prg)
{
      ODBEXEPRG oprg;
      jboolean b;
      jchar *dprg = env->GetCharArrayElements(prg,&b);
      short res = cnc_exeprgname((unsigned short)handle
               ,&oprg);
      if(!res){

       for(int i=0;i<36;i++){
        dprg[i] = oprg.name[i];
        if(dprg[i]=='\0'){break;}
       }
      }

#ifdef DUMMY
int j= 0;
for(j=0;j<20;j++){
    dprg[j] = 'o';
}
dprg[j+1] = '\0';

res = 0;
#endif

      env->ReleaseCharArrayElements(prg,dprg,0);
return res;
}

JNIEXPORT jint JNICALL Java_test_Fwlib32_cncUpload3
  (JNIEnv *env, jclass cls, jint handle, jint data_type, jint sprog_number,
  jint epro_number, jint prog_len, jcharArray prg){

    char buf[prog_len+1];   // prepare Nc program last character % for +1
    short ret;
    long len;
    jboolean b;
    long charCount = 0;

    ret = cnc_upstart3((unsigned short)handle,(short)data_type,(long)sprog_number,(long)epro_number);
    std::cout << "cnc_upstart: ret = " << ret << "\n";
     if(ret == 0){
        jchar *dprg = env->GetCharArrayElements(prg,&b);
        do{
            len = (long)prog_len;
            ret = cnc_upload3((unsigned short)handle,&len,&buf[charCount]);
            std::cout << "cnc_upload3: ret = " << ret << "\n";

            if(ret == EW_OK){   //EW_OK = 0
               //buf[len] = '\0';
               charCount += len;    // len is write String length
               //printf("%s",buf);
            }

            if(buf[len-1] == '%'){
               break;
            }
        }while(ret == EW_OK || ret == EW_BUFFER);
        if(ret != EW_OK){
           std::cout <<"\n" << "cnc_upload3 END CAUSE ret = " << ret << "\n";
        }
        buf[charCount +1] = '\0';

        ret = cnc_upend3((unsigned short)handle);
        std::cout << "cnc_upend3: ret = " << ret << "\n" ;

        //printf("%s",buf);

         for(int i=0;i<charCount;i++){
              dprg[i] = buf[i];
         }
       env -> ReleaseCharArrayElements(prg,dprg,0);
     }else{
       std::cout << "Could  not connect";
     }
  return ret;
}


JNIEXPORT jint JNICALL Java_test_Fwlib32_cncrdtofs
  (JNIEnv *env, jclass cls,jint handle,jint number,jint type,jint length,jintArray data){
  ODBTOFS tofs;
  short ret;
  jboolean b;
  jint *ddata = env -> GetIntArrayElements(data,&b);

  ret = cnc_rdtofs((unsigned short)handle,(short)number,(short)type,(short)length,&tofs);

  ddata[0] = (int)tofs.datano;
  ddata[1] = (int)tofs.type;
  ddata[2] = (int)tofs.data;

  env -> ReleaseIntArrayElements(data,ddata,0);
  std::cout << tofs.data << '\n';
  return ret;
  }

JNIEXPORT jint JNICALL Java_test_Fwlib32_cncSysInfo
  (JNIEnv *env, jclass cls, jint handle, jcharArray version){

  ODBSYS odbsys;
  short ret;
  jboolean b;
  jchar *dversion = env -> GetCharArrayElements(version,&b);

  ret = cnc_sysinfo((unsigned short)handle,&odbsys);

  for(int i = 0; i<4; i++ ){
      dversion[i] = odbsys.series[i];
  }

  env -> ReleaseCharArrayElements(version,dversion,0);
  return ret;
}


JNIEXPORT jint JNICALL Java_test_Fwlib32_cncRdprogdir2
  (JNIEnv *env, jclass cls, jint handle, jintArray programName){
  short buffeSize = 1000;
  PRGDIR2 prg[buffeSize];
  short i,num;
  short top = 0;
  int ret;
  jboolean b;

  jint *dprogramName = env -> GetIntArrayElements(programName,&b);
  do{
      num = buffeSize;
       ret = cnc_rdprogdir2(handle,0,&top,&num,prg);
      if(ret == EW_NUMBER){
         break;
      }
      if(ret){
        printf("ERROR: %d\n",ret);
        break;
      }
      for(i = 0;i<num;i++){
        dprogramName[i] = prg[i].number;
      }
      top = prg[num-1].number + 1;
  }while(num >= buffeSize);

  env -> ReleaseIntArrayElements(programName,dprogramName,0);
  return ret;
}

JNIEXPORT jint JNICALL Java_test_Fwlib32_cncWriteOffset
  (JNIEnv *env, jclass cls, jint handle, jint Number, jint Type, jlong data){
   short length = 8;
   short toolNumber = (short) Number;
   short offsetType = (short) Type;

   int ret;
   ret = cnc_wrtofs(handle, toolNumber,offsetType,length,data);
   return ret;
  }


JNIEXPORT jint JNICALL Java_test_Fwlib32_cncWrmacro
  (JNIEnv *env, jclass cls, jint handle, jint jMacroNo, jint jMacroValue, jint jDecimalValue){
     short length = 10;
     short macroNo = (short) jMacroNo;
     long macroValue = (long) jMacroValue;
     short decimalValue = (short) jDecimalValue;

     int ret;
     ret = cnc_wrmacro(handle, macroNo, length, macroValue, decimalValue);
     return ret;
  }

JNIEXPORT jint JNICALL Java_test_Fwlib32_pmcWrpmcrng
  (JNIEnv *env, jclass cls, jint handle, jint dataBlockLength, jint pmcAddressType,
   jint pcmDataType, jint startPMCAddress, jint endPMCAddress, jlong writeValue){
   IODBPMC iodbpmc;
   iodbpmc.type_a = (short) pmcAddressType;
   iodbpmc.type_d = (short) pcmDataType;
   iodbpmc.datano_s = (short) startPMCAddress;
   iodbpmc.datano_e = (short) endPMCAddress;

   switch (iodbpmc.type_d){
               case 0: // bite type
                   iodbpmc.u.cdata[0] = writeValue;
                   break;
               case 1: // word type
                   iodbpmc.u.idata[0] = writeValue;
                   break;
               case 2: // long type
                   iodbpmc.u.ldata[0] = writeValue;
                   break;
           }
   short res = pmc_wrpmcrng((unsigned short)handle, (short)dataBlockLength, &iodbpmc);
   return res;
}