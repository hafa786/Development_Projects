package com.darmisolutions.darmihire.notification;

public enum NotificationType {

  // Candidate application
  APPLICATION_RECEIVED,

  // Interviews
  INTERVIEW_INVITATION,
  INTERVIEW_UPDATED,
  INTERVIEW_CANCELLED,

  // Offers
  OFFER_SENT,
  OFFER_ACCEPTED,
  OFFER_DECLINED,
  OFFER_WITHDRAWN,

  // Candidate lifecycle
  APPLICATION_REJECTED,

  // Internal recruiter notifications
  NEW_APPLICATION
}
