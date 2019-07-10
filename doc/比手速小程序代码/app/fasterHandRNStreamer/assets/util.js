import CONFIG from './config';
import eventBus from '../tools/bus';
import hyExt from 'hyliveext-rn-sdk';

const { extUuid, baseUrl, port } = CONFIG;

var util = {
    request({service, method = 'GET', param = {}}) {
        var requestParam = {
            host: baseUrl,
            param: {extUuid, ...param},
            port: port,
            httpMethod: method,
            path: `/speedRace/${service}`
        }

        console.log('请求', requestParam);

        return new Promise((resolve, reject) => {
            hyExt.requestEbs(requestParam)
            .then(({ res, msg, ebsResponse }) => {
                if(res == 0) {
                    const { entity, statusCode, header } = ebsResponse;
                    
                    if(statusCode != 200 || !entity) {
                        console.log('接口异常', res, msg, ebsResponse);
                        reject(new Error(msg));
                    }

                    console.log('响应', res, entity, statusCode, header);
                    const resp = typeof entity == 'string' ? JSON.parse(entity) : entity;
                    resolve(resp);
                }else{
                    reject(new Error(msg));
                }
            }).catch(err => {
                reject(err);
            })
        })
    },
    showToast(text){
        console.log('showToast', text);
        eventBus.emit('showToast', text);
    },
    trimHttp(url) {
        if(url) {
            return url.replace(/^http\:/, 'https:');
        }
    },
    xssFilter: function (msg) {
        if (typeof msg !== 'string') return msg;

        msg = msg.replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\'/g, '&#39;')
                .replace(/\"/g, '&quot;');

        return msg;        
    }
    
}

export default util;
