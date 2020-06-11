#!/usr/bin/python3
# -*- coding: UTF-8 -*-

import os
import io
import json
import sys
import random
import hashlib
from functools import reduce

# python 2.x
if sys.version_info < (3, 0):
    from HTMLParser import HTMLParser
else:
    from html.parser import HTMLParser

# 常量定义
class CONST(object):
    def __init__(self):
        self.__HY_INDEX_HTML_NAME = 'hy-index.html'
        self.__HY_MAIN_JS_NAME = 'hy-main.js'

        self.__ADAPTER_BASE_JS = '''

// 加载器
// 浏览器及Runtime环境都要先加载
// 浏览器环境下:<script src="adapter_base.js"></script>

(function (window) {
    var loader = {};

    //创建一个element
    var baseCreate = function (objType, id) {
        var obj = document.createElement(objType);
        obj.id = id;
        document.body.appendChild(obj);
        return obj;
    };

    //创建image
    loader.createImage = function (src, id) {
        var img = baseCreate("img", id);
        img.src = src;
        img.style.display = 'none';
        return img;
    };

    //创建canvas
    loader.createCanvas = function (id, width, height) {
        var obj = baseCreate("canvas", id);
        if (width != undefined && width != null) {
            obj.width = width
        }
        if (height != undefined  && height != null) {
            obj.height = height
        }
        return obj;
    };

    //创建文本内容
    loader.createTextContent = function (id, content) {
        var obj = baseCreate("title", id);
        obj.text = content;
        return obj;
    };

    //加载图片资源
    loader.loadImages = function (images) {
        if (images == null || images.length <= 0) {
            return;
        }
        for (var i = 0; i < images.length; i++) {
            loader.createImage(images[i].src, images[i].id);
        }
    };

    //加载脚本
    loader.loadScripts = function (scripts) {
        if (scripts == null || scripts.length <= 0) {
            return;
        }
        for (var i = 0; i < scripts.length; i++) {
            require(scripts[i]);
        }
    };

    // Expose
window.hyAdapterLoader = loader;

})(window);
    
    '''

        self.__ADAPTER_BROWSER_JS = '''
var require = function (src) {
    var s = document.createElement('script');
    s.async = false;
    s.src = src;
    s.addEventListener('load', function () {
        s.parentNode.removeChild(s);
        s.removeEventListener('load', arguments.callee, false);
    }, false);
    document.body.prepend(s);
};

require('hy-adapter/adapter_base.js');
    '''

        self.__BASE_HTML = '''
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html lang="zh-cn">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <title>${title}</title>
</head>
<body>
</body>
<script src="hy-adapter/adapter_browser.js"></script>
<script src="hy-adapter/adapter_base.js"></script>
<script src="${hy_main_js_name}"></script>
</html>
    '''

        self.__COCOS_HTML = '''
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>Cocos Creator | hyExt Game</title>
</head>

<body>
  <canvas id="GameCanvas" oncontextmenu="event.preventDefault()" tabindex="0"></canvas>
  <script src="src/settings.js" charset="utf-8"></script>
  <script src="cocos2d-js-min.js" charset="utf-8"></script>
  <script src="main.js" charset="utf-8"></script>
  <script type="text/javascript">
    cc.sys.isBrowser = false;
    window.boot();
  </script>
</body>

</html>
    '''

        self.__HY_MAIN_JS = '''
//Runtime环境下面需要先加载adapter_base.js
console.log('navigator.userAgent:',navigator.userAgent);
if (window['navigator'] == undefined || window['navigator'] == null || navigator.userAgent.toLowerCase().indexOf('huya') >=0 ) {
    require('hy-adapter/adapter_base.js');
}

    '''

        self.__TPL_CANVAS = '''
//创建Canvas
hyAdapterLoader.createCanvas('${id}',${width},${height});
        '''

        self.__TPL_SCRIPTS = '''
//加载脚本
hyAdapterLoader.loadScripts(${srcs});
        '''

        self.__TPL_IAMGES = '''
//加载资源
hyAdapterLoader.loadImages(${srcs});
        '''

        self.__TPL_TEXTCONTENT = '''
//shader
hyAdapterLoader.createTextContent('${id}', `${content}`);
        '''

    @property
    def TPL_CANVAS(self):
        return self.__TPL_CANVAS

    @property
    def TPL_SCRIPTS(self):
        return self.__TPL_SCRIPTS

    @property
    def TPL_IAMGES(self):
        return self.__TPL_IAMGES

    @property
    def TPL_TEXTCONTENT(self):
        return self.__TPL_TEXTCONTENT

    @property
    def HY_INDEX_HTML_NAME(self):
        return self.__HY_INDEX_HTML_NAME

    @property
    def HY_MAIN_JS_NAME(self):
        return self.__HY_MAIN_JS_NAME

    @property
    def ADAPTER_BASE_JS(self):
        return self.__ADAPTER_BASE_JS

    @property
    def ADAPTER_BROWSER_JS(self):
        return self.__ADAPTER_BROWSER_JS

    @property
    def BASE_HTML(self):
        return self.__BASE_HTML

    @property
    def HY_MAIN_JS(self):
        return self.__HY_MAIN_JS

    @property
    def COCOS_HTML(self):
        return self.__COCOS_HTML

const = CONST()


# 上下文参数
class ConvertContext():
    def __init__(self, gameIndexHtmlAbsPath, gameRootAbsPath=None):
        self.__gameIndexHtmlAbsPath = gameIndexHtmlAbsPath
        if(gameRootAbsPath == None):
            self.__root_path = os.path.dirname(gameIndexHtmlAbsPath)
        else:
            self.__root_path = gameRootAbsPath

    @property
    def gameIndexHtmlAbsPath(self):
        return self.__gameIndexHtmlAbsPath

    @property
    def gameRootAbsPath(self):
        return self.__root_path


# 基本元素
class Element():
    def __init__(self, id):
        self._id = id
        return

    @property
    def id(self):
        return self._id


# 带src元素
class SrcElement(Element):
    def __init__(self, id, src):
        Element.__init__(self,id)
        self._src = src

    @property
    def src(self):
        if self._src and self._src.startswith('/'):
            return '.'+self._src
        return self._src


# Canvas
class Canvas(Element):
    def __init__(self, id, width, height):
        Element.__init__(self,id)
        self._width = width
        self._height = height

    @property
    def width(self):
        return self._width

    @property
    def height(self):
        return self._height


# Script
class Script():
    def __init__(self, src=None, content=None):
        self._src = src
        self._content = content

    @property
    def src(self):
        if self._src and self._src.startswith('/'):
            return '.'+self._src
        return self._src

    @property
    def content(self):
        return self._content


# Image
class Image(SrcElement):
    def __init__(self, id, src):
        SrcElement.__init__(self,id, src)


# Audio
class Audio(SrcElement):
    pass


# TextContent
class TextContent(Element):
    def __init__(self, id, content):
        Element.__init__(self,id)
        self._content = content

    @property
    def content(self):
        return self._content


# 整个转换对象
class Entire():
    def __init__(self):
        self.__elements = []
        self.__title = ''
        pass

    def addElement(self, element):
        self.__elements.append(element)

    @property
    def elements(self):
        return self.__elements

    @property
    def title(self):
        return self.__title

    @title.setter
    def title(self, title):
        self.__title = title


# 读文件
class Reader():
    def __init__(self, convertContext):
        self._convertContext = convertContext
        self._entire = None

    def __readFile(self):
            # 打开文件
        file_obj = io.open(
            self._convertContext.gameIndexHtmlAbsPath, "r", encoding="utf8")
        contents = file_obj.read()
        self.__gameIndexHtml = contents.rstrip()
        #print("gameIndexHtml: "+self.__gameIndexHtml)
        # 关闭文件
        file_obj.close()

    def load(self):
        self.__readFile()
        parser = GameHTMLParser()
        parser.feed(self.__gameIndexHtml)
        self._entire = parser.getEntire()

    @property
    def entire(self):
        return self._entire


# 写文件
class Writer():
    def __init__(self, convertContext, entire):
        self._convertContext = convertContext
        self._entire = entire

    # 创建目录
    def mkdir(self, path):
        # 去除首位空格
        path = path.strip()
        # 去除尾部 \ 符号
        path = path.rstrip("\\")

        # 判断路径是否存在
        isExists = os.path.exists(path)

        # 判断结果
        if not isExists:
            # 如果不存在则创建目录
            # 创建目录操作函数
            os.makedirs(path)
            return True
        else:
            # 如果目录存在则不创建，并提示目录已存在
            return False

    # 写文件

    def writeFile(self, path, content):
        # 打开文件
        fo = io.open(path, "w", encoding="utf8")
        print('write file:', fo.name)
        # python 2.x
        if sys.version_info < (3, 0):
            fo.write(content.decode('utf-8'))
        else:
            # python 3.x
            fo.write(content)
        # 关闭文件
        fo.close()
        return

    # 获得md5

    def getStrMD5(self, parmStr):
        if isinstance(parmStr,str):
            # 如果是unicode先转utf-8
            parmStr=parmStr.encode("utf-8")
        m = hashlib.md5()
        m.update(parmStr)
        return m.hexdigest()

    # 生成html内容

    def buildHtmlContent(self):
        indexHtmlContent = const.BASE_HTML
        indexHtmlContent = indexHtmlContent.replace(
            '${title}', self._entire.title)
        indexHtmlContent = indexHtmlContent.replace(
            '${hy_main_js_name}', const.HY_MAIN_JS_NAME)
        return indexHtmlContent

    # 生成main.js内容

    def buildMainContent(self):
        mainJsContent = const.HY_MAIN_JS

        if not self._entire or len(self._entire.elements) <= 0:
            return mainJsContent

        images = []
        scripts = []
        scriptCodeStr = ''
        for element in self._entire.elements:
            # Canvas
            if isinstance(element, Canvas):
                mainJsContent = mainJsContent + const.TPL_CANVAS.replace('${id}', element.id).replace(
                    '${width}', element.width if element.width else 'null').replace('${height}', element.height if element.height else 'null')
                continue

            # Image
            if isinstance(element, Image):
                images.append({'id': element.id, 'src': element.src})
                continue

            # Script
            if isinstance(element, Script):
                if element.src:
                    scripts.append(element.src)
                if element.content:
                    subDir = 'gen'
                    # 创建目录 gen
                    self.mkdir(os.path.join(self._convertContext.gameRootAbsPath,
                                            subDir))

                    jsName = self.getStrMD5(element.content) + '.js'
                    # 写 js 文件
                    self.writeFile(os.path.join(
                        self._convertContext.gameRootAbsPath, subDir, jsName), element.content)
                    scripts.append(subDir+'/'+jsName)
                continue

            # TextContent
            if isinstance(element, TextContent):
                mainJsContent = mainJsContent + const.TPL_TEXTCONTENT.replace('${id}', element.id).replace(
                    '${content}', element.content)
                continue

        imagesStr = json.dumps(images)
        mainJsContent = mainJsContent + \
            const.TPL_IAMGES.replace('${srcs}', imagesStr)

        scriptsStr = json.dumps(scripts)
        mainJsContent = mainJsContent + \
            const.TPL_SCRIPTS.replace('${srcs}', scriptsStr)

        mainJsContent = mainJsContent + scriptCodeStr

        return mainJsContent

    # 保存总入口

    def write(self):
        subDir = 'hy-adapter'

        # 创建目录 hy-adapter
        self.mkdir(os.path.join(self._convertContext.gameRootAbsPath,
                                subDir))
        # 写adapter_base.js
        self.writeFile(os.path.join(self._convertContext.gameRootAbsPath,
                                    subDir, 'adapter_base.js'), const.ADAPTER_BASE_JS)
        # 写adapter_browser.js
        self.writeFile(os.path.join(self._convertContext.gameRootAbsPath, subDir,
                                    'adapter_browser.js'), const.ADAPTER_BROWSER_JS)

        # 写hy-index.html
        indexHtmlContent = self.buildHtmlContent()
        self.writeFile(os.path.join(self._convertContext.gameRootAbsPath,
                                    const.HY_INDEX_HTML_NAME), indexHtmlContent)

        # 写hy-main.js
        mainJsContent = self.buildMainContent()
        self.writeFile(os.path.join(self._convertContext.gameRootAbsPath,
                                    const.HY_MAIN_JS_NAME), mainJsContent)
        print('write file sucessed.')


# html内容解析
class GameHTMLParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self)
        self.currTag = None
        self.currAttrs = None
        self.__entire = Entire()

    # 获得属性
    def getAttr(self, attrs, name):
        src = None
        for attr in attrs:
            if attr[0].lower() == name:
                src = attr[1]
                break
        return src

    # 解析元素
    def handle_endtag(self, tag):
        self.currTag = None

    # 解析元素
    def handle_starttag(self, tag, attrs):
        self.currTag = tag
        self.currAttrs = attrs
        # canvas
        if tag.lower() == 'canvas':
            id = self.getAttr(attrs, 'id')
            width = self.getAttr(attrs, 'width')
            height = self.getAttr(attrs, 'height')
            canvas = Canvas(id, width, height)
            print('canvas:', tag, ',id:', id,
                  ',width:', width, ',height:', height)
            self.__entire.addElement(canvas)

        # image
        if tag.lower() == 'img':
            src = self.getAttr(attrs, 'src')
            id = self.getAttr(attrs, 'id')
            print('image:', tag, ',id:', id, ',src:', src)
            if src:
                image = Image(id, src)
                self.__entire.addElement(image)

        # script
        if tag.lower() == 'script':
            src = self.getAttr(attrs, 'src')
            if not src:
                return
            if src.startswith('http://') or src.startswith('https://') or src.startswith('//'):
                print('pass script src:', src)
                return
            script = Script(src)
            self.__entire.addElement(script)
            print('add script src:', src)

    def handle_data(self, data):
        # print ('data:',data)
        if self.currTag and self.currTag.lower() == 'title' and data.strip() != '':
            self.__entire.title = data.strip()
            print('title:', self.__entire.title)
            return

        if self.currTag and self.currTag.lower() == 'script' and data.strip() != '':
            scriptType = self.getAttr(self.currAttrs, 'type')
            if not scriptType or scriptType.lower() == 'text/javascript':
                script = Script(None, data)
                self.__entire.addElement(script)
                print('add script content:', data)
            elif scriptType.lower().startswith('x-shader/'):
                textContent = TextContent(
                    self.getAttr(self.currAttrs, 'id'), data)
                self.__entire.addElement(textContent)
                print('add x-shader content,id:',
                      textContent.id, ',content:', data)
            return

    def getEntire(self):
        return self.__entire


# 过滤
class GameFilter():
    def __init__(self, convertContext, entire):
        self._convertContext = convertContext
        self._entire = entire

    def do_filter(self):
        if not self._entire or len(self._entire.elements) <= 0:
            return

        #cocos 检测
        if self.cocos_match():
            print('[GameFilter] game file is cocos export')
            self.cocos_convert()

    
    # 判断是不是cocos导出的文件
    def cocos_match(self):
        conditions = []
        for element in self._entire.elements:
            # Canvas
            if isinstance(element, Canvas):
                if element.id == 'GameCanvas':
                    conditions.append(True)
                continue
 
            # Script
            if isinstance(element, Script):
                if element.content and (element.content.find('cocos2d-js-min.js') >= 0):
                    conditions.append(True)
                continue

        #至少有两个值,且都为true
        if len(conditions) >=2 and  reduce(lambda x,y: x and y,conditions):
            return True
        else:
            return False
 
    # cocos 转换
    def cocos_convert(self):
        parser = GameHTMLParser()
        parser.feed(const.COCOS_HTML)
        self._entire = parser.getEntire()

    @property
    def entire(self):
        return self._entire


# print(const.HY_INDEX_HTML_NAME)
# print(const.HY_MAIN_JS_NAME)
# print(const.ADAPTER_BASE_JS)
# print(const.ADAPTER_BROWSER_JS)
# print(const.BASE_HTML)
# print(const.HY_MAIN_JS)
# convertContext = ConvertContext('E:/code/example/demo/arena5-src/index.html')
# print(convertContext.gameIndexHtmlAbsPath)
# print(convertContext.gameRootAbsPath)


def main(argv):
    if len(sys.argv) < 2:
        print('usage: python hy-convert.py index_html_abs_path [root_dir_abs_path]')
        return

    indexPath = sys.argv[1]

    root_dir = None
    if len(sys.argv) >= 3:
        root_dir = sys.argv[2]

    convertContext = ConvertContext(indexPath, root_dir)
    print('index html:', convertContext.gameIndexHtmlAbsPath)
    print('root dir:', convertContext.gameRootAbsPath)
    reader = Reader(convertContext)
    reader.load()
    entire = reader.entire
    
    # print(entire.elements)

    # 转换
    gameFilter = GameFilter(convertContext,entire)
    gameFilter.do_filter()
    entire = gameFilter.entire

    write = Writer(convertContext, entire)
    write.write()


main(sys.argv)
