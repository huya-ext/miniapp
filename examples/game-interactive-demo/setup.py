# -*- coding:utf-8 -*-
import os
import sys
import json
import subprocess
import shutil

if sys.version_info < (3, 0):
	print("please install python 3.x !!!")
	sys.exit(0);

#当前目录
curpath = os.getcwd()

#demo模板目录
cocostemplate = curpath + "\\cocos-game"

#虎牙小游戏打包模板目录
hytemplate = curpath + "\\hy-game"

#项目名称
name = "game-helloworld"

#项目路径
path = "D:\\1"

#完整目录
project = path + "\\" + name

#创建项目
def createProject():
	while(True):
		global name
		name = input("请输入项目名称:")
		global path
		path = input("请输入项目路径(绝对路径):")
		global project
		project = path + "\\" + name
		yes = confirmAction("确认创建项目\"" + name + "\"到目录\"" + path + "\"?(Y/N):")
		if yes:
			return True
		else:
			print("开始创建项目")

#安装小程序的开发工具
def hyExt():
	#切换源
	#print("切换源")
	subprocess.call("npm config set registry https://registry.npm.taobao.org", shell=True)

	#切换当前目录
	print("当前目录:" , project)
	os.chdir(project)

	#安装hyext
	print("安装hyext")
	subprocess.call("npm install -g @hyext/cli", shell=True)

	#配置项目
	print("配置项目")
	subprocess.call("npx hyext init -b h5game", shell=True)

	#提示直接跳过目录设置和面板设置
	#print("请直接回车跳过目录设置和面板设置，模板文件已经设置好了，会覆盖原文件！！！")

#设置环境变量
def setEnv():
	env = os.environ.get('CREATOR')
	if (env == None):
		path = input("请输入CocosCreator安装目录:")
		command =r"setx CREATOR %s"%path
		os.system(command)
		print("设置环境变量CREATOR:" + path)

#安装需要的开发库
def installLibrary():
	print("安装pbjs")
	ret = subprocess.call("npm ls pbjs -g", shell=True)
	if 0 == ret:
		subprocess.call("npm install pbjs -g", shell=True)

	print("安装mockjs")
	subprocess.call("npm install mockjs -g", shell=True)

#清空目录
# def clearPath(path):
#     #递归删除文件夹
#     if os.path.exists(path):
#     	yes = confirmAction("目录已经存在，是否清空目录?(Y/N):")
#     	if yes:
#     		print("清空目录:" + path)
#     		shutil.rmtree(path)

#递归拷贝文件
def copyTree(src, dst):
	names = os.listdir(src)
	if not os.path.isdir(dst):
		os.makedirs(dst)

	for name in names:
		srcname = os.path.join(src, name)
		dstname = os.path.join(dst, name)

		suffix = os.path.splitext(srcname)[1]
		# if (".md" == suffix):
		# 	continue

		if os.path.isdir(srcname):
			copyTree(srcname, dstname)
		else:
			shutil.copy(srcname, dstname)

# #保存json文件
# def saveJson(data, file):
# 	with open(file, 'w') as fw:
# 		json.dump(data,fw)

# #打开json文件
# def loadJson(file):
# 	with open(file,'r') as f:
# 		data = json.load(f)
# 		return data

#询问
def confirmAction(str):
	yes = input(str)
	if yes == "Y" or yes == "y" or yes == "":
		return True
	else:
		return False

print("开始创建项目")

ret = createProject()
if ret:
	#clearPath(project)

	print("拷贝目录:" + cocostemplate + " -> " + project)
	copyTree(cocostemplate, project)

	print("拷贝目录:" + hytemplate + " -> " + project + "\\hy-game")
	copyTree(hytemplate, project + "\\hy-game")

	#print("拷贝目录:" + curpath + "\\protoctool" + " -> " + project + "\\protoctool")
	#copyTree(curpath + "\\protoctool", project + "\\protoctool")

	# yes = confirmAction("是否需要拷贝Creator插件(\"bitmap-font\",\"excel-killer\",\"publish-tool\")?(Y/N):")
	# if yes:
	# 	print("拷贝目录:" + curpath + "\\packages" + " -> " + project + "\\packages")
	# 	copyTree(curpath + "\\packages", project + "\\packages")

	setEnv()
	hyExt()
	installLibrary()

	#移动文件
	print("移动文件:" + project + "\\package-lock.json" + " -> " + project + "\\hy-game")
	shutil.move(project + "\\package-lock.json",  project + "\\hy-game\\package-lock.json")

	print("移动文件:" + project + "\\package.json" + " -> " + project + "\\hy-game")
	shutil.move(project + "\\package.json",  project + "\\hy-game\\package.json")

	print("移动文件夹:" + project + "\\node_modules" + " -> " + project + "\\build\\node_modules")
	shutil.move(project + "\\node_modules", project + "\\build\\node_modules")

	shutil.copy(cocostemplate + "\\.gitignore", project + "\\.gitignore")

	#删除多余文件
	os.remove(project + "\\project.config.json")

	print("配置完成")
	os.startfile(project)