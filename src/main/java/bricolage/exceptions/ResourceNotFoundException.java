package bricolage.exceptions;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class ResourceNotFoundException extends RuntimeException {
    private String message;

    @Override
    public String getMessage() {
        return message;
    }
}
