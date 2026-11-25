package com.darmisolutions.darmihire.notification.email;

import com.darmisolutions.darmihire.application.JobApplication;
import com.darmisolutions.darmihire.application.JobApplicationRepository;
import com.darmisolutions.darmihire.candidate.Candidate;
import com.darmisolutions.darmihire.interview.Interview;
import com.darmisolutions.darmihire.interview.InterviewRepository;
import com.darmisolutions.darmihire.job.Job;
import com.darmisolutions.darmihire.notification.Notification;
import com.darmisolutions.darmihire.notification.template.EmailTemplate;
import com.darmisolutions.darmihire.notification.template.EmailTemplateService;
import com.darmisolutions.darmihire.offer.Offer;
import com.darmisolutions.darmihire.offer.OfferRepository;
import com.darmisolutions.darmihire.tenant.Tenant;
import com.darmisolutions.darmihire.tenant.TenantUser;
import com.darmisolutions.darmihire.user.User;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationEmailFactory {

  private static final DateTimeFormatter INTERVIEW_DATE_FORMAT =
      DateTimeFormatter.ofPattern("dd MMM yyyy 'at' HH:mm z");

  private final JobApplicationRepository jobApplicationRepository;
  private final InterviewRepository interviewRepository;
  private final OfferRepository offerRepository;
  private final EmailTemplateService templateService;

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

  private EmailMessage createApplicationReceived(Notification notification) {

    JobApplication application = findApplication(notification);

    Candidate candidate = application.getCandidate();

    Job job = application.getJob();

    Tenant tenant = application.getTenant();

    EmailTemplate template =
        templateService.applicationReceived(
            candidateName(candidate),
            job.getTitle(),
            tenant.getName(),
            application.getId().toString());

    return toMessage(notification, template);
  }

  private EmailMessage createApplicationRejected(Notification notification) {

    JobApplication application = findApplication(notification);

    Candidate candidate = application.getCandidate();

    Job job = application.getJob();

    Tenant tenant = application.getTenant();

    EmailTemplate template =
        templateService.applicationRejected(
            candidateName(candidate), job.getTitle(), tenant.getName());

    return toMessage(notification, template);
  }

  private EmailMessage createInterviewInvitation(Notification notification) {

    Interview interview = findInterview(notification);

    JobApplication application = interview.getApplication();

    Candidate candidate = application.getCandidate();

    Job job = application.getJob();

    Tenant tenant = interview.getTenant();

    EmailTemplate template =
        templateService.interviewInvitation(
            candidateName(candidate),
            job.getTitle(),
            tenant.getName(),
            formatInterviewDateTime(interview),
            interview.getInterviewType().name(),
            interviewLocation(interview));

    return toMessage(notification, template);
  }

  private EmailMessage createInterviewUpdated(Notification notification) {

    Interview interview = findInterview(notification);

    JobApplication application = interview.getApplication();

    Candidate candidate = application.getCandidate();

    Job job = application.getJob();

    Tenant tenant = interview.getTenant();

    EmailTemplate template =
        templateService.interviewUpdated(
            candidateName(candidate),
            job.getTitle(),
            tenant.getName(),
            formatInterviewDateTime(interview),
            interview.getInterviewType().name(),
            interviewLocation(interview));

    return toMessage(notification, template);
  }

  private EmailMessage createInterviewCancelled(Notification notification) {

    Interview interview = findInterview(notification);

    JobApplication application = interview.getApplication();

    Candidate candidate = application.getCandidate();

    Job job = application.getJob();

    Tenant tenant = interview.getTenant();

    EmailTemplate template =
        templateService.interviewCancelled(
            candidateName(candidate), job.getTitle(), tenant.getName());

    return toMessage(notification, template);
  }

  private EmailMessage createOfferSent(Notification notification) {

    Offer offer = findOffer(notification);

    JobApplication application = offer.getApplication();

    Candidate candidate = application.getCandidate();

    Job job = application.getJob();

    Tenant tenant = offer.getTenant();

    EmailTemplate template =
        templateService.offerSent(candidateName(candidate), job.getTitle(), tenant.getName());

    return toMessage(notification, template);
  }

  private EmailMessage createOfferAccepted(Notification notification) {

    Offer offer = findOffer(notification);

    JobApplication application = offer.getApplication();

    Candidate candidate = application.getCandidate();

    Job job = application.getJob();

    Tenant tenant = offer.getTenant();

    EmailTemplate template =
        templateService.offerAccepted(candidateName(candidate), job.getTitle(), tenant.getName());

    return toMessage(notification, template);
  }

  private EmailMessage createOfferDeclined(Notification notification) {

    Offer offer = findOffer(notification);

    JobApplication application = offer.getApplication();

    Candidate candidate = application.getCandidate();

    Job job = application.getJob();

    Tenant tenant = offer.getTenant();

    EmailTemplate template =
        templateService.offerDeclined(candidateName(candidate), job.getTitle(), tenant.getName());

    return toMessage(notification, template);
  }

  private EmailMessage createOfferWithdrawn(Notification notification) {

    Offer offer = findOffer(notification);

    JobApplication application = offer.getApplication();

    Candidate candidate = application.getCandidate();

    Job job = application.getJob();

    Tenant tenant = offer.getTenant();

    EmailTemplate template =
        templateService.offerWithdrawn(candidateName(candidate), job.getTitle(), tenant.getName());

    return toMessage(notification, template);
  }

  private EmailMessage createNewApplication(Notification notification) {

    JobApplication application = findApplication(notification);

    Candidate candidate = application.getCandidate();

    Job job = application.getJob();

    Tenant tenant = application.getTenant();

    TenantUser recipient = job.getRecruiter() != null ? job.getRecruiter() : job.getHiringManager();

    String recruiterName = recipient != null ? userName(recipient.getUser()) : "Hiring team";

    EmailTemplate template =
        templateService.newApplication(
            recruiterName, candidateName(candidate), job.getTitle(), tenant.getName());

    return toMessage(notification, template);
  }

  private JobApplication findApplication(Notification notification) {

    UUID tenantId = requireTenantId(notification);

    return jobApplicationRepository
        .findByIdAndTenantId(requireRelatedEntityId(notification), tenantId)
        .orElseThrow(
            () ->
                new IllegalStateException(
                    "Job application not found for notification " + notification.getId()));
  }

  private Interview findInterview(Notification notification) {

    UUID tenantId = requireTenantId(notification);

    return interviewRepository
        .findByIdAndTenantId(requireRelatedEntityId(notification), tenantId)
        .orElseThrow(
            () ->
                new IllegalStateException(
                    "Interview not found for notification " + notification.getId()));
  }

  private Offer findOffer(Notification notification) {

    UUID tenantId = requireTenantId(notification);

    return offerRepository
        .findByIdAndTenantId(requireRelatedEntityId(notification), tenantId)
        .orElseThrow(
            () ->
                new IllegalStateException(
                    "Offer not found for notification " + notification.getId()));
  }

  private UUID requireTenantId(Notification notification) {

    if (notification.getTenant() == null || notification.getTenant().getId() == null) {

      throw new IllegalStateException("Notification tenant is required");
    }

    return notification.getTenant().getId();
  }

  private UUID requireRelatedEntityId(Notification notification) {

    if (notification.getRelatedEntityId() == null) {

      throw new IllegalStateException("Notification related entity ID is required");
    }

    return notification.getRelatedEntityId();
  }

  private EmailMessage toMessage(Notification notification, EmailTemplate template) {

    return new EmailMessage(
        notification.getRecipient(), template.subject(), template.htmlBody(), template.textBody());
  }

  private String candidateName(Candidate candidate) {

    return fullName(candidate.getFirstName(), candidate.getLastName());
  }

  private String userName(User user) {

    if (user == null) {
      return "Hiring team";
    }

    return fullName(user.getFirstName(), user.getLastName());
  }

  private String fullName(String firstName, String lastName) {

    String first = firstName == null ? "" : firstName.trim();

    String last = lastName == null ? "" : lastName.trim();

    String name = (first + " " + last).trim();

    return name.isBlank() ? "Candidate" : name;
  }

  private String formatInterviewDateTime(Interview interview) {

    ZoneId zoneId = resolveZoneId(interview.getTimezone());

    return INTERVIEW_DATE_FORMAT.format(interview.getStartTime().atZone(zoneId));
  }

  private ZoneId resolveZoneId(String timezone) {

    if (timezone == null || timezone.isBlank()) {

      return ZoneId.of("UTC");
    }

    try {
      return ZoneId.of(timezone);
    } catch (Exception ignored) {
      return ZoneId.of("UTC");
    }
  }

  private String interviewLocation(Interview interview) {

    if (interview.getMeetingUrl() != null && !interview.getMeetingUrl().isBlank()) {

      return interview.getMeetingUrl().trim();
    }

    if (interview.getLocation() != null && !interview.getLocation().isBlank()) {

      return interview.getLocation().trim();
    }

    return null;
  }
}
