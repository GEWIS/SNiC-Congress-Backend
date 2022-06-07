import { DataSource } from 'typeorm';
import { expect } from 'chai';
import { initializeDataSource } from '../../../src/database/dataSource';
import User from '../../../src/entities/User';
import UserFactory from '../../database/factories/UserFactory';
import UserService from '../../../src/services/UserService';

describe('UserService', () => {
  let dataSource: DataSource;
  let ctx: {
    service: UserService,
    users: User[],
  };

  before(async () => {
    dataSource = await initializeDataSource();

    const service = new UserService();

    const users = await (new UserFactory(dataSource)).createMultiple(5);

    ctx = {
      service,
      users,
    };
  });

  after(async () => {
    await dataSource.destroy();
  });

  describe('getAllUsers', () => {
    it('should correctly get all users', async () => {
      const users = await ctx.service.getAllUsers();

      expect(users.length).to.equal(ctx.users.length);
    });
  });

  describe('getUser', () => {
    it('should correctly get single user', async () => {
      const actualUser = ctx.users[0];
      const user = await ctx.service.getUser(actualUser.id);

      expect(user).to.deep.equal(actualUser);
    });
  });

  describe('getUser - Error', () => {
    it('should throw an error', async () => {
      const promise = ctx.service.getUser(ctx.users.length + 1);
      await expect(promise).to.eventually.be.rejectedWith('User not found');
    });
  });

  describe('createUser', () => {
    it('should correctly create a user', async () => {
      const params = {
        email: 'string',
        name: 'string',
        dietaryWishes: 'string',
        agreeToPrivacyPolicy: true,
      };

      const user = await ctx.service.createUser(params);
      expect(user).to.deep.equal(await User.findOne({ where: { id: user.id } }));
    });
  });

  describe('deleteUser', () => {
    it('should correctly delete a user', async () => {
      await ctx.service.deleteUser(ctx.users[1].id);

      expect(ctx.users.length).to.equal((await User.find()).length);
    });
  });

  describe('deleteUser - Error', () => {
    it('should throw an error', async () => {
      const promise = ctx.service.deleteUser(ctx.users.length * 2);
      await expect(promise).to.eventually.be.rejectedWith('User not found');
    });
  });

  describe('updateUser', () => {
    it('should correctly update a user', async () => {
      const params = {
        name: 'new_string',
      };

      const actualUser = ctx.users[0];
      const user = await ctx.service.updateUser(actualUser.id, params);
      const actualUserFromDatabase = await User.findOne({ where: { id: actualUser.id } });

      expect(user.name).to.equal(actualUserFromDatabase!.name);
    });
  });

  describe('updateUser - Error', () => {
    it('should throw an error', async () => {
      const params = {
        name: 'new_string',
      };
      const promise = ctx.service.updateUser(ctx.users.length * 2, params);
      await expect(promise).to.eventually.be.rejectedWith('User not found');
    });
  });

  describe('initializeService', () => {
    it('should correctly use given repo', async () => {
      const alternativeDataSource = await initializeDataSource();
      const usersDirect = await (new UserFactory(alternativeDataSource)).createMultiple(3);
      const alternativeService = new UserService(alternativeDataSource.getRepository(User));
      const users = await alternativeService.getAllUsers();

      expect(users.length).to.equal(usersDirect.length);
    });
  });
});
