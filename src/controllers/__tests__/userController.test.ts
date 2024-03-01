jest.mock('@utils/LoggerFactory/DevelopmentLogger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn()
  }
}));


jest.mock('@services/user.services', () => {
  const services = jest.fn();
  services.prototype.findUser = jest.fn();
  services.prototype.createUser = jest.fn(() => ({ _id: 1 }));
  return services;
});
jest.mock('@services/jwt.services', () => {
  const services = jest.fn();
  services.prototype.signPayload = jest.fn();
  return services;
});
jest.mock('@services/response.services');
import { expect, jest, test } from '@jest/globals';
import * as controller from '../userController'
import { Request, Response, NextFunction } from 'express'

import Logger from '@utils/LoggerFactory/DevelopmentLogger'
import UserServices from '@services/user.services'
import UserRepository from '@repositories/user.repository';
import CustomError from '@utils/CustomError';
import { sendHTTPResponse } from '@services/response.services';
import { IResponse } from 'types/IResponse.interfaces';

import JwtServices from '@services/jwt.services'
import { afterEach } from 'node:test';

describe('Register Controller', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test'
    process.env.VERIFICATION_LINK_EXPIRY_DEV = '1m'
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return a success response', async () => {
    const mReq: Request = { body: { fullname: '', email: '', password: '' } } as unknown as Request;
    const mRes: Response = {} as unknown as Response;
    const mNext: NextFunction = jest.fn();
    await controller.registerUser(mReq, mRes, mNext);

    const response: IResponse = {
      res: mRes,
      success: true,
      statusCode: 201,
      message: { message: 'An verification link has been sent to your email address' }
    }
    expect(Logger.info).toHaveBeenCalled();

    expect(jest.spyOn(new UserServices, 'findUser')).toHaveBeenCalled()
    expect(jest.spyOn(new UserServices, 'createUser')).toHaveBeenCalled()
    expect(jest.spyOn(new JwtServices, 'signPayload')).toHaveBeenCalled()
    expect(sendHTTPResponse).toHaveBeenCalledWith(response)
    expect(sendHTTPResponse).toHaveBeenCalledTimes(1)

  }, 40000);
})
