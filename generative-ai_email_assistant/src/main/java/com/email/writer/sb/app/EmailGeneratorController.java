package com.email.writer.sb.app;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "http://localhost:5173/")
public class EmailGeneratorController {

    private final EmailGeneratorService service;

    public EmailGeneratorController(EmailGeneratorService service) {
        this.service = service;
    }

    @PostMapping("/generate")
    public String generateEmail(@RequestBody EmailRequest request) {

        if (request.getEmailContent() == null || request.getEmailContent().trim().isEmpty()) {
            return "Email content cannot be empty.";
        }

        return service.generateEmailReply(
                request.getEmailContent(),
                request.getTone()
        );
    }
}