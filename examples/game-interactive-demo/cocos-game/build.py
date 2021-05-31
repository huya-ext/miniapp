# -*- coding:utf-8 -*-
import os
import sys
import subprocess
import shutil
import re

if sys.version_info < (3, 0):
	print("please install python 3.x !!!")
	sys.exit(0);

#当前目录
curpath = os.getcwd()

#Creator路径
creatorpath = "D:\\CocosCreator_2.2.2"

#打包模板目录
hypath = curpath + "\\hy-game\\"

#构建目录
buildpath = curpath + "\\build"

#打包版本号文件
buildversionfile = hypath + 'my-launcher\\template\\src\\BuildVersion.js'

#工程版本号文件
gameversionfile = curpath + '\\assets\\scripts\\BuildVersion.js'

#是否bebug
debug = False

#递归拷贝文件
def copyTree(src, dst):
	names = os.listdir(src)
	if not os.path.isdir(dst):
		os.makedirs(dst)

	for name in names:
		srcname = os.path.join(src, name)
		dstname = os.path.join(dst, name)

		suffix = os.path.splitext(srcname)[1]
		if (".md" == suffix):
			continue

		if os.path.isdir(srcname):
			copyTree(srcname, dstname)
		else:
			shutil.copy(srcname, dstname)

#安装小程序的开发工具
def hyExt():
	#切换源
	#print("切换源")
	subprocess.call("npm config set registry https://registry.npm.taobao.org", shell=True)

	#切换当前目录
	#print("当前目录:" , curpath)
	#os.chdir(curpath)

	#安装hyext
	print("安装hyext")
	subprocess.call("npm install -g @hyext/cli", shell=True)

	#配置项目
	print("配置项目")
	subprocess.call("npx hyext init -b h5game", shell=True)

	#提示直接跳过目录设置和面板设置
	#print("请直接回车跳过目录设置和面板设置，模板文件已经设置好了，会覆盖原文件！！！")

#安装需要的开发库
def installLibrary():
	print("安装pbjs")
	ret = subprocess.call("npm ls pbjs -g", shell=True)
	if 0 == ret:
		subprocess.call("npm install pbjs -g", shell=True)

	print("安装mockjs")
	subprocess.call("npm install mockjs -g", shell=True)

#更新版本号
def updateVersion():
	string = ""
	version = 1

	#更新打包版本号
	with open(buildversionfile, 'a+') as fr:
		string = fr.read()
		version = re.findall(r'h_(\d+)', string)

	if len(version) <= 0:
		#print("找不到版本文件或版本号("+ buildversionfile + ")")
		#sys.exit(0);
		newversion = 1
	else:
		newversion = int(version[0]) + 1

	with open(buildversionfile, 'w') as fw:
		fw.write('export default \'h_' + str(newversion) + '\'; ');

	#更新工程版本号
	with open(gameversionfile, 'w') as fw:
		fw.write('window.BUILD_VERSION = \'h_' + str(newversion) + '\'; ');

#压缩文件
# def zipFiles(root, src, dst):
#     src = root + src
#     dst = root + dst
#     z = zipfile.ZipFile(dst,'w',zipfile.ZIP_DEFLATED)
#     for dirpath, dirnames, filenames in os.walk(src):
#         fpath = dirpath.replace(root,'')
#         fpath = fpath and fpath + os.sep or ''
#         for filename in filenames:
#             z.write(os.path.join(dirpath, filename),fpath+filename)
#     z.close()

#如果是git拷贝的工程 先安装node环境
if not os.path.exists(buildpath + "\\node_modules"):
	print("安装工程编译环境")
	hyExt()
	installLibrary()

	print("移动文件夹:" + curpath + "\\node_modules" + " -> " + buildpath + "\\node_modules")
	print("耗时操作，请耐心等待！")
	shutil.move(curpath + "\\node_modules", buildpath + "\\node_modules")

	print("移动文件:" + curpath + "\\package-lock.json" + " -> " + curpath + "\\hy-game")
	shutil.move(curpath + "\\package-lock.json",  curpath + "\\hy-game\\package-lock.json")

	print("移动文件:" + curpath + "\\package.json" + " -> " + curpath + "\\hy-game")
	shutil.move(curpath + "\\package.json",  curpath + "\\hy-game\\package.json")

	#删除多余文件
	os.remove(curpath + "\\project.config.json")


print("更新本地版本号")
updateVersion()

#检查安装路径
while(True):
	if not os.path.exists(creatorpath + "\\CocosCreator.exe"):
		creatorpath = os.environ.get('CREATOR')
		if creatorpath == None or not os.path.exists(creatorpath + "\\CocosCreator.exe"):
			print("未找到CocosCreator.exe。")
			print("如果是CocosDashboard版本在CocosDashboard_1.0.x/resources/.editors/Creator/2.2.2目录下。")
			creatorpath = input("请输入2.2.2版本的CocosCreator安裝目录:")
			if os.path.exists(creatorpath + "\\CocosCreator.exe"):
				break
		else:
			break
	else:
		break

creatorpath += "\\CocosCreator.exe"

#项目构建到build目录下
if debug:
	command = creatorpath + " --path " + curpath + " --build platform=web-mobile;debug=true"
else:
	command = creatorpath + " --path " + curpath + " --build platform=web-mobile;debug=false"

print("执行构建命令:", command)

subprocess.call(command, shell=True)
print("构建完成")

#拷贝模板文件到打包目录
print("拷贝目录:" + hypath + " -> " + buildpath)
copyTree(hypath, buildpath)

#删除原cocos引擎文件
if not debug:
	print("删除文件:" + buildpath + "\\web-mobile\\cocos2d-js-min.js")
	os.remove(buildpath + "\\web-mobile\\cocos2d-js-min.js")

#改文件 index.html的title

#压缩目录
print("打包文件")
os.chdir(buildpath)
subprocess.call("npx hyext release", shell=True)
#zipFiles(buildpath, "\\hy-game", "\\hy-game.zip")

shutil.rmtree(buildpath + "\\hy-game")

os.startfile(buildpath)