package hyext.examples.java.utils;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Map;

public class ParamsUtil {

    //������map����ת��Ϊurl��������ʽ
    public static String MapToUrlString(Map<String,Object> paramsMap){
        if (null == paramsMap)
            return null;
      String preStr = "?";
      for (Map.Entry<String,Object> entry:paramsMap.entrySet()){
          try {
              preStr = preStr + entry.getKey() + "=" + URLEncoder.encode(entry.getValue().toString(),"UTF-8") + "&";
          } catch (UnsupportedEncodingException e) {
              e.printStackTrace();
          }
      }
      return preStr.substring(0,preStr.length() - 1);
    }

}

