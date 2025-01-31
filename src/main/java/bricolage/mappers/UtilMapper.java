package bricolage.mappers;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;

public class UtilMapper {
    public static LocalDateTime parseDate(String date) {
        if (date == null || date.equalsIgnoreCase("null") || date.isEmpty()) {
            return null;
        }
        try {
            // Parse the date assuming it follows ISO format or adjust as needed
            return LocalDateTime.parse(date);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format. Expected format: ISO date (e.g., 2023-01-31T20:18:25)");
        }
    }
    public static BigDecimal parseBigDecimal(String value) {
        if (value == null || value.equalsIgnoreCase("null") || value.isEmpty()) {
            return null; // Treat null or "null" as an absent parameter
        }
        try {
            return new BigDecimal(value);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid price value: " + value);
        }
    }
}
