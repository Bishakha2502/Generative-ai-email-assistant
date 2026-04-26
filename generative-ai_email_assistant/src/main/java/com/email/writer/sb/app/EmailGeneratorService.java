package com.email.writer.sb.app;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.*;

@Service
public class EmailGeneratorService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    private final WebClient webClient;

    public EmailGeneratorService(WebClient.Builder builder) {
        this.webClient = builder.build();
    }

    public String generateEmailReply(String emailContent, String tone) {

        if (emailContent == null || emailContent.trim().isEmpty()) {
            return "Email content cannot be empty.";
        }

        String selectedTone =
                (tone == null || tone.trim().isEmpty())
                        ? "professional"
                        : tone;

        List<Map<String, String>> messages = new ArrayList<>();

        messages.add(Map.of(
                "role", "system",
                "content", "You are an assistant that writes professional email replies."
        ));

        messages.add(Map.of(
                "role", "user",
                "content",
                "Write a " + selectedTone + " reply for this email:\n\n" + emailContent
        ));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "llama-3.3-70b-versatile");
        requestBody.put("messages", messages);
        requestBody.put("temperature", 0.7);

        try {
            String response = webClient.post()
                    .uri(apiUrl)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey.trim())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return extractText(response);

        } catch (WebClientResponseException e) {
            return "Groq API Error: " + e.getResponseBodyAsString();

        } catch (Exception e) {
            return "Error generating email: " + e.getMessage();
        }
    }

    private String extractText(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            return root.path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();

        } catch (Exception e) {
            return response;
        }
    }
}