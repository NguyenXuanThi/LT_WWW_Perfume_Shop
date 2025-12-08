package iuh.fit.se.exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION("Uncategorized Exception", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_POST_REQUEST("Thêm không thành công", HttpStatus.BAD_REQUEST),
    CURRENT_PASSWORD_DOES_NOT_MATCH("Current Password does not match", HttpStatus.BAD_REQUEST),
    CONFIRM_PASSWORD_DOES_NOT_MATCH("Confirm Password does not match", HttpStatus.BAD_REQUEST),
    CAN_NOT_CHANGE_ACTIVE_ADMIN("Can not change active admin", HttpStatus.BAD_REQUEST),
    ;

    private final String message;
    private final HttpStatus httpStatus;
}
