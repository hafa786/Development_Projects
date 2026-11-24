package com.darmisolutions.darmihire.notification;

import com.darmisolutions.darmihire.notification.dto.NotificationResponse;
import com.darmisolutions.darmihire.security.AuthorizationService;
import com.darmisolutions.darmihire.security.Permission;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

  private final NotificationQueryService notificationQueryService;
  private final AuthorizationService authorizationService;

  @GetMapping
  public List<NotificationResponse> findAll() {

    authorizationService.require(Permission.VIEW_NOTIFICATIONS);

    return notificationQueryService.findAll();
  }

  @GetMapping("/{notificationId}")
  public NotificationResponse findById(@PathVariable UUID notificationId) {

    authorizationService.require(Permission.VIEW_NOTIFICATIONS);

    return notificationQueryService.findById(notificationId);
  }

  @PostMapping("/{notificationId}/retry")
  public NotificationResponse retry(@PathVariable UUID notificationId) {

    authorizationService.require(Permission.MANAGE_NOTIFICATIONS);

    return notificationQueryService.retry(notificationId);
  }
}
