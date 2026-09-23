import { Request, Response, NextFunction } from "express";
import { Secret } from "jsonwebtoken";
import ApiError from "../../errors/ApiError";
import { httpStatus } from "../../shared/http-status";
import config from "../../config";
import { jwtHelpers } from "../../shared/jwtHelpers";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const auth = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if ((req as any).cookies && (req as any).cookies.token) {
      token = (req as any).cookies.token;
    }

    if (!token) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Authentication required. Please log in."
      );
    }

    try {
      const decoded = jwtHelpers.verifyToken(
        token,
        config.jwt.secret as Secret
      ) as {
        id: string;
        email: string;
      };

      (req as AuthenticatedRequest).user = decoded;
      next();
    } catch (err) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Session expired or invalid token. Please log in again."
      );
    }
  };
};

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if ((req as any).cookies && (req as any).cookies.token) {
    token = (req as any).cookies.token;
  }

  if (token) {
    try {
      const decoded = jwtHelpers.verifyToken(
        token,
        config.jwt.secret as Secret
      ) as {
        id: string;
        email: string;
      };
      (req as AuthenticatedRequest).user = decoded;
    } catch (err) {
      // Ignore token verification errors for optional auth
    }
  }

  next();
};
