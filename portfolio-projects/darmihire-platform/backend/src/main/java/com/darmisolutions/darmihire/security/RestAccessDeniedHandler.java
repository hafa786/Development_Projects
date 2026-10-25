package com.darmisolutions.darmihire.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

@Component
public class RestAccessDeniedHandler implements AccessDeniedHandler {

  @Override
  public void handle(
      HttpServletRequest request, HttpServletResponse response, AccessDeniedException exception)
      throws IOException {

    response.setStatus(HttpServletResponse.SC_FORBIDDEN);

    response.setContentType("application/json");

    response
        .getWriter()
        .write(
            """
                {
                  "status": 403,
                  "code": "FORBIDDEN",
                  "message": "Access denied"
                }
                """);
  }
}
