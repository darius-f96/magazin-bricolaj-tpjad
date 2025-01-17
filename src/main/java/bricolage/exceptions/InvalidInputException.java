package bricolage.exceptions;

public class InvalidInputException extends RuntimeException{
    @Override
    public String getMessage() {
        return "Invalid input provided. Please check that the user and the product exist in the database before creating an order";
    }
}
