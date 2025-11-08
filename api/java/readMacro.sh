#!/bin/bash
JAVA_HOME=/usr/lib/jvm/bellsoft-java11.i386
export JAVA_PATH=$JAVA_HOME
export PATH=$JAVA_PATH/jre/bin:$JAVA_PATH/bin:$PATH
export LD_LIBRARY_PATH=$PWD
java -cp build/classes:'lib/*' test.MacroValueReader $@
RETURN_CODE=$?
exit $RETURN_CODE

