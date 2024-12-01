class BaseError extends Error {
    public readonly name:string;
    public readonly status:number;
    public readonly message:string;

    constructor(name: string, status: number, description: string) {
        super(description)
        this.name = name;
        this.status = status;
        this.message = description;
        Object.setPrototypeOf(this, new.target.prototype)
        Error.captureStackTrace(this)
    }
}

export class APIError extends BaseError {
    constructor(description = "api error") {
        super(
            "api internal server error",
            500,
            description
        );
    }
}

export class ValidationError extends BaseError {
    constructor(description = "bad request") {
        super(
            "bad request",
            400,
            description
        );
    }
}

export class AuthorizeError extends BaseError {
    constructor(description = "access denied") {
        super(
            "access denied",
            403,
            description
        );
    }
}

export class NotFoundError extends BaseError {
    constructor(description = "not found") {
        super(
            "not found",
            404,
            description
        );
    }
}