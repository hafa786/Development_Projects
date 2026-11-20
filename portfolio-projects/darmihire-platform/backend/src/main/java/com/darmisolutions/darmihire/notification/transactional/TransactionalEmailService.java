package com.darmisolutions.darmihire.notification.transactional;

import com.darmisolutions.darmihire.notification.Notification;
import com.darmisolutions.darmihire.notification.NotificationType;
import com.darmisolutions.darmihire.notification.email.EmailService;
import com.darmisolutions.darmihire.notification.template.EmailTemplate;
import com.darmisolutions.darmihire.notification.template.EmailTemplateService;
import com.darmisolutions.darmihire.tenant.Tenant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionalEmailService {

  private final EmailService emailService;
  private final EmailTemplateService templateService;

  public Notification sendApplicationReceived(
      Tenant tenant, String recipient, String candidateName, String jobTitle, UUID applicationId) {

    EmailTemplate template =
        templateService.applicationReceived(
            candidateName, jobTitle, tenant.getName(), applicationId.toString());

    return send(
        tenant,
        NotificationType.APPLICATION_RECEIVED,
        recipient,
        template,
        "JobApplication",
        applicationId);
  }

  public Notification sendInterviewInvitation(
      Tenant tenant,
      String recipient,
      String candidateName,
      String jobTitle,
      String dateTime,
      String interviewType,
      String location,
      UUID interviewId) {

    EmailTemplate template =
        templateService.interviewInvitation(
            candidateName, jobTitle, tenant.getName(), dateTime, interviewType, location);

    return send(
        tenant,
        NotificationType.INTERVIEW_INVITATION,
        recipient,
        template,
        "Interview",
        interviewId);
  }

  public Notification sendInterviewUpdated(
      Tenant tenant,
      String recipient,
      String candidateName,
      String jobTitle,
      String dateTime,
      String interviewType,
      String location,
      UUID interviewId) {

    EmailTemplate template =
        templateService.interviewUpdated(
            candidateName, jobTitle, tenant.getName(), dateTime, interviewType, location);

    return send(
        tenant, NotificationType.INTERVIEW_UPDATED, recipient, template, "Interview", interviewId);
  }

  public Notification sendInterviewCancelled(
      Tenant tenant, String recipient, String candidateName, String jobTitle, UUID interviewId) {

    EmailTemplate template =
        templateService.interviewCancelled(candidateName, jobTitle, tenant.getName());

    return send(
        tenant,
        NotificationType.INTERVIEW_CANCELLED,
        recipient,
        template,
        "Interview",
        interviewId);
  }

  public Notification sendOffer(
      Tenant tenant, String recipient, String candidateName, String jobTitle, UUID offerId) {

    EmailTemplate template = templateService.offerSent(candidateName, jobTitle, tenant.getName());

    return send(tenant, NotificationType.OFFER_SENT, recipient, template, "Offer", offerId);
  }

  public Notification sendOfferAccepted(
      Tenant tenant, String recipient, String candidateName, String jobTitle, UUID offerId) {

    EmailTemplate template =
        templateService.offerAccepted(candidateName, jobTitle, tenant.getName());

    return send(tenant, NotificationType.OFFER_ACCEPTED, recipient, template, "Offer", offerId);
  }

  public Notification sendOfferDeclined(
      Tenant tenant, String recipient, String candidateName, String jobTitle, UUID offerId) {

    EmailTemplate template =
        templateService.offerDeclined(candidateName, jobTitle, tenant.getName());

    return send(tenant, NotificationType.OFFER_DECLINED, recipient, template, "Offer", offerId);
  }

  public Notification sendOfferWithdrawn(
      Tenant tenant, String recipient, String candidateName, String jobTitle, UUID offerId) {

    EmailTemplate template =
        templateService.offerWithdrawn(candidateName, jobTitle, tenant.getName());

    return send(tenant, NotificationType.OFFER_WITHDRAWN, recipient, template, "Offer", offerId);
  }

  private Notification send(
      Tenant tenant,
      NotificationType type,
      String recipient,
      EmailTemplate template,
      String relatedEntityType,
      UUID relatedEntityId) {

    return emailService.send(
        tenant,
        type,
        recipient,
        template.subject(),
        template.htmlBody(),
        template.textBody(),
        relatedEntityType,
        relatedEntityId);
  }
}
