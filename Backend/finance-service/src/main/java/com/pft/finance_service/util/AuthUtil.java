package com.pft.finance_service.util;

import com.pft.finance_service.exception.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class AuthUtil {
  private AuthUtil(){}

  public static String currentUserId() {
    Authentication a = SecurityContextHolder.getContext().getAuthentication();
    if (a == null || a.getPrincipal() == null) {
      throw new UnauthorizedException("User is not authenticated");
    }
    return a.getPrincipal().toString();
  }
}
