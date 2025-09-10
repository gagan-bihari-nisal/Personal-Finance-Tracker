package com.pft.auth_service.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
						 AuthenticationException authException) throws IOException {
		
		Map<String, String> responseBody = new HashMap<>();

		if (authException instanceof InsufficientAuthenticationException) {
			responseBody.put("message", "Insufficient authentication information provided");
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		} else if (authException instanceof BadCredentialsException) {
			responseBody.put("message", "Invalid username or password");
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		} else {
			responseBody.put("message", "Invalid username or password");
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		}

		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.getWriter().write(new ObjectMapper().writeValueAsString(responseBody));
	}
}