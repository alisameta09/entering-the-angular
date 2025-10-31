import { Profile } from "./interfaces/profile.interface";
import { GlobalStoreService } from "./services/global-store.service";
import { ProfileService } from "./services/profile.service";

export * from './store';

export {
  ProfileService,
  GlobalStoreService
}

export type {
  Profile
}
