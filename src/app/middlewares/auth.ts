import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiErrors';
import { StatusCodes } from 'http-status-codes';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import config from '../../config';
import { Secret } from 'jsonwebtoken';

const auth =
  (...requiredRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      //   console.log(req.headers);
      if (!token) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authorized');
      }
      // verify token
      let verifiedUser = null;
      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);
      console.log(verifiedUser);

      req.user = verifiedUser;

      // guard with role
      if (
        requiredRoles.length &&
        !requiredRoles.includes(verifiedUser?.role as string)
      ) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'Forbidden request');
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
