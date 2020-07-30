package hyext.token.examples;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;

/**
 *	小程序Token加解密demo
 */
public class ExtToken {
	
	/**
	 * 签名生成
	 * @param appId  小程序开发者ID（成为开发者后，https://ext.huya.com可查）
	 * @param secret 小程序开发者密钥（成为开发者后，https://ext.huya.com可查）
	 * @param extId  小程序ID（成为开发者后，https://ext.huya.com可查）
	 * @param profileId  主播unionId
	 * @param second 签名有效时间（秒）
	 * @return
	 */
	public static String genToken(String appId, String secret, String extId, String profileId, int second) {
        //获取时间戳（毫秒）
        long currentTimeMillis = System.currentTimeMillis();
        long expireTimeMillis = System.currentTimeMillis() + second * 60 * 1000;  //超时时间
        Date iat = new Date(currentTimeMillis);
        Date exp = new Date(expireTimeMillis);

        try {
        	
            Map<String, Object> header = new HashMap<String, Object>();
            header.put("alg", "HS256");
            header.put("typ", "JWT");
            
            //生成JWT凭证
            Algorithm algorithm = Algorithm.HMAC256(secret);   //开发者密钥
            String sToken = JWT.create()
                    .withHeader(header)                    //JWT声明
                    .withIssuedAt(iat)                     //jwt凭证生成时间
                    .withExpiresAt(exp)                    //jwt凭证超时时间
                    .withClaim("appId", appId)             //开发者ID
                    .withClaim("extId", extId)             //小程序ID
                    .withClaim("creator", "DEV")           //创建者（token生成方：SYS平台，DEV开发者）
                    .withClaim("profileId", profileId)             //开发者ID
                    .sign(algorithm);

            return sToken;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
	}
	
	/**
	 * 签名解密
	 * @param token 小程序签名串
	 * @param sceret 小程序开发者密钥（成为开发者后，https://ext.huya.com可查）
	 * @return
	 */
	public static Map<String, Claim> parseToken(String token, String sceret) {
		DecodedJWT jwt = null;
		try {
			JWTVerifier verifier = JWT.require(Algorithm.HMAC256(sceret)).build();
			jwt = verifier.verify(token);
			return jwt.getClaims();
		} catch (Exception e) {		
			e.printStackTrace();
			return null;
		}
	}
	
	public static void main(String[] args) {
		
		String appId = "testAppId";
		String extId = "testExtId";
		String sceret = "testSecret";
		String profileId = "testProfileId";
		
		String token = genToken(appId, sceret, extId, profileId,86400);  // 生成签名
		System.out.println("token:" + token);

		Map<String, Claim> claims = parseToken(token, sceret);    // 签名解密
		System.out.println("claims appId :" + claims.get("appId").asString());
		System.out.println("claims extId :" + claims.get("extId").asString());
		System.out.println("claims profileId :" + claims.get("profileId").asString());
		System.out.println("claims creator :" + claims.get("creator").asString());
		
	}

}
