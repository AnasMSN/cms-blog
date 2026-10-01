import * as migration_20260930_052220_initial from './20260930_052220_initial';

export const migrations = [
  {
    up: migration_20260930_052220_initial.up,
    down: migration_20260930_052220_initial.down,
    name: '20260930_052220_initial'
  },
];
