"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.ResourceNotFoundError = void 0;
class ResourceNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "ResourceNotFoundError";
    }
}
exports.ResourceNotFoundError = ResourceNotFoundError;
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
