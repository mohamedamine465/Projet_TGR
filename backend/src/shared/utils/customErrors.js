export class AppError extends Error {
  constructor(message, statusCode, data = null) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Ressource introuvable") {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Requête invalide") {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Non autorisé", data = null) {
    super(message, 401, data);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Accès refusé", data = null) {
    super(message, 403, data);
  }
}
