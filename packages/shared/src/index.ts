// PULSE Shared — canonical exports
// Source of truth until monorepo migration sprint
//
// During Phase 1, live sources are in:
//   nexus-infinity/PULSE-Android/src/deviceRegistry.ts
//   nexus-infinity/PULSE-Android/src/spatial/SpatialTypes.ts
//   nexus-infinity/PULSE-Android/src/spatial/ZoneGeometry.ts
//   nexus-infinity/PULSE-Android/src/executeAction.ts
//
// When migration runs, those files move here and this becomes the real export.

export * from './deviceRegistry';
export * from './spatial/SpatialTypes';
export * from './spatial/ZoneGeometry';
export * from './executeAction';
