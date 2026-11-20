package com.darmisolutions.darmihire.notification.template;

import org.springframework.stereotype.Component;
import org.springframework.web.util.HtmlUtils;

@Component
public class HtmlEscaper {

  public String escape(String value) {

    if (value == null) {
      return "";
    }

    return HtmlUtils.htmlEscape(value);
  }
}
