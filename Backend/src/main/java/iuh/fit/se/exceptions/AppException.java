package iuh.fit.se.exceptions;

import lombok.Getter;

@Getter
public class AppException extends RuntimeException {
    protected ErrorCode errorCode;
    public AppException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
