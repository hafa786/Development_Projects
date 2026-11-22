package com.darmisolutions.darmihire.notification.email;

import com.darmisolutions.darmihire.notification.Notification;
import org.springframework.stereotype.Service;

@Service
public class NotificationEmailFactory {

  public EmailMessage create(Notification notification) {

    return switch (notification.getType()) {
      case APPLICATION_RECEIVED -> createApplicationReceived(notification);

      case APPLICATION_REJECTED -> createApplicationRejected(notification);

      case INTERVIEW_INVITATION -> createInterviewInvitation(notification);

      case INTERVIEW_UPDATED -> createInterviewUpdated(notification);

      case INTERVIEW_CANCELLED -> createInterviewCancelled(notification);

      case OFFER_SENT -> createOfferSent(notification);

      case OFFER_ACCEPTED -> createOfferAccepted(notification);

      case OFFER_DECLINED -> createOfferDeclined(notification);

      case OFFER_WITHDRAWN -> createOfferWithdrawn(notification);

      case NEW_APPLICATION -> createNewApplication(notification);
    };
  }

  // Each method:
  //
  // 1. uses relatedEntityId
  // 2. loads tenant-scoped domain data
  // 3. calls the existing EmailTemplateService
  // 4. returns EmailMessage
}
