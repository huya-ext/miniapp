# -*- coding:utf-8 -*-
import sys
import subprocess
import webbrowser

if sys.version_info < (3, 0):
	print("please install python 3.x !!!")
	sys.exit(0);

#webbrowser.open("https://localhost:18081/h5/index_audience_web_popup.html", new=0, autoraise=True) 

subprocess.call("npx hyext start", shell=True)