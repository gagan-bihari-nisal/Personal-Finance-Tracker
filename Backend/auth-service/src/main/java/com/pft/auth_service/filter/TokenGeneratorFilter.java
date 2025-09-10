package com.pft.auth_service.filter;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class TokenGeneratorFilter {
	
	@Value("${jwt.secret}")
	private String secret;
	
	@Value("${jwt.expiration}")
	private int expiration;
	
	public String generateToken(UserDetails userDetails) {
		Map<String, Object> claims = new HashMap<>();
		return createToken(claims, userDetails);
	}
	
	private String createToken(Map<String, Object> claims, UserDetails userDetails) {
		SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
		return Jwts.builder().setIssuer("Personal Finance Tracker").setSubject("JWT Token")
				.claim("username", userDetails.getUsername())
				.claim("authorities", "ROLE_USER")
				.setIssuedAt(new Date())
				.setExpiration(new Date((new Date()).getTime() + expiration))
				.signWith(key)
				.compact();
	}
	
}