package com.huya.ig.common.utils;

import com.google.common.base.Preconditions;
import org.apache.commons.lang3.StringUtils;

import java.util.Properties;

/**
 *
 * @date 2020/5/21
 * @author wangpeng1@huya.com
 * @description properties工具类
 *
 */
public class PropertiesUtil {

    public static int getInt(Properties properties, String key, int defaultValue){
        String value = properties.getProperty(key);
        if(!StringUtils.isEmpty(value)){
            return Integer.valueOf(value);
        }
        return defaultValue;
    }

    public static String getStringNotNull(Properties properties, String key){
        String value = properties.getProperty(key);
        Preconditions.checkArgument(!StringUtils.isEmpty(value), "参数{}不允许为空", key);
        return value;
    }

}
