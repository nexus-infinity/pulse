# packages/nixos/pulse.nix — PULSE Sovereign Home Server Module
# Status: STUB — do not enable until Field-MacOS-DOJO complete
#
# Import into Field-NixOS-SOMA/dot-hive/default.nix when Phase 2 begins:
#
#   imports = [
#     # ... existing chakras ...
#     "${inputs.pulse}/packages/nixos/pulse.nix"
#   ];
#
# See packages/nixos/README.md for full architecture + phase boundary conditions.

{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.services.pulse;
in {
  options.services.pulse = {
    enable = mkEnableOption "PULSE sovereign home server";

    apiPort = mkOption {
      type    = types.port;
      default = 7331;
      description = "LAN port for PULSE HTTP/WS API";
    };

    webPort = mkOption {
      type    = types.port;
      default = 3000;
      description = "LAN port for PULSE web dashboard";
    };

    dataDir = mkOption {
      type    = types.path;
      default = "/var/lib/pulse";
      description = "State, database, and log directory";
    };

    # TODO Phase 2: per-service options
    # services.pulse.devicePoller.enable
    # services.pulse.sonosBridge.enable
    # services.pulse.irrigationBrain.enable
    # services.pulse.bleHub.enable
  };

  config = mkIf cfg.enable {
    # TODO Phase 2: wire service definitions from services/*.nix

    assertions = [{
      assertion = false;
      message   = "PULSE NixOS module is a Phase 2 stub. Do not enable yet.";
    }];
  };
}
