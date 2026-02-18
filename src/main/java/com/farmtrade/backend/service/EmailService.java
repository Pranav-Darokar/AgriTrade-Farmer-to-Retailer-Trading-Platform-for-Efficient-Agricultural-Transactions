package com.farmtrade.backend.service;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    public void sendSimpleMessage(String to, String subject, String text) {
        // In a real application, you would use JavaMailSender here.
        // For this demo/dev environment without SMTP credentials, we log the email.

        logger.info("==================================================");
        logger.info("MOCK EMAIL SENDING");
        logger.info("To: {}", to);
        logger.info("Subject: {}", subject);
        logger.info("Body: {}", text);
        logger.info("==================================================");
    }
}
