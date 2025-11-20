import { DadataSuggestion } from "./interfaces/dadata.interfaces";
import { Profile } from "./interfaces/profile.interface";
import { DadataService } from "./services/dadata.service";
import { GlobalStoreService } from "./services/global-store.service";
import { ProfileService } from "./services/profile.service";

export * from './store';

export {
  ProfileService,
  GlobalStoreService,
  DadataService
}

export type {
  Profile,
  DadataSuggestion
}
