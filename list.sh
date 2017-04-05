#!/bin/bash
i=0
echo "var files= [" > data.js
for filename in photos/*; do
	filename=${filename:7}
	if [ $i = 0 ]; then
		echo "	\"$filename\""  >> data.js
	else
		echo ",	\"$filename\"" >> data.js
	fi
	i=1
done
echo "];" >> data.js
echo Created data.js
