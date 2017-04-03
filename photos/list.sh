#!/bin/bash
i=0
echo "var files= [" > data.js
for filename in *; do
	if [ $filename != "list.sh" ] && [ $filename != "data.js" ]; then
		if [ $i = 0 ]; then
			echo "	\"$filename\""  >> data.js
		else
			echo ",	\"$filename\"" >> data.js
		fi
		i=1
	fi
done
echo "];" >> data.js
echo Created data.js