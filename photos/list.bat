@echo off
setlocal enabledelayedexpansion

SET flag=true
echo var files = [ > data.js
for %%f in (*.jpg) do (
	if !flag!==true (
		echo "%%f" >> data.js
	) ELSE (
		echo ,"%%f" >> data.js
	)
	SET flag=false
)
echo ] >> data.js
echo Created data.js