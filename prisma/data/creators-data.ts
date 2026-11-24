import { CREATORS_PART_1 } from "./creators-part1.ts";
import { CREATORS_PART_2 } from "./creators-part2.ts";
import type { CreatorSeedData } from "./creators-types.ts";

export type { CreatorSeedData };
export const FAMOUS_CREATORS: CreatorSeedData[] = [
  ...CREATORS_PART_1,
  ...CREATORS_PART_2,
];
