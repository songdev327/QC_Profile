JAVA_PATH = /usr/lib/jvm/bellsoft-java11.i386
libFwLibJNI.so:	FwLibJNI.o
	gcc -m32 -L./ -shared -Wl,-soname,libFwLibJNI.so.1 -olibFwLibJNI.so.1.0.2 FwLibJNI.o -lc -lfwlib32
	ln -s libFwLibJNI.so.1.0.2 libFwLibJNI.so
FwLibJNI.o:	FwLibJNI.cpp test_Fwlib32.h
	gcc  -m32 -O -fPIC -I$(JAVA_PATH)/include -I$(JAVA_PATH)/include/linux -g -c -Wall FwLibJNI.cpp test_Fwlib32.h
test_Fwlib32.h:	build/classes/test/Fwlib32.class
	javac -h ./ src/test/Fwlib32.java -d build/classes/test
