package com.darmisolutions.darmihire.scorecard;

import com.darmisolutions.darmihire.application.JobApplication;
import com.darmisolutions.darmihire.application.JobApplicationRepository;

import com.darmisolutions.darmihire.scorecard.dto.*;

import com.darmisolutions.darmihire.tenant.context.TenantContext;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ApplicationEvaluationService {

    private final TenantContext tenantContext;

    private final JobApplicationRepository
            applicationRepository;

    private final InterviewFeedbackRepository
            feedbackRepository;

    private final InterviewFeedbackRatingRepository
            ratingRepository;

    @Transactional(readOnly = true)
    public ApplicationEvaluationSummaryResponse
    getApplicationSummary(
            UUID applicationId
    ) {
        UUID tenantId = requireTenantId();

        JobApplication application =
                applicationRepository
                        .findByIdAndTenantId(
                                applicationId,
                                tenantId
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Application not found"
                                )
                        );

        List<InterviewFeedback> feedbacks =
                feedbackRepository
                        .findAllByTenantIdAndInterviewApplicationIdAndSubmittedAtIsNotNullOrderBySubmittedAtAsc(
                                tenantId,
                                applicationId
                        );

        List<FeedbackData> feedbackData =
                feedbacks.stream()
                        .map(feedback ->
                                loadFeedbackData(
                                        tenantId,
                                        feedback
                                )
                        )
                        .toList();

        double weightedScore =
                calculateOverallScore(
                        feedbackData
                );

        RecommendationDistributionResponse
                recommendations =
                buildRecommendationDistribution(
                        feedbacks
                );

        List<CriterionEvaluationSummaryResponse>
                criteria =
                buildCriterionSummary(
                        feedbackData
                );

        List<InterviewEvaluationSummaryResponse>
                interviews =
                buildInterviewSummary(
                        feedbackData
                );

        return new ApplicationEvaluationSummaryResponse(
                application.getId(),
                weightedScore,
                feedbacks.size(),
                recommendations,
                criteria,
                interviews
        );
    }

    private FeedbackData loadFeedbackData(
            UUID tenantId,
            InterviewFeedback feedback
    ) {
        List<InterviewFeedbackRating> ratings =
                ratingRepository
                        .findAllByTenantIdAndFeedbackIdOrderByCriterionSortOrderAsc(
                                tenantId,
                                feedback.getId()
                        );

        return new FeedbackData(
                feedback,
                ratings,
                calculateFeedbackScore(ratings)
        );
    }

    /*
     * Σ(rating × weight) / Σ(weight)
     */
    private double calculateFeedbackScore(
            List<InterviewFeedbackRating> ratings
    ) {
        if (ratings.isEmpty()) {
            return 0.0;
        }

        double weightedTotal = 0;
        int totalWeight = 0;

        for (InterviewFeedbackRating rating : ratings) {

            int weight =
                    rating.getCriterion()
                            .getWeight();

            weightedTotal +=
                    rating.getRating()
                            * weight;

            totalWeight += weight;
        }

        if (totalWeight == 0) {
            return 0.0;
        }

        return round(
                weightedTotal /
                        totalWeight
        );
    }

    private double calculateOverallScore(
            List<FeedbackData> feedbackData
    ) {
        if (feedbackData.isEmpty()) {
            return 0.0;
        }

        /*
         * Every submitted interviewer evaluation
         * contributes equally to the application
         * score.
         */
        double average =
                feedbackData.stream()
                        .mapToDouble(
                                FeedbackData::weightedScore
                        )
                        .average()
                        .orElse(0.0);

        return round(average);
    }

    private RecommendationDistributionResponse
    buildRecommendationDistribution(
            List<InterviewFeedback> feedbacks
    ) {
        int strongNo = 0;
        int no = 0;
        int neutral = 0;
        int yes = 0;
        int strongYes = 0;

        for (InterviewFeedback feedback : feedbacks) {

            if (feedback.getRecommendation() == null) {
                continue;
            }

            switch (feedback.getRecommendation()) {

                case STRONG_NO ->
                        strongNo++;

                case NO ->
                        no++;

                case NEUTRAL ->
                        neutral++;

                case YES ->
                        yes++;

                case STRONG_YES ->
                        strongYes++;
            }
        }

        return new RecommendationDistributionResponse(
                strongNo,
                no,
                neutral,
                yes,
                strongYes
        );
    }

    private List<CriterionEvaluationSummaryResponse>
    buildCriterionSummary(
            List<FeedbackData> feedbackData
    ) {
        Map<UUID, CriterionAccumulator>
                accumulatorMap =
                new LinkedHashMap<>();

        for (FeedbackData data : feedbackData) {

            for (InterviewFeedbackRating rating :
                    data.ratings()) {

                ScorecardCriterion criterion =
                        rating.getCriterion();

                CriterionAccumulator accumulator =
                        accumulatorMap
                                .computeIfAbsent(
                                        criterion.getId(),
                                        ignored ->
                                                new CriterionAccumulator(
                                                        criterion.getId(),
                                                        criterion.getName(),
                                                        criterion.getWeight()
                                                )
                                );

                accumulator.add(
                        rating.getRating()
                );
            }
        }

        return accumulatorMap
                .values()
                .stream()
                .map(accumulator ->
                        new CriterionEvaluationSummaryResponse(
                                accumulator.criterionId,
                                accumulator.criterionName,
                                round(
                                        accumulator.total /
                                                accumulator.count
                                ),
                                accumulator.count,
                                accumulator.weight
                        )
                )
                .toList();
    }

    private List<InterviewEvaluationSummaryResponse>
    buildInterviewSummary(
            List<FeedbackData> feedbackData
    ) {
        Map<UUID, List<FeedbackData>>
                byInterview =
                new LinkedHashMap<>();

        for (FeedbackData data : feedbackData) {

            UUID interviewId =
                    data.feedback()
                            .getInterview()
                            .getId();

            byInterview
                    .computeIfAbsent(
                            interviewId,
                            ignored ->
                                    new ArrayList<>()
                    )
                    .add(data);
        }

        List<InterviewEvaluationSummaryResponse>
                result =
                new ArrayList<>();

        for (List<FeedbackData> interviewFeedback :
                byInterview.values()) {

            if (interviewFeedback.isEmpty()) {
                continue;
            }

            InterviewFeedback first =
                    interviewFeedback
                            .getFirst()
                            .feedback();

            double interviewScore =
                    interviewFeedback
                            .stream()
                            .mapToDouble(
                                    FeedbackData::weightedScore
                            )
                            .average()
                            .orElse(0.0);

            List<InterviewerEvaluationResponse>
                    interviewers =
                    interviewFeedback
                            .stream()
                            .map(data -> {

                                InterviewFeedback feedback =
                                        data.feedback();

                                return new InterviewerEvaluationResponse(
                                        feedback.getId(),
                                        feedback.getInterview()
                                                .getId(),
                                        feedback.getInterviewer()
                                                .getId(),
                                        interviewerName(
                                                feedback
                                        ),
                                        feedback.getRecommendation(),
                                        data.weightedScore(),
                                        feedback.getSubmittedAt()
                                );
                            })
                            .toList();

            result.add(
                    new InterviewEvaluationSummaryResponse(
                            first.getInterview()
                                    .getId(),

                            first.getInterview()
                                    .getTitle(),

                            round(interviewScore),

                            interviewFeedback.size(),

                            interviewers
                    )
            );
        }

        return result;
    }

    private String interviewerName(
            InterviewFeedback feedback
    ) {
        var user =
                feedback.getInterviewer()
                        .getUser();

        return (
                user.getFirstName()
                        + " "
                        + user.getLastName()
        ).trim();
    }

    private double round(
            double value
    ) {
        return Math.round(
                value * 100.0
        ) / 100.0;
    }

    private UUID requireTenantId() {
        UUID tenantId =
                tenantContext.getTenantId();

        if (tenantId == null) {
            throw new IllegalStateException(
                    "Tenant context is required"
            );
        }

        return tenantId;
    }

    private record FeedbackData(
            InterviewFeedback feedback,
            List<InterviewFeedbackRating> ratings,
            double weightedScore
    ) {
    }

    private static class CriterionAccumulator {

        private final UUID criterionId;
        private final String criterionName;
        private final int weight;

        private double total;
        private int count;

        private CriterionAccumulator(
                UUID criterionId,
                String criterionName,
                int weight
        ) {
            this.criterionId =
                    criterionId;

            this.criterionName =
                    criterionName;

            this.weight =
                    weight;
        }

        private void add(
                int rating
        ) {
            total += rating;
            count++;
        }
    }
}