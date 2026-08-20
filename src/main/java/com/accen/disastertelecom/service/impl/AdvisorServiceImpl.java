package com.accen.disastertelecom.service.impl;

import com.accen.disastertelecom.dto.AdvisorRequest;
import com.accen.disastertelecom.dto.AdvisorResponse;
import com.accen.disastertelecom.service.AdvisorService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdvisorServiceImpl implements AdvisorService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    private final String apiKey;
    private final String apiUrl;
    private final String model;
    private final int maxOutputTokens;
    private final double temperature;

    public AdvisorServiceImpl(
            RestClient.Builder restClientBuilder,
            ObjectMapper objectMapper,
            @Value("${gemini.api.key}") String apiKey,
            @Value("${gemini.api.url}") String apiUrl,
            @Value("${gemini.model}") String model,
            @Value("${gemini.max-output-tokens:500}") int maxOutputTokens,
            @Value("${gemini.temperature:0.2}") double temperature
    ) {
        this.restClient = restClientBuilder.build();
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        this.model = model;
        this.maxOutputTokens = maxOutputTokens;
        this.temperature = temperature;
    }

    @Override
    public AdvisorResponse generateRecommendation(AdvisorRequest request) {
        validateConfiguration();
        validateRequest(request);

        String prompt = buildPrompt(request);

        Map<String, Object> requestBody = buildGeminiRequest(prompt);

        String endpoint = apiUrl
                + "/models/"
                + model
                + ":generateContent";

        try {
            String rawResponse = restClient.post()
                    .uri(endpoint)
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("x-goog-api-key", apiKey)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            String recommendation = extractRecommendation(rawResponse);

            return new AdvisorResponse(
                    recommendation,
                    model,
                    Instant.now(),
                    true
            );

        } catch (RestClientResponseException exception) {
            String responseBody = exception.getResponseBodyAsString();

            System.err.println(
                    "Gemini API request failed with status "
                            + exception.getStatusCode()
                            + ". Response: "
                            + responseBody
            );

            throw new IllegalStateException(
                    "KONEK Advisor could not generate a recommendation. "
                            + "Gemini API returned "
                            + exception.getStatusCode()
                            + "."
            );

        } catch (Exception exception) {
            System.err.println(
                    "KONEK Advisor error: " + exception.getMessage()
            );

            throw new IllegalStateException(
                    "KONEK Advisor could not generate a recommendation.",
                    exception
            );
        }
    }

    private void validateConfiguration() {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "GEMINI_API_KEY is missing. "
                            + "Set the environment variable before starting Spring Boot."
            );
        }
    }

    private void validateRequest(AdvisorRequest request) {
        if (request == null) {
            throw new IllegalArgumentException(
                    "The KONEK operational snapshot is required."
            );
        }
    }

    private Map<String, Object> buildGeminiRequest(String prompt) {
        Map<String, Object> textPart = Map.of(
                "text", prompt
        );

        Map<String, Object> content = Map.of(
                "role", "user",
                "parts", List.of(textPart)
        );

        Map<String, Object> generationConfig = new LinkedHashMap<>();
        generationConfig.put("temperature", temperature);
        generationConfig.put("maxOutputTokens", maxOutputTokens);

        Map<String, Object> requestBody = new LinkedHashMap<>();
        requestBody.put("contents", List.of(content));
        requestBody.put("generationConfig", generationConfig);

        return requestBody;
    }

    private String buildPrompt(AdvisorRequest request) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("""
                You are KONEK Advisor, an AI decision-support assistant for an
                academic disaster telecommunications resilience prototype in
                the Philippines.

                Analyze only the operational data supplied below.

                Your objectives:
                1. Identify the most urgent telecommunications problem.
                2. Prioritize restoration or coordination actions.
                3. Consider affected citizens, connectivity level, severity,
                   root cause, critical areas, and fallback connectivity.
                4. Recommend practical actions for LGU, DRRM, and telecom teams.

                Safety and scope rules:
                - Treat all supplied data as simulated demonstration data.
                - Do not claim to contact responders or change telecom systems.
                - Do not invent municipalities, facilities, incidents, or numbers.
                - If data is incomplete, explicitly say that the recommendation
                  is based on the available indicators.
                - Keep a human decision-maker responsible for final action.
                - Do not use Markdown headings, tables, or bullet points.
                - Produce one concise paragraph containing 3 to 5 sentences.
                - Begin with the highest-priority finding.
                - End with a clear human-validation statement.

                Current KONEK operational snapshot:
                """);

        prompt.append("\nAffected citizens: ")
                .append(valueOrUnavailable(request.affectedCitizens()));

        prompt.append("\nActive outages: ")
                .append(valueOrUnavailable(request.activeOutages()));

        prompt.append("\nConnectivity percentage: ")
                .append(valueOrUnavailable(request.connectivityPercent()));

        prompt.append("\nDisaster alerts: ")
                .append(valueOrUnavailable(request.disasterAlerts()));

        prompt.append("\nOperational sites: ")
                .append(valueOrUnavailable(request.operationalSites()));

        prompt.append("\nDown sites: ")
                .append(valueOrUnavailable(request.downSites()));

        prompt.append("\nHigh-risk municipalities: ")
                .append(valueOrUnavailable(request.highRiskMunicipalities()));

        prompt.append("\n\nIncident records:");

        if (request.incidents() == null || request.incidents().isEmpty()) {
            prompt.append("\nNo detailed incident records were supplied.");
        } else {
            int maximumIncidents = Math.min(request.incidents().size(), 15);

            for (int index = 0; index < maximumIncidents; index++) {
                AdvisorRequest.IncidentSnapshot incident =
                        request.incidents().get(index);

                prompt.append("\nIncident ")
                        .append(index + 1)
                        .append(": siteId=")
                        .append(valueOrUnavailable(incident.siteId()))
                        .append(", municipality=")
                        .append(valueOrUnavailable(incident.municipality()))
                        .append(", region=")
                        .append(valueOrUnavailable(incident.region()))
                        .append(", rootCause=")
                        .append(valueOrUnavailable(incident.rootCause()))
                        .append(", severity=")
                        .append(valueOrUnavailable(incident.severity()))
                        .append(", priorityScore=")
                        .append(valueOrUnavailable(incident.priorityScore()))
                        .append(", riskScore=")
                        .append(valueOrUnavailable(incident.riskScore()))
                        .append(", fallbackStatus=")
                        .append(valueOrUnavailable(incident.fallbackStatus()));
            }
        }

        prompt.append("""
                

                Generate the KONEK Advisor recommendation now.
                """);

        return prompt.toString();
    }

    private String extractRecommendation(String rawResponse) throws Exception {
        if (rawResponse == null || rawResponse.isBlank()) {
            throw new IllegalStateException(
                    "Gemini returned an empty response."
            );
        }

        JsonNode root = objectMapper.readTree(rawResponse);

        JsonNode textNode = root.path("candidates")
                .path(0)
                .path("content")
                .path("parts")
                .path(0)
                .path("text");

        if (textNode.isMissingNode() || textNode.asText().isBlank()) {
            JsonNode errorNode = root.path("error");

            if (!errorNode.isMissingNode()) {
                throw new IllegalStateException(
                        "Gemini error: " + errorNode.toString()
                );
            }

            throw new IllegalStateException(
                    "Gemini returned no recommendation text."
            );
        }

        return textNode.asText().trim();
    }

    private String valueOrUnavailable(Object value) {
        if (value == null) {
            return "unavailable";
        }

        String text = String.valueOf(value).trim();

        return text.isEmpty() ? "unavailable" : text;
    }
}