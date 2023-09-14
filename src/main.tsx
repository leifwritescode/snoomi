import { Devvit } from '@devvit/public-api';
import AppInstallTrigger from './devvit/triggers/AppInstallTrigger.js';
import VirtualPetCustomPost from './devvit/custom-posts/VirtualPetCustomPost.js';
import ScheduledJobTime from './devvit/jobs/welfareTickJob.js';
import ScheduledJobGrowth from './devvit/jobs/ageTickJob.js';
import ShowBatchesMenuItem from './devvit/menu-items/ShowBatchesMenuItem.js';
import CreateNewSnoomiMenuItem from './devvit/menu-items/CreateNewSnoomiMenuItem.js';
import AppUpgradeTrigger from './devvit/triggers/AppUpgradeTrigger.js';

Devvit.configure({ redditAPI: true, kvStore: true });
Devvit.addSchedulerJob(ScheduledJobTime);
Devvit.addSchedulerJob(ScheduledJobGrowth);
Devvit.addMenuItem(CreateNewSnoomiMenuItem);
Devvit.addMenuItem(ShowBatchesMenuItem);
Devvit.addCustomPostType(VirtualPetCustomPost);
Devvit.addTrigger(AppInstallTrigger);
Devvit.addTrigger(AppUpgradeTrigger);

export default Devvit;
