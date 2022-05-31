import { initializeDataSource } from '../../src/database/dataSource';
import UserFactory from './factories/UserFactory';
import ActivityFactory from './factories/ActivityFactory';
import ProgramPartFactory from './factories/ProgramPartFactory';
import SpeakerFactory from './factories/SpeakerFactory';
import ParticipantFactory from './factories/ParticipantFactory';
import PartnerFactory from './factories/PartnerFactory';
import RoleFactory from './factories/RoleFactory';
import SubscribeActivityFactory from './factories/SubscribeActivityFactory';

initializeDataSource().then(async (dataSource) => {
  await dataSource.dropDatabase();
  await dataSource.synchronize();

  const activityFactory = new ActivityFactory(dataSource);
  const participantFactory = new ParticipantFactory(dataSource);
  const partnerFactory = new PartnerFactory(dataSource);
  const programPartFactory = new ProgramPartFactory(dataSource);
  const roleFactory = new RoleFactory(dataSource);
  const speakerFactory = new SpeakerFactory(dataSource);
  const subscribeActivityFactory = new SubscribeActivityFactory(dataSource);
  const userFactory = new UserFactory(dataSource);

  const users = await userFactory.createMultiple(15);
  await partnerFactory.createMultiple(5);
  await roleFactory.createMultiple(3);
  await participantFactory.createMultiple(users, 10);
  const programParts = await programPartFactory.createMultiple(3);
  const speakers = await speakerFactory.createMultiple(3);
  const activities = await activityFactory.createMultiple(programParts, speakers, 20, true);
  await subscribeActivityFactory.createMultiple(activities, 10);
});
