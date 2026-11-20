package com.darmisolutions.darmihire.notification.transactional;

import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Component
public class AfterCommitExecutor {

  public void execute(Runnable action) {

    if (!TransactionSynchronizationManager.isActualTransactionActive()) {
      action.run();
      return;
    }

    TransactionSynchronizationManager.registerSynchronization(
        new TransactionSynchronization() {

          @Override
          public void afterCommit() {
            action.run();
          }
        });
  }
}
