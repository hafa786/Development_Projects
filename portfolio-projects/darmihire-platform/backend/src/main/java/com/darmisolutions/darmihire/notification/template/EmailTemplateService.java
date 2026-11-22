package com.darmisolutions.darmihire.notification.template;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailTemplateService {

  private final HtmlEscaper htmlEscaper;

  public EmailTemplate applicationReceived(
      String candidateName, String jobTitle, String companyName, String applicationReference) {

    String subject = "Application received — " + jobTitle;

    String text =
        """
                Hi %s,

                Thank you for applying for %s at %s.

                We have successfully received your application.

                Application reference: %s

                The hiring team will review your application and contact you if there is a suitable next step.

                Best regards,
                %s
                Powered by DarmiHire
                """
            .formatted(candidateName, jobTitle, companyName, applicationReference, companyName);

    String html =
        layout(
            companyName,
            """
                <h2>Application received</h2>

                <p>Hi %s,</p>

                <p>
                    Thank you for applying for
                    <strong>%s</strong> at <strong>%s</strong>.
                </p>

                <p>
                    We have successfully received your application.
                </p>

                <div class="info">
                    <strong>Application reference</strong><br>
                    %s
                </div>

                <p>
                    The hiring team will review your application
                    and contact you if there is a suitable next step.
                </p>
                """
                .formatted(e(candidateName), e(jobTitle), e(companyName), e(applicationReference)));

    return new EmailTemplate(subject, html, text);
  }

  public EmailTemplate interviewInvitation(
      String candidateName,
      String jobTitle,
      String companyName,
      String interviewDateTime,
      String interviewType,
      String location) {

    String subject = "Interview invitation — " + jobTitle;

    String text =
        """
                Hi %s,

                You have been invited to an interview for %s at %s.

                Date and time: %s
                Interview type: %s
                Location / meeting details: %s

                Best regards,
                %s
                Powered by DarmiHire
                """
            .formatted(
                candidateName,
                jobTitle,
                companyName,
                interviewDateTime,
                interviewType,
                valueOrFallback(location),
                companyName);

    String html =
        layout(
            companyName,
            """
                <h2>Interview invitation</h2>

                <p>Hi %s,</p>

                <p>
                    You have been invited to an interview for
                    <strong>%s</strong> at <strong>%s</strong>.
                </p>

                <div class="info">
                    <strong>Date and time</strong><br>
                    %s
                    <br><br>

                    <strong>Interview type</strong><br>
                    %s
                    <br><br>

                    <strong>Location / meeting details</strong><br>
                    %s
                </div>
                """
                .formatted(
                    e(candidateName),
                    e(jobTitle),
                    e(companyName),
                    e(interviewDateTime),
                    e(interviewType),
                    e(valueOrFallback(location))));

    return new EmailTemplate(subject, html, text);
  }

  public EmailTemplate interviewUpdated(
      String candidateName,
      String jobTitle,
      String companyName,
      String interviewDateTime,
      String interviewType,
      String location) {

    String subject = "Interview updated — " + jobTitle;

    String html =
        layout(
            companyName,
            """
                <h2>Your interview has been updated</h2>

                <p>Hi %s,</p>

                <p>
                    Your interview for <strong>%s</strong>
                    at <strong>%s</strong> has been updated.
                </p>

                <div class="info">
                    <strong>New date and time</strong><br>
                    %s
                    <br><br>

                    <strong>Interview type</strong><br>
                    %s
                    <br><br>

                    <strong>Location / meeting details</strong><br>
                    %s
                </div>
                """
                .formatted(
                    e(candidateName),
                    e(jobTitle),
                    e(companyName),
                    e(interviewDateTime),
                    e(interviewType),
                    e(valueOrFallback(location))));

    String text =
        """
                Hi %s,

                Your interview for %s at %s has been updated.

                New date and time: %s
                Interview type: %s
                Location / meeting details: %s

                Best regards,
                %s
                """
            .formatted(
                candidateName,
                jobTitle,
                companyName,
                interviewDateTime,
                interviewType,
                valueOrFallback(location),
                companyName);

    return new EmailTemplate(subject, html, text);
  }

  public EmailTemplate interviewCancelled(
      String candidateName, String jobTitle, String companyName) {

    String subject = "Interview cancelled — " + jobTitle;

    String text =
        """
                Hi %s,

                Your interview for %s at %s has been cancelled.

                If another interview is scheduled, the hiring team
                will contact you with the updated information.

                Best regards,
                %s
                """
            .formatted(candidateName, jobTitle, companyName, companyName);

    String html =
        layout(
            companyName,
            """
                <h2>Interview cancelled</h2>

                <p>Hi %s,</p>

                <p>
                    Your interview for <strong>%s</strong>
                    at <strong>%s</strong> has been cancelled.
                </p>

                <p>
                    If another interview is scheduled, the hiring
                    team will contact you with the updated information.
                </p>
                """
                .formatted(e(candidateName), e(jobTitle), e(companyName)));

    return new EmailTemplate(subject, html, text);
  }

  public EmailTemplate offerSent(String candidateName, String jobTitle, String companyName) {

    String subject = "Your offer from " + companyName;

    String text =
        """
                Hi %s,

                We are pleased to let you know that an offer
                has been prepared for the %s position at %s.

                Please review the offer information provided by
                the hiring team.

                Best regards,
                %s
                """
            .formatted(candidateName, jobTitle, companyName, companyName);

    String html =
        layout(
            companyName,
            """
                <h2>You have received an offer</h2>

                <p>Hi %s,</p>

                <p>
                    We are pleased to let you know that an offer
                    has been prepared for the <strong>%s</strong>
                    position at <strong>%s</strong>.
                </p>

                <p>
                    Please review the offer information provided
                    by the hiring team.
                </p>
                """
                .formatted(e(candidateName), e(jobTitle), e(companyName)));

    return new EmailTemplate(subject, html, text);
  }

  public EmailTemplate offerAccepted(String candidateName, String jobTitle, String companyName) {

    String subject = "Offer accepted — " + jobTitle;

    return simpleTemplate(
        subject,
        companyName,
        candidateName,
        "Offer accepted",
        "Your offer for " + jobTitle + " at " + companyName + " has been accepted successfully.");
  }

  public EmailTemplate offerDeclined(String candidateName, String jobTitle, String companyName) {

    String subject = "Offer declined — " + jobTitle;

    return simpleTemplate(
        subject,
        companyName,
        candidateName,
        "Offer declined",
        "Your response for the " + jobTitle + " offer at " + companyName + " has been recorded.");
  }

  public EmailTemplate offerWithdrawn(String candidateName, String jobTitle, String companyName) {

    String subject = "Offer update — " + jobTitle;

    return simpleTemplate(
        subject,
        companyName,
        candidateName,
        "Offer withdrawn",
        "The offer for " + jobTitle + " at " + companyName + " has been withdrawn.");
  }

  public EmailTemplate applicationRejected(
      String candidateName, String jobTitle, String companyName) {

    String subject = "Update regarding your application — " + jobTitle;

    String text =
        """
            Hi %s,

            Thank you for your interest in the %s position at %s
            and for the time you invested in the application process.

            After careful consideration, we have decided not to
            move forward with your application for this position.

            We appreciate your interest in %s and wish you all the
            best in your job search and future opportunities.

            Best regards,
            %s
            """
            .formatted(candidateName, jobTitle, companyName, companyName, companyName);

    String html =
        layout(
            companyName,
            """
            <h2>Update regarding your application</h2>

            <p>Hi %s,</p>

            <p>
                Thank you for your interest in the
                <strong>%s</strong> position at
                <strong>%s</strong> and for the time you
                invested in the application process.
            </p>

            <p>
                After careful consideration, we have decided
                not to move forward with your application for
                this position.
            </p>

            <p>
                We appreciate your interest in %s and wish you
                all the best in your job search and future
                opportunities.
            </p>
            """
                .formatted(e(candidateName), e(jobTitle), e(companyName), e(companyName)));

    return new EmailTemplate(subject, html, text);
  }

  private EmailTemplate simpleTemplate(
      String subject, String companyName, String candidateName, String heading, String message) {

    String text =
        """
                Hi %s,

                %s

                Best regards,
                %s
                """
            .formatted(candidateName, message, companyName);

    String html =
        layout(
            companyName,
            """
                <h2>%s</h2>

                <p>Hi %s,</p>

                <p>%s</p>
                """
                .formatted(e(heading), e(candidateName), e(message)));

    return new EmailTemplate(subject, html, text);
  }

  private String layout(String companyName, String content) {

    return """
                <!doctype html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport"
                          content="width=device-width, initial-scale=1">
                </head>

                <body style="
                    margin:0;
                    padding:0;
                    background:#f6f8fa;
                    font-family:Arial,sans-serif;
                    color:#17212b;
                ">
                    <table width="100%%"
                           cellspacing="0"
                           cellpadding="0"
                           style="padding:32px 16px;">
                        <tr>
                            <td align="center">

                                <table width="100%%"
                                       cellspacing="0"
                                       cellpadding="0"
                                       style="
                                           max-width:640px;
                                           background:#ffffff;
                                           border-radius:12px;
                                           overflow:hidden;
                                           border:1px solid #e5e7eb;
                                       ">

                                    <tr>
                                        <td style="
                                            padding:24px 32px;
                                            background:#059669;
                                            color:white;
                                            font-size:22px;
                                            font-weight:700;
                                        ">
                                            %s
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="
                                            padding:32px;
                                            font-size:15px;
                                            line-height:1.7;
                                        ">
                                            %s
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="
                                            padding:20px 32px;
                                            background:#f9fafb;
                                            color:#6b7280;
                                            font-size:12px;
                                        ">
                                            Powered by DarmiHire
                                            — Modern hiring, powered by AI.
                                        </td>
                                    </tr>

                                </table>

                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """
        .formatted(e(companyName), content);
  }

  private String e(String value) {
    return htmlEscaper.escape(value);
  }

  private String valueOrFallback(String value) {

    if (value == null || value.isBlank()) {
      return "The hiring team will provide details.";
    }

    return value;
  }
}
