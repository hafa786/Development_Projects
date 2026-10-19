CREATE UNIQUE INDEX
    uq_offers_one_accepted_per_application
ON offers(application_id)
WHERE status = 'ACCEPTED';