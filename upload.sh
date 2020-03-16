#!/bin/sh
sshpass -p $UPLOAD_PASSWORD sftp $UPLOAD_USERNAME@$UPLOAD_REMOTE <<EOF
cd net/tcgdex/api
put -r dist/*
exit
EOF
