import hyExt from 'hyext-rn-sdk';
let dev = false;
const host =  dev ? '' : '';
const port = dev ? 17050 : 80;

const request = (method = 'GET', path, param = {}) => {
	return new Promise((resolve, reject) => {
        console.log('request ebs start')
        console.log(param)
	    hyExt.requestEbs({
            header: {},
            host: host,
            port: port,
            path: path,
            httpMethod: method,
            param: param,
            cookies: {}
        }).then(({ res, msg, ebsResponse: { entity, statusCode, header } })=>{
            console.log('=====request ebs= response====')
            console.log(res)
            if(res == 0) {
                try{
                    const result = JSON.parse(entity);
                    resolve(result)
                } catch(e) {
                    reject(e)
                }
            }
        }).catch((err)=>{
            console.log('=====request ebs= err====')
            console.log(err)
            reject(err)
        });
	})
}

const getRaceResult = (raceId) => {
    const data = {extUuid:''};
    if(raceId) data['raceId'] = String(raceId)
    return request('GET', '/speedRace/getRaceResult', data)//获取结果接口
}
const reportResult = (raceId, result, nick, logo) => request('POST', `/speedRace/reportResult`, {extUuid:'', raceId, result, nick, logo})//结果上报接口

export default {
	getRaceResult, reportResult
}